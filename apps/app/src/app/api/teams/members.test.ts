/**
 * KC-004 / KC-023 — Team member RBAC boundary tests driving the real
 * PATCH/DELETE route handlers: owners cannot be demoted or removed by
 * admins, admins cannot be removed by admins, and the last owner can
 * never be demoted or removed.
 */
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { createTeamForUser } from '@/lib/teams';
import { createSession, SESSION_COOKIE } from '@/lib/session';

import { PATCH as changeMemberRole, DELETE as removeMember } from './[teamId]/members/[memberId]/route';

const { cookieContext, databasePath, databaseUrl } = await vi.hoisted(async () => {
  const { AsyncLocalStorage } = await import('node:async_hooks');
  const { randomUUID } = await import('node:crypto');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const databasePath = join(tmpdir(), `slipstream-members-${randomUUID()}.db`);
  return {
    cookieContext: new AsyncLocalStorage<Map<string, { name: string; value: string }>>(),
    databasePath,
    databaseUrl: `file:${databasePath.replaceAll('\\', '/')}`,
  };
});

vi.mock('@slipstream-ui/db', async (importOriginal) => {
  const original = await importOriginal<typeof import('@slipstream-ui/db')>();
  return { ...original, prisma: new original.PrismaClient({ datasourceUrl: databaseUrl }) };
});

vi.mock('next/headers', () => ({
  cookies: async () => {
    const current = cookieContext.getStore() ?? store;
    return {
      get: (name: string) => current.get(name),
      set: (name: string, value: string) => current.set(name, { name, value }),
      delete: (name: string) => current.delete(name),
      getAll: () => [...current.values()],
    };
  },
}));

const store = new Map<string, { name: string; value: string }>();
let suffix: string;

type Fixture = {
  ownerEmail: string;
  secondOwnerEmail: string;
  adminEmail: string;
  memberEmail: string;
  teamId: string;
  ownerMembershipId: string;
  secondOwnerMembershipId: string;
  adminMembershipId: string;
  memberMembershipId: string;
};

let fixture: Fixture;
const userIds: string[] = [];
const teamIds: string[] = [];

async function makeUser(email: string) {
  const user = await prisma.user.create({ data: { email } });
  userIds.push(user.id);
  return user;
}

function memberRequest(method: 'PATCH' | 'DELETE', body?: unknown) {
  return new Request('http://localhost/api/teams/team/members/member', {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

function routeParams(memberId: string, teamId = fixture.teamId) {
  return { params: Promise.resolve({ teamId, memberId }) };
}

beforeAll(() => {
  const dbRoot = fileURLToPath(new URL('../../../../../../packages/db/', import.meta.url));
  execFileSync(process.execPath, [path.join(dbRoot, 'node_modules/prisma/build/index.js'), 'db', 'push', '--skip-generate', '--schema', path.join(dbRoot, 'prisma/schema.prisma')], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });
});

beforeEach(async () => {
  suffix = randomUUID();
  store.clear();
  const [owner, secondOwner, admin, member] = await Promise.all([
    makeUser(`rbac-owner-${suffix}@test.dev`),
    makeUser(`rbac-owner2-${suffix}@test.dev`),
    makeUser(`rbac-admin-${suffix}@test.dev`),
    makeUser(`rbac-member-${suffix}@test.dev`),
  ]);
  const team = await createTeamForUser(owner.id, `RBAC ${suffix}`);
  teamIds.push(team.id);
  const [secondOwnerMembership, adminMembership, memberMembership] = await Promise.all([
    prisma.membership.create({ data: { teamId: team.id, userId: secondOwner.id, role: 'OWNER' } }),
    prisma.membership.create({ data: { teamId: team.id, userId: admin.id, role: 'ADMIN' } }),
    prisma.membership.create({ data: { teamId: team.id, userId: member.id, role: 'MEMBER' } }),
  ]);
  const ownerMembership = await prisma.membership.findUniqueOrThrow({
    where: { teamId_userId: { teamId: team.id, userId: owner.id } },
  });
  fixture = {
    ownerEmail: owner.email,
    secondOwnerEmail: secondOwner.email,
    adminEmail: admin.email,
    memberEmail: member.email,
    teamId: team.id,
    ownerMembershipId: ownerMembership.id,
    secondOwnerMembershipId: secondOwnerMembership.id,
    adminMembershipId: adminMembership.id,
    memberMembershipId: memberMembership.id,
  };
});

afterEach(async () => {
  await prisma.team.deleteMany({ where: { id: { in: teamIds } } });
  await prisma.auditLog.deleteMany({ where: { actorId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  teamIds.length = 0;
  userIds.length = 0;
  store.clear();
});

afterAll(async () => {
  await prisma.$disconnect();
  for (const suffix of ['', '-journal', '-wal', '-shm']) rmSync(databasePath + suffix, { force: true });
});

async function signIn(email: string) {
  store.clear();
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  await createSession(user.id);
  expect(store.get(SESSION_COOKIE)).toBeDefined();
}

async function requestAs(email: string) {
  await signIn(email);
  const cookies = new Map(store);
  return (method: 'PATCH' | 'DELETE', memberId: string, request = memberRequest(method, method === 'PATCH' ? { role: 'MEMBER' } : undefined)) =>
    cookieContext.run(cookies, () => (method === 'PATCH' ? changeMemberRole : removeMember)(request, routeParams(memberId)));
}

async function memberState() {
  return {
    memberships: await prisma.membership.findMany({ where: { teamId: fixture.teamId }, orderBy: { id: 'asc' } }),
    audits: await prisma.auditLog.findMany({ where: { actorId: { in: userIds } }, orderBy: { id: 'asc' } }),
  };
}

describe('concurrent owner changes (KC-023)', () => {
  it.each([
    ['PATCH', 'PATCH', 'self'],
    ['PATCH', 'PATCH', 'other'],
    ['DELETE', 'DELETE', 'other'],
    ['DELETE', 'PATCH', 'other'],
    ['PATCH', 'DELETE', 'other'],
    ['DELETE', 'DELETE', 'self'],
  ] as const)('%s / %s targeting %s preserves an owner and audits only committed changes', async (firstMethod, secondMethod, target) => {
    const first = await requestAs(fixture.ownerEmail);
    const second = await requestAs(fixture.secondOwnerEmail);
    const firstId = target === 'self' ? fixture.ownerMembershipId : fixture.secondOwnerMembershipId;
    const secondId = target === 'self' ? fixture.secondOwnerMembershipId : fixture.ownerMembershipId;
    const responses = await Promise.all([first(firstMethod, firstId), second(secondMethod, secondId)]);
    const state = await memberState();
    expect(state.memberships.filter((membership) => membership.role === 'OWNER').length).toBeGreaterThanOrEqual(1);
    const successes = responses.filter((response) => response.status === 200);
    if (firstMethod === 'DELETE' && target === 'self') {
      expect(responses.map((response) => response.status)).toEqual([400, 400]);
      expect(successes).toHaveLength(0);
    } else {
      expect(successes).toHaveLength(1);
      for (const response of responses.filter((response) => response.status !== 200)) {
        expect([400, 403, 404, 409]).toContain(response.status);
        if (response.status === 409) expect(await response.json()).toMatchObject({ error: { code: 'conflict' } });
      }
    }
    expect(state.audits).toHaveLength(successes.length);
    for (const [index, response] of responses.entries()) {
      const memberId = index === 0 ? firstId : secondId;
      const method = index === 0 ? firstMethod : secondMethod;
      const actorEmail = index === 0 ? fixture.ownerEmail : fixture.secondOwnerEmail;
      if (response.status !== 200) continue;
      const actor = await prisma.user.findUniqueOrThrow({ where: { email: actorEmail } });
      expect(state.audits).toContainEqual(expect.objectContaining({
        actorId: actor.id,
        targetId: memberId,
        action: method === 'PATCH' ? 'team.member.role_changed' : 'team.member.removed',
      }));
      const membership = state.memberships.find((entry) => entry.id === memberId);
      if (method === 'PATCH') expect(membership?.role).toBe('MEMBER');
      else expect(membership).toBeUndefined();
    }
  });

  it.each(['demoted', 'removed', 'revoked', 'expired', 'suspended'] as const)('revalidates authorization when %s while the PATCH body arrives', async (change) => {
    const send = await requestAs(fixture.ownerEmail);
    const actor = await prisma.user.findUniqueOrThrow({ where: { email: fixture.ownerEmail } });
    let before: Awaited<ReturnType<typeof memberState>> | undefined;
    const body = new ReadableStream<Uint8Array>({
      async pull(controller) {
        if (change === 'demoted') await prisma.membership.update({ where: { id: fixture.ownerMembershipId }, data: { role: 'MEMBER' } });
        if (change === 'removed') await prisma.membership.delete({ where: { id: fixture.ownerMembershipId } });
        if (change === 'revoked') await prisma.session.deleteMany({ where: { userId: actor.id } });
        if (change === 'expired') await prisma.session.updateMany({ where: { userId: actor.id }, data: { expiresAt: new Date(0) } });
        if (change === 'suspended') await prisma.user.update({ where: { id: actor.id }, data: { suspendedAt: new Date() } });
        before = await memberState();
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ role: 'ADMIN' })));
        controller.close();
      },
    }, { highWaterMark: 0 });
    const init: RequestInit & { duplex: 'half' } = {
      method: 'PATCH', headers: { 'content-type': 'application/json' }, body, duplex: 'half',
    };
    const response = await send('PATCH', fixture.memberMembershipId, new Request('http://localhost/api/teams/team/members/member', init));
    expect(response.status).toBe(change === 'demoted' ? 403 : change === 'removed' ? 404 : 401);
    expect(before).toBeDefined();
    expect(await memberState()).toEqual(before);
  });

  it.each(['PATCH', 'DELETE'] as const)('returns conflict without effects when SQLite blocks %s', async (method) => {
    const send = await requestAs(fixture.ownerEmail);
    const before = await memberState();
    await prisma.$transaction(async (tx) => {
      await tx.membership.update({ where: { id: fixture.ownerMembershipId }, data: { role: 'OWNER' } });
      const response = await send(method, fixture.secondOwnerMembershipId);
      expect(response.status).toBe(409);
      expect(await response.json()).toMatchObject({ error: { code: 'conflict' } });
    }, { timeout: 20_000 });
    expect(await memberState()).toEqual(before);
    expect((await send(method, fixture.secondOwnerMembershipId)).status).toBe(200);
  }, 30_000);

  it.each(['PATCH', 'DELETE'] as const)('rolls back %s when its audit fails and allows retry', async (method) => {
    const send = await requestAs(fixture.ownerEmail);
    const before = await memberState();
    await prisma.$executeRawUnsafe(`CREATE TRIGGER kc023_audit_failure BEFORE INSERT ON "AuditLog" WHEN NEW."targetId" = '${fixture.secondOwnerMembershipId}' BEGIN SELECT RAISE(ABORT, 'injected member audit failure'); END`);
    try {
      expect((await send(method, fixture.secondOwnerMembershipId)).status).toBe(500);
      expect(await memberState()).toEqual(before);
    } finally {
      await prisma.$executeRawUnsafe('DROP TRIGGER kc023_audit_failure');
    }
    expect((await send(method, fixture.secondOwnerMembershipId)).status).toBe(200);
    expect((await memberState()).audits).toHaveLength(1);
  });
});

describe('team member role changes (PATCH)', () => {
  it('rejects an admin demoting an owner', async () => {
    await signIn(fixture.adminEmail);
    try {
      const response = await changeMemberRole(
        memberRequest('PATCH', { role: 'MEMBER' }),
        routeParams(fixture.ownerMembershipId)
      );
      expect(response.status).toBe(403);
    } finally {
      await prisma.membership.update({ where: { id: fixture.ownerMembershipId }, data: { role: 'OWNER' } });
    }
  });

  it('rejects an admin changing roles to owner', async () => {
    await signIn(fixture.adminEmail);
    try {
      const response = await changeMemberRole(
        memberRequest('PATCH', { role: 'OWNER' }),
        routeParams(fixture.memberMembershipId)
      );
      expect(response.status).toBe(403);
    } finally {
      await prisma.membership.update({ where: { id: fixture.memberMembershipId }, data: { role: 'MEMBER' } });
    }
  });

  it('lets an owner demote a co-owner while another owner remains', async () => {
    await signIn(fixture.ownerEmail);
    try {
      const response = await changeMemberRole(
        memberRequest('PATCH', { role: 'ADMIN' }),
        routeParams(fixture.secondOwnerMembershipId)
      );
      expect(response.status).toBe(200);
      expect((await prisma.membership.findUniqueOrThrow({ where: { id: fixture.secondOwnerMembershipId } })).role).toBe('ADMIN');
    } finally {
      await prisma.membership.update({ where: { id: fixture.secondOwnerMembershipId }, data: { role: 'OWNER' } });
    }
  });

  it('rejects the sole owner demoting themselves', async () => {
    await signIn(fixture.secondOwnerEmail);
    // Remove the co-owner so exactly one owner remains.
    await prisma.membership.update({ where: { id: fixture.ownerMembershipId }, data: { role: 'ADMIN' } });
    try {
      const response = await changeMemberRole(
        memberRequest('PATCH', { role: 'ADMIN' }),
        routeParams(fixture.secondOwnerMembershipId)
      );
      expect(response.status).toBe(400);
      expect((await prisma.membership.findUniqueOrThrow({ where: { id: fixture.secondOwnerMembershipId } })).role).toBe('OWNER');
    } finally {
      await prisma.membership.update({ where: { id: fixture.ownerMembershipId }, data: { role: 'OWNER' } });
    }
  });

  it('allows a member promotion to admin by the owner', async () => {
    await signIn(fixture.ownerEmail);
    const response = await changeMemberRole(
      memberRequest('PATCH', { role: 'ADMIN' }),
      routeParams(fixture.memberMembershipId)
    );
    expect(response.status).toBe(200);
    expect((await prisma.membership.findUniqueOrThrow({ where: { id: fixture.memberMembershipId } })).role).toBe('ADMIN');
    await prisma.membership.update({ where: { id: fixture.memberMembershipId }, data: { role: 'MEMBER' } });
  });

  it('rejects role changes from non-admins', async () => {
    await signIn(fixture.memberEmail);
    const response = await changeMemberRole(
      memberRequest('PATCH', { role: 'ADMIN' }),
      routeParams(fixture.memberMembershipId)
    );
    expect(response.status).toBe(403);
  });
});

describe('team member removal (DELETE)', () => {
  it('rejects an admin removing another admin', async () => {
    await signIn(fixture.adminEmail);
    const otherAdmin = await makeUser(`rbac-admin2-${suffix}@test.dev`);
    const otherAdminMembership = await prisma.membership.create({
      data: { teamId: fixture.teamId, userId: otherAdmin.id, role: 'ADMIN' },
    });
    try {
      const response = await removeMember(memberRequest('DELETE'), routeParams(otherAdminMembership.id));
      expect(response.status).toBe(403);
      expect(await prisma.membership.findUnique({ where: { id: otherAdminMembership.id } })).not.toBeNull();
    } finally {
      await prisma.membership.delete({ where: { id: otherAdminMembership.id } }).catch(() => {});
    }
  });

  it('rejects an admin removing an owner', async () => {
    await signIn(fixture.adminEmail);
    try {
      const response = await removeMember(memberRequest('DELETE'), routeParams(fixture.ownerMembershipId));
      expect(response.status).toBe(403);
    } finally {
      await prisma.membership.update({ where: { id: fixture.ownerMembershipId }, data: { role: 'OWNER' } }).catch(() => {});
    }
  });

  it('rejects removing yourself through the member endpoint', async () => {
    await signIn(fixture.ownerEmail);
    const response = await removeMember(memberRequest('DELETE'), routeParams(fixture.ownerMembershipId));
    expect(response.status).toBe(400);
    expect(await prisma.membership.findUnique({ where: { id: fixture.ownerMembershipId } })).not.toBeNull();
  });

  it('lets an owner remove a member', async () => {
    await signIn(fixture.ownerEmail);
    const removable = await makeUser(`rbac-removable-${suffix}@test.dev`);
    const removableMembership = await prisma.membership.create({
      data: { teamId: fixture.teamId, userId: removable.id, role: 'MEMBER' },
    });
    const response = await removeMember(memberRequest('DELETE'), routeParams(removableMembership.id));
    expect(response.status).toBe(200);
    expect(await prisma.membership.findUnique({ where: { id: removableMembership.id } })).toBeNull();
  });

  it('lets an admin remove a member', async () => {
    await signIn(fixture.adminEmail);
    const removable = await makeUser(`rbac-removable2-${suffix}@test.dev`);
    const removableMembership = await prisma.membership.create({
      data: { teamId: fixture.teamId, userId: removable.id, role: 'MEMBER' },
    });
    const response = await removeMember(memberRequest('DELETE'), routeParams(removableMembership.id));
    expect(response.status).toBe(200);
    expect(await prisma.membership.findUnique({ where: { id: removableMembership.id } })).toBeNull();
  });
});
