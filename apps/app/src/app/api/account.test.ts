/**
 * Account self-service tests: GDPR/CCPA export + deletion through the real
 * route handlers. Covers confirmation gates, admin block, team ownership
 * edge cases, and referential cleanup.
 */
import { describe, expect, it, afterAll } from 'vitest';
import { getCookieStore } from '../../test/cookies-mock';
getCookieStore(); // installs the next/headers cookie mock
import { prisma } from '@slipstream-ui/db';

import { DELETE as deleteAccountRoute } from './account/route';
import { GET as exportRoute } from './account/export/route';
import { createSession } from '@/lib/session';
import { hashPassword } from '@/lib/passwords';
import { activateSubscription } from '@/lib/billing';

const suffix = Date.now();
const createdUserIds: string[] = [];
const createdTeamIds: string[] = [];

function del(body: unknown) {
  return new Request('http://localhost/api/account', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function makeUser(email: string, role: 'USER' | 'ADMIN' = 'USER') {
  const user = await prisma.user.create({
    data: { email, role, passwordHash: hashPassword('password123'), emailVerifiedAt: new Date() },
  });
  createdUserIds.push(user.id);
  return user;
}

async function makeTeam(name: string) {
  const team = await prisma.team.create({ data: { name, slug: `${name}-${suffix}-${Math.random().toString(36).slice(2, 8)}` } });
  createdTeamIds.push(team.id);
  return team;
}

afterAll(async () => {
  await prisma.emailDelivery.deleteMany({ where: { toEmail: { contains: `@acct-${suffix}` } } });
  await prisma.auditLog.deleteMany({ where: { OR: [{ actorId: { in: createdUserIds } }, { action: 'account.delete' }] } });
  await prisma.licenseKey.deleteMany({ where: { ownerId: { in: createdUserIds } } });
  await prisma.teamInvite.deleteMany({ where: { teamId: { in: createdTeamIds } } });
  await prisma.payment.deleteMany({ where: { teamId: { in: createdTeamIds } } });
  await prisma.subscription.deleteMany({ where: { teamId: { in: createdTeamIds } } });
  await prisma.membership.deleteMany({ where: { teamId: { in: createdTeamIds } } });
  await prisma.team.deleteMany({ where: { id: { in: createdTeamIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.$disconnect();
});

describe('account export', () => {
  it('returns a JSON attachment with account data and no secrets', async () => {
    const user = await makeUser(`export-${suffix}@acct-${suffix}.dev`);
    await prisma.apiKey.create({
      data: { userId: user.id, name: 'ci', prefix: `pk_exp_${suffix}`, keyHash: 'secret-hash' },
    });
    await createSession(user.id);

    const response = await exportRoute(new Request('http://localhost/api/account/export'));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-disposition')).toContain('slipstream-data-export.json');

    const body = await response.json();
    expect(body.account.email).toBe(user.email);
    expect(body.apiKeys[0].prefix).toBe(`pk_exp_${suffix}`);
    expect(JSON.stringify(body)).not.toContain('secret-hash');
    expect(JSON.stringify(body)).not.toContain('passwordHash');
  });
});

describe('account deletion', () => {
  it('rejects wrong email confirmation and wrong password', async () => {
    const user = await makeUser(`gate-${suffix}@acct-${suffix}.dev`);
    await createSession(user.id);

    expect((await deleteAccountRoute(del({ confirmEmail: 'other@x.dev', password: 'password123' }))).status).toBe(400);
    expect((await deleteAccountRoute(del({ confirmEmail: user.email, password: 'wrong-pass' }))).status).toBe(400);
    expect(await prisma.user.findUnique({ where: { id: user.id } })).not.toBeNull();
  });

  it('blocks admin self-deletion', async () => {
    const admin = await makeUser(`admin-${suffix}@acct-${suffix}.dev`, 'ADMIN');
    await createSession(admin.id);
    const response = await deleteAccountRoute(del({ confirmEmail: admin.email, password: 'password123' }));
    expect(response.status).toBe(400);
    expect(await prisma.user.findUnique({ where: { id: admin.id } })).not.toBeNull();
  });

  it('deletes a personal account, cancels its subscription, and keeps audit trail', async () => {
    const user = await makeUser(`del-${suffix}@acct-${suffix}.dev`);
    const team = await makeTeam(`personal-${suffix}`);
    await prisma.membership.create({ data: { teamId: team.id, userId: user.id, role: 'OWNER' } });
    await activateSubscription(team.id, 'PRO');
    await prisma.licenseKey.create({
      data: { key: `lic-${suffix}`, prefix: `licp_${suffix}`, ownerId: user.id, teamId: team.id, plan: 'PRO' },
    });
    await prisma.payment.create({
      data: { teamId: team.id, userId: user.id, amountCents: 2900, description: 'Pro plan', externalId: `pi_${suffix}` },
    });
    await createSession(user.id);

    const response = await deleteAccountRoute(del({ confirmEmail: user.email, password: 'password123' }));
    expect(response.status).toBe(200);

    expect(await prisma.user.findUnique({ where: { id: user.id } })).toBeNull();
    expect(await prisma.session.count({ where: { userId: user.id } })).toBe(0);
    expect(await prisma.licenseKey.count({ where: { ownerId: user.id } })).toBe(0);

    // Personal team survives as a billing shell with the subscription ended.
    const sub = await prisma.subscription.findUnique({ where: { teamId: team.id } });
    expect(sub?.plan).toBe('FREE');
    expect(sub?.status).toBe('CANCELED');
    const payment = await prisma.payment.findFirst({ where: { teamId: team.id } });
    expect(payment?.userId).toBeNull(); // financial record kept, identity removed

    const auditRow = await prisma.auditLog.findFirst({ where: { action: 'account.delete', targetId: user.id } });
    expect(auditRow).not.toBeNull();
    expect(auditRow?.actorId).toBeNull(); // actor link nulled by SetNull
  });

  it('promotes the longest-tenured admin when deleting an owner of a shared team', async () => {
    const owner = await makeUser(`owner-${suffix}@acct-${suffix}.dev`);
    const adminMember = await makeUser(`member-admin-${suffix}@acct-${suffix}.dev`);
    const plainMember = await makeUser(`member-${suffix}@acct-${suffix}.dev`);
    const team = await makeTeam(`shared-${suffix}`);
    await prisma.membership.create({ data: { teamId: team.id, userId: owner.id, role: 'OWNER' } });
    await prisma.membership.create({ data: { teamId: team.id, userId: plainMember.id, role: 'MEMBER' } });
    await prisma.membership.create({ data: { teamId: team.id, userId: adminMember.id, role: 'ADMIN' } });
    await createSession(owner.id);

    const response = await deleteAccountRoute(del({ confirmEmail: owner.email, password: 'password123' }));
    expect(response.status).toBe(200);

    const promoted = await prisma.membership.findUnique({
      where: { teamId_userId: { teamId: team.id, userId: adminMember.id } },
    });
    expect(promoted?.role).toBe('OWNER');
    expect(await prisma.membership.count({ where: { teamId: team.id, userId: owner.id } })).toBe(0);
    expect(await prisma.user.findUnique({ where: { id: owner.id } })).toBeNull();
    // Other members and the team itself survive.
    expect(await prisma.user.findUnique({ where: { id: adminMember.id } })).not.toBeNull();
    expect(await prisma.user.findUnique({ where: { id: plainMember.id } })).not.toBeNull();
  });

  it('refuses deletion when the user owns a shared team with no admin successor', async () => {
    const owner = await makeUser(`blocked-${suffix}@acct-${suffix}.dev`);
    const member = await makeUser(`blocked-member-${suffix}@acct-${suffix}.dev`);
    const team = await makeTeam(`blocked-${suffix}`);
    await prisma.membership.create({ data: { teamId: team.id, userId: owner.id, role: 'OWNER' } });
    await prisma.membership.create({ data: { teamId: team.id, userId: member.id, role: 'MEMBER' } });
    await createSession(owner.id);

    const response = await deleteAccountRoute(del({ confirmEmail: owner.email, password: 'password123' }));
    expect(response.status).toBe(400);
    expect(await prisma.user.findUnique({ where: { id: owner.id } })).not.toBeNull();
  });
});
