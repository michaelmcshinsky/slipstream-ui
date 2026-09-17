/**
 * KC-004 / KC-023 — Team member RBAC boundary tests driving the real
 * PATCH/DELETE route handlers: owners cannot be demoted or removed by
 * admins, admins cannot be removed by admins, and the last owner can
 * never be demoted or removed.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { getCookieStore } from '../../../test/cookies-mock';
import { createTeamForUser } from '@/lib/teams';
import { createSession, SESSION_COOKIE } from '@/lib/session';

import { PATCH as changeMemberRole, DELETE as removeMember } from './[teamId]/members/[memberId]/route';

const store = getCookieStore();
const suffix = Date.now();

interface Fixture {
  ownerEmail: string;
  secondOwnerEmail: string;
  adminEmail: string;
  memberEmail: string;
  teamId: string;
  ownerMembershipId: string;
  secondOwnerMembershipId: string;
  adminMembershipId: string;
  memberMembershipId: string;
}

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
  return { params: Promise.resolve({ teamId, memberId }) } as never;
}

beforeAll(async () => {
  const [owner, secondOwner, admin, member] = await Promise.all([
    makeUser(`rbac-owner-${suffix}@test.dev`),
    makeUser(`rbac-owner2-${suffix}@test.dev`),
    makeUser(`rbac-admin-${suffix}@test.dev`),
    makeUser(`rbac-member-${suffix}@test.dev`),
  ]);
  const team = await createTeamForUser(owner.id, 'RBAC Route Team');
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

afterAll(async () => {
  for (const id of teamIds) await prisma.team.delete({ where: { id } }).catch(() => {});
  for (const id of userIds) await prisma.user.delete({ where: { id } }).catch(() => {});
  await prisma.$disconnect();
});

async function signIn(email: string) {
  store.clear();
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  await createSession(user.id);
  expect(store.get(SESSION_COOKIE)).toBeDefined();
}

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
