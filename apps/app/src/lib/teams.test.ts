import { randomUUID } from 'node:crypto';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSession } from './session';
import { POST as acceptInviteRoute } from '../app/api/invites/accept/route';
import { POST as createInviteRoute } from '../app/api/teams/[teamId]/invites/route';
import { prisma } from '@slipstream-ui/db';
import { generateToken, hashToken } from './tokens';
import { createTeamForUser, inviteMember, acceptInvite, requireMembership, TeamError } from './teams';
import { activateSubscription } from './billing';

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => cookieStore.get(name),
    set: (name: string, value: string) => cookieStore.set(name, { name, value }),
    delete: (name: string) => cookieStore.delete(name),
  }),
}));

const cookieStore = new Map<string, { name: string; value: string }>();
const createdUserIds: string[] = [];
const createdTeamIds: string[] = [];

beforeEach(() => cookieStore.clear());
afterEach(() => vi.restoreAllMocks());

function inviteRequest(body: unknown, pathname = '/api/invites/accept') {
  return new Request(`http://localhost${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': randomUUID() },
    body: JSON.stringify(body),
  });
}

async function inviteFixture(role = 'MEMBER') {
  const suffix = randomUUID();
  const owner = await makeUser(`invite-owner-${suffix}@test.dev`);
  const recipient = await makeUser(`invite-recipient-${suffix}@test.dev`);
  const other = await makeUser(`invite-other-${suffix}@test.dev`);
  const team = await createSeatedTeamForUser(owner.id, `Invite ${suffix}`);
  createdTeamIds.push(team.id);
  const invite = await inviteMember({ teamId: team.id, email: recipient.email, role, invitedById: owner.id });
  return { owner, recipient, other, team, ...invite };
}

async function inviteState(teamId: string) {
  return {
    invites: await prisma.teamInvite.findMany({ where: { teamId }, orderBy: { id: 'asc' } }),
    memberships: await prisma.membership.findMany({ where: { teamId }, orderBy: { id: 'asc' } }),
    audits: await prisma.auditLog.findMany({ where: { targetId: teamId }, orderBy: { id: 'asc' } }),
  };
}

async function makeUser(email: string) {
  // emailVerifiedAt stamps these fixtures as grandfathered/migrated accounts
  // (KC-040): direct-DB fixtures predate the verification requirement.
  const user = await prisma.user.create({ data: { email, emailVerifiedAt: new Date() } });
  createdUserIds.push(user.id);
  return user;
}

/** Invite/acceptance flows need seat capacity (KC-013); grant a TEAM plan. */
async function createSeatedTeamForUser(userId: string, name: string) {
  const team = await createTeamForUser(userId, name);
  await activateSubscription(team.id, 'TEAM');
  return team;
}

afterAll(async () => {
  await prisma.team.deleteMany({ where: { id: { in: createdTeamIds } } });
  await prisma.auditLog.deleteMany({ where: { actorId: { in: createdUserIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.$disconnect();
});

describe('teams', () => {
  it('creates a team with the creator as OWNER', async () => {
    const owner = await makeUser(`owner-${Date.now()}@test.dev`);
    const team = await createTeamForUser(owner.id, 'Acme Inc');
    createdTeamIds.push(team.id);

    expect(team.slug).toMatch(/^acme-inc-[0-9a-f]{8}$/);
    const membership = await prisma.membership.findUnique({
      where: { teamId_userId: { teamId: team.id, userId: owner.id } },
    });
    expect(membership?.role).toBe('OWNER');
  });

  it('derives unique slugs on collision', async () => {
    const a = await makeUser(`slug-a-${Date.now()}@test.dev`);
    const b = await makeUser(`slug-b-${Date.now()}@test.dev`);
    const team1 = await createTeamForUser(a.id, 'Same Name');
    const team2 = await createTeamForUser(b.id, 'Same Name');
    createdTeamIds.push(team1.id, team2.id);
    expect(team1.slug).toMatch(/^same-name-[0-9a-f]{8}$/);
    expect(team2.slug).toMatch(/^same-name-[0-9a-f]{8}$/);
    expect(team1.slug).not.toBe(team2.slug);
  });

  describe('invites', () => {
    it('creates an invite whose token can be accepted once', async () => {
      const owner = await makeUser(`inv-owner-${Date.now()}@test.dev`);
      const invitee = await makeUser(`inv-member-${Date.now()}@test.dev`);
      const team = await createSeatedTeamForUser(owner.id, 'Invite Team');
      createdTeamIds.push(team.id);

      const { token } = await inviteMember({ teamId: team.id, email: invitee.email, role: 'MEMBER', invitedById: owner.id });
      const result = await acceptInvite(token, invitee.id);
      expect(result.teamId).toBe(team.id);

      const membership = await prisma.membership.findUnique({
        where: { teamId_userId: { teamId: team.id, userId: invitee.id } },
      });
      expect(membership?.role).toBe('MEMBER');

      // Second acceptance of the same token fails.
      await expect(acceptInvite(token, invitee.id)).rejects.toThrow(TeamError);
    });

    it('rejects duplicate invites and existing members', async () => {
      const owner = await makeUser(`dup-owner-${Date.now()}@test.dev`);
      const member = await makeUser(`dup-member-${Date.now()}@test.dev`);
      const team = await createSeatedTeamForUser(owner.id, 'Dup Team');
      createdTeamIds.push(team.id);

      await inviteMember({ teamId: team.id, email: member.email, role: 'MEMBER', invitedById: owner.id });
      await expect(
        inviteMember({ teamId: team.id, email: member.email, role: 'MEMBER', invitedById: owner.id })
      ).rejects.toThrow(/already/i);

      await prisma.membership.create({ data: { teamId: team.id, userId: member.id, role: 'MEMBER' } });
      await expect(
        inviteMember({ teamId: team.id, email: `x-${Date.now()}@test.dev`, role: 'MEMBER', invitedById: owner.id })
      ).resolves.toBeTruthy();
      // Existing member check:
      await expect(
        inviteMember({ teamId: team.id, email: member.email, role: 'ADMIN', invitedById: owner.id })
      ).rejects.toThrow(/already a member/i);
    });

    it('rejects invalid roles and emails', async () => {
      const owner = await makeUser(`bad-invite-${Date.now()}@test.dev`);
      const team = await createSeatedTeamForUser(owner.id, 'Bad Invite Team');
      createdTeamIds.push(team.id);

      await expect(
        inviteMember({ teamId: team.id, email: 'a@b.dev', role: 'OWNER', invitedById: owner.id })
      ).rejects.toThrow(/invalid invite role/i);
      await expect(
        inviteMember({ teamId: team.id, email: 'not-an-email', role: 'MEMBER', invitedById: owner.id })
      ).rejects.toThrow(/invalid email/i);
    });
  });

  describe('reissued invitations (KC-012/KC-022)', () => {
    async function reusableFixture(state: 'expired' | 'accepted') {
      const fixture = await inviteFixture();
      if (state === 'expired') {
        await prisma.teamInvite.update({ where: { id: fixture.inviteId }, data: { expiresAt: new Date(0) } });
      } else {
        await acceptInvite(fixture.token, fixture.recipient.id);
        await prisma.membership.delete({ where: { teamId_userId: { teamId: fixture.team.id, userId: fixture.recipient.id } } });
      }
      await prisma.membership.create({ data: { teamId: fixture.team.id, userId: fixture.other.id, role: 'ADMIN' } });
      return fixture;
    }

    it.each(['expired', 'accepted'] as const)('reuses a persisted %s row with fresh credentials, expiry, inviter and role', async (state) => {
      const fixture = await reusableFixture(state);
      const before = await prisma.teamInvite.findUniqueOrThrow({ where: { id: fixture.inviteId } });
      const startedAt = Date.now();
      const issued = await inviteMember({
        teamId: fixture.team.id, email: `  ${fixture.recipient.email.toUpperCase()}  `,
        role: 'ADMIN', invitedById: fixture.other.id,
      });
      const finishedAt = Date.now();
      expect(issued.inviteId).toBe(fixture.inviteId);
      expect(issued.token).not.toBe(fixture.token);
      expect(issued.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
      const row = await prisma.teamInvite.findUniqueOrThrow({ where: { id: fixture.inviteId } });
      expect(row).toMatchObject({
        email: fixture.recipient.email, role: 'ADMIN', invitedById: fixture.other.id,
        tokenHash: hashToken(issued.token), acceptedAt: null, createdAt: before.createdAt,
      });
      expect(row.tokenHash).not.toBe(before.tokenHash);
      expect(row.expiresAt.getTime()).toBeGreaterThanOrEqual(startedAt + 7 * 86400000);
      expect(row.expiresAt.getTime()).toBeLessThanOrEqual(finishedAt + 7 * 86400000);
      expect(await prisma.teamInvite.count({ where: { teamId: fixture.team.id, email: fixture.recipient.email } })).toBe(1);
      const pending = await inviteState(fixture.team.id);
      await expect(acceptInvite(fixture.token, fixture.recipient.id)).rejects.toMatchObject({ status: 400 });
      await expect(acceptInvite(issued.token, fixture.other.id)).rejects.toMatchObject({ status: 403 });
      expect(await inviteState(fixture.team.id)).toEqual(pending);
      await expect(acceptInvite(issued.token, fixture.recipient.id)).resolves.toEqual({ teamId: fixture.team.id });
      expect(await prisma.membership.findUnique({
        where: { teamId_userId: { teamId: fixture.team.id, userId: fixture.recipient.id } },
      })).toMatchObject({ role: 'ADMIN' });
      await expect(acceptInvite(issued.token, fixture.recipient.id)).rejects.toMatchObject({ status: 400 });
    });

    it.each(['expired', 'accepted'] as const)('does not rotate a %s row for a current member', async (state) => {
      const fixture = await reusableFixture(state);
      await prisma.membership.create({ data: { teamId: fixture.team.id, userId: fixture.recipient.id, role: 'MEMBER' } });
      const before = await inviteState(fixture.team.id);
      await expect(inviteMember({
        teamId: fixture.team.id, email: ` ${fixture.recipient.email.toUpperCase()} `,
        role: 'ADMIN', invitedById: fixture.other.id,
      })).rejects.toMatchObject({ status: 409, message: 'That user is already a member of this team.' });
      expect(await inviteState(fixture.team.id)).toEqual(before);
    });

    it('returns 409 for an active duplicate without rotating any persisted fields', async () => {
      const fixture = await inviteFixture();
      await createSession(fixture.owner.id);
      const before = await inviteState(fixture.team.id);
      const response = await createInviteRoute(inviteRequest({ email: ` ${fixture.recipient.email.toUpperCase()} `, role: 'ADMIN' }), {
        params: Promise.resolve({ teamId: fixture.team.id }),
      });
      expect(response.status).toBe(409);
      expect(await inviteState(fixture.team.id)).toEqual(before);
      await expect(acceptInvite(fixture.token, fixture.recipient.id)).resolves.toEqual({ teamId: fixture.team.id });
    });

    it.each(['expired', 'accepted'] as const)('reissues a %s row through the creation route with recipient-bound acceptance', async (state) => {
      const fixture = await reusableFixture(state);
      await createSession(fixture.other.id);
      const response = await createInviteRoute(inviteRequest({ email: fixture.recipient.email, role: 'ADMIN' }), {
        params: Promise.resolve({ teamId: fixture.team.id }),
      });
      expect(response.status).toBe(200);
      const body: unknown = await response.json();
      expect(body).toMatchObject({ data: { inviteId: fixture.inviteId, inviteUrl: expect.any(String) } });
      if (!body || typeof body !== 'object' || !('data' in body) || !body.data || typeof body.data !== 'object'
        || !('inviteUrl' in body.data) || typeof body.data.inviteUrl !== 'string') throw new Error('Invalid invite response');
      const token = new URL(body.data.inviteUrl, 'http://localhost').searchParams.get('token');
      expect((await acceptInviteRoute(inviteRequest({ token, email: fixture.recipient.email }))).status).toBe(403);
      await createSession(fixture.recipient.id);
      expect((await acceptInviteRoute(inviteRequest({ token: fixture.token }))).status).toBe(400);
      expect((await acceptInviteRoute(inviteRequest({ token }))).status).toBe(200);
    });

    it.each(['OWNER', 'ADMIN', 'MEMBER', 'outsider', 'signed out'])('preserves reissue authorization for %s', async (role) => {
      const fixture = await reusableFixture('expired');
      if (role === 'MEMBER') await prisma.membership.update({
        where: { teamId_userId: { teamId: fixture.team.id, userId: fixture.other.id } }, data: { role },
      });
      if (role === 'outsider') await prisma.membership.delete({ where: { teamId_userId: { teamId: fixture.team.id, userId: fixture.other.id } } });
      if (role !== 'signed out') await createSession(role === 'OWNER' ? fixture.owner.id : fixture.other.id);
      const before = await inviteState(fixture.team.id);
      const response = await createInviteRoute(inviteRequest({ email: fixture.recipient.email }), {
        params: Promise.resolve({ teamId: fixture.team.id }),
      });
      expect(response.status).toBe(role === 'OWNER' || role === 'ADMIN' ? 200 : role === 'MEMBER' ? 403 : role === 'outsider' ? 404 : 401);
      if (response.status !== 200) expect(await inviteState(fixture.team.id)).toEqual(before);
    });

    it.each(['new', 'expired', 'accepted'] as const)('has a single concurrent issuance winner for a %s invite', async (state) => {
      const fixture = await reusableFixture(state === 'accepted' ? 'accepted' : 'expired');
      if (state === 'new') await prisma.teamInvite.delete({ where: { id: fixture.inviteId } });
      const results = await Promise.allSettled([
        inviteMember({ teamId: fixture.team.id, email: fixture.recipient.email, role: 'MEMBER', invitedById: fixture.owner.id }),
        inviteMember({ teamId: fixture.team.id, email: ` ${fixture.recipient.email.toUpperCase()} `, role: 'ADMIN', invitedById: fixture.other.id }),
      ]);
      const winners = results.filter((result) => result.status === 'fulfilled');
      expect(winners).toHaveLength(1);
      const winner = winners[0];
      if (!winner) throw new Error('Missing issuance winner');
      const losers = results.filter((result) => result.status === 'rejected');
      expect(losers).toHaveLength(1);
      expect(losers[0]?.reason).toMatchObject({ status: 409 });
      const winningIndex = results.indexOf(winner);
      const rows = await prisma.teamInvite.findMany({ where: { teamId: fixture.team.id, email: fixture.recipient.email } });
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        id: winner.value.inviteId, tokenHash: hashToken(winner.value.token), acceptedAt: null,
        role: winningIndex === 0 ? 'MEMBER' : 'ADMIN', invitedById: winningIndex === 0 ? fixture.owner.id : fixture.other.id,
      });
      if (state !== 'new') expect(winner.value.inviteId).toBe(fixture.inviteId);
      await expect(acceptInvite(fixture.token, fixture.recipient.id)).rejects.toMatchObject({ status: 400 });
      await expect(acceptInvite(winner.value.token, fixture.recipient.id)).resolves.toEqual({ teamId: fixture.team.id });
    });

    it('does not reissue while an active invitation is being accepted', async () => {
      const fixture = await inviteFixture();
      const before = await prisma.teamInvite.findUniqueOrThrow({ where: { id: fixture.inviteId } });
      const results = await Promise.allSettled([
        acceptInvite(fixture.token, fixture.recipient.id),
        inviteMember({ teamId: fixture.team.id, email: fixture.recipient.email, role: 'ADMIN', invitedById: fixture.owner.id }),
      ]);
      expect(results[0]?.status).toBe('fulfilled');
      expect(results[1]).toMatchObject({ status: 'rejected', reason: { status: 409 } });
      expect(await prisma.teamInvite.findUnique({ where: { id: fixture.inviteId } })).toMatchObject({ tokenHash: before.tokenHash, role: 'MEMBER' });
      expect(await prisma.membership.findUnique({
        where: { teamId_userId: { teamId: fixture.team.id, userId: fixture.recipient.id } },
      })).toMatchObject({ role: 'MEMBER' });
    });

    it('rejects stale acceptance when a token generation changes after lookup', async () => {
      const fixture = await inviteFixture();
      const freshToken = generateToken();
      const freshHash = hashToken(freshToken);
      const transaction = prisma.$transaction.bind(prisma);
      vi.spyOn(prisma, '$transaction').mockImplementationOnce(async (operation) => {
        if (typeof operation !== 'function') throw new Error('Expected interactive transaction');
        return transaction(async (db) => {
          const findUnique = db.teamInvite.findUnique.bind(db.teamInvite);
          vi.spyOn(db.teamInvite, 'findUnique').mockImplementationOnce(
            (async (args: unknown) => {
              const invite = await findUnique(args as Parameters<typeof findUnique>[0]);
              await db.teamInvite.update({ where: { id: fixture.inviteId }, data: { tokenHash: freshHash, role: 'ADMIN' } });
              return invite;
            }) as typeof db.teamInvite.findUnique,
          );
          return operation(db);
        });
      });
      await expect(acceptInvite(fixture.token, fixture.recipient.id)).rejects.toMatchObject({ status: 400 });
      expect(await prisma.membership.count({ where: { teamId: fixture.team.id, userId: fixture.recipient.id } })).toBe(0);
    });
  });

  describe('recipient-bound invitations (KC-011)', () => {
    it('rejects another persisted account without changing membership or consuming the invite', async () => {
      const fixture = await inviteFixture();
      const before = await inviteState(fixture.team.id);
      await expect(acceptInvite(fixture.token, fixture.other.id)).rejects.toMatchObject({ status: 403 });
      expect(await inviteState(fixture.team.id)).toEqual(before);
      await expect(acceptInvite(fixture.token, fixture.recipient.id)).resolves.toEqual({ teamId: fixture.team.id });
    });

    it('ignores caller-supplied recipient identity through the real acceptance route', async () => {
      const fixture = await inviteFixture();
      await createSession(fixture.other.id);
      const before = await inviteState(fixture.team.id);
      const response = await acceptInviteRoute(inviteRequest({
        token: fixture.token, email: fixture.recipient.email, userId: fixture.recipient.id,
      }));
      expect(response.status).toBe(403);
      expect(await response.json()).toMatchObject({ error: { code: 'forbidden' } });
      expect(await inviteState(fixture.team.id)).toEqual(before);
      await createSession(fixture.recipient.id);
      expect((await acceptInviteRoute(inviteRequest({ token: fixture.token }))).status).toBe(200);
    });

    it.each(['MEMBER', 'ADMIN'])('accepts the valid recipient with the invited %s role and audits once', async (role) => {
      const fixture = await inviteFixture(role);
      await createSession(fixture.recipient.id);
      const response = await acceptInviteRoute(inviteRequest({ token: fixture.token, email: fixture.other.email }));
      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ data: { teamId: fixture.team.id } });
      const state = await inviteState(fixture.team.id);
      expect(state.memberships).toContainEqual(expect.objectContaining({ userId: fixture.recipient.id, role }));
      expect(state.invites[0]?.acceptedAt).toBeInstanceOf(Date);
      expect(state.audits).toHaveLength(1);
      expect(state.audits[0]).toMatchObject({ actorId: fixture.recipient.id, action: 'team.invite.accepted' });
      expect((await acceptInviteRoute(inviteRequest({ token: fixture.token }))).status).toBe(400);
      expect(await inviteState(fixture.team.id)).toEqual(state);
    });

    it.each(['user', 'invite', 'both'])('normalizes persisted %s email with signup/invite trim and lowercase semantics', async (source) => {
      const fixture = await inviteFixture();
      const email = `  ${fixture.recipient.email.toUpperCase()}  `;
      if (source !== 'invite') await prisma.user.update({ where: { id: fixture.recipient.id }, data: { email } });
      if (source !== 'user') await prisma.teamInvite.update({ where: { id: fixture.inviteId }, data: { email } });
      await createSession(fixture.recipient.id);
      expect((await acceptInviteRoute(inviteRequest({ token: fixture.token }))).status).toBe(200);
      expect(await prisma.membership.findUnique({
        where: { teamId_userId: { teamId: fixture.team.id, userId: fixture.recipient.id } },
      })).toMatchObject({ role: 'MEMBER' });
    });

    it('reads the current persisted email after the request body arrives', async () => {
      const fixture = await inviteFixture();
      await createSession(fixture.recipient.id);
      const request = inviteRequest({ token: fixture.token, email: fixture.recipient.email });
      vi.spyOn(request, 'json').mockImplementation(async () => {
        await prisma.user.update({ where: { id: fixture.recipient.id }, data: { email: `changed-${randomUUID()}@test.dev` } });
        return { token: fixture.token, email: fixture.recipient.email };
      });
      const before = await inviteState(fixture.team.id);
      expect((await acceptInviteRoute(request)).status).toBe(403);
      expect(await inviteState(fixture.team.id)).toEqual(before);
    });

    it('rejects a missing persisted user without consuming the invite', async () => {
      const fixture = await inviteFixture();
      await prisma.user.delete({ where: { id: fixture.recipient.id } });
      const before = await inviteState(fixture.team.id);
      await expect(acceptInvite(fixture.token, fixture.recipient.id)).rejects.toMatchObject({ status: 401 });
      expect(await inviteState(fixture.team.id)).toEqual(before);
    });

    it.each(['signed out', 'deleted user', 'expired session', 'suspended user'])('requires authentication: %s', async (state) => {
      const fixture = await inviteFixture();
      if (state !== 'signed out') await createSession(fixture.recipient.id);
      if (state === 'deleted user') await prisma.user.delete({ where: { id: fixture.recipient.id } });
      if (state === 'expired session') await prisma.session.updateMany({ where: { userId: fixture.recipient.id }, data: { expiresAt: new Date(0) } });
      if (state === 'suspended user') await prisma.user.update({ where: { id: fixture.recipient.id }, data: { suspendedAt: new Date() } });
      const before = await inviteState(fixture.team.id);
      expect((await acceptInviteRoute(inviteRequest({ token: fixture.token }))).status).toBe(401);
      expect(await inviteState(fixture.team.id)).toEqual(before);
    });

    it.each(['missing', 'expired', 'used'])('preserves rejection of a %s token without writes', async (state) => {
      const fixture = await inviteFixture();
      if (state === 'expired') await prisma.teamInvite.update({ where: { id: fixture.inviteId }, data: { expiresAt: new Date(0) } });
      if (state === 'used') await prisma.teamInvite.update({ where: { id: fixture.inviteId }, data: { acceptedAt: new Date() } });
      await createSession(fixture.recipient.id);
      const before = await inviteState(fixture.team.id);
      const response = await acceptInviteRoute(inviteRequest({ token: state === 'missing' ? randomUUID() : fixture.token }));
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ error: { message: 'This invite is invalid or has expired.' } });
      expect(await inviteState(fixture.team.id)).toEqual(before);
    });

    it.each(['membership', 'claim'])('rolls back acceptance when the %s write fails and permits retry', async (write) => {
      const fixture = await inviteFixture();
      const before = await inviteState(fixture.team.id);
      const trigger = write === 'membership'
        ? `BEFORE INSERT ON "Membership" WHEN NEW."userId" = '${fixture.recipient.id}'`
        : `BEFORE UPDATE ON "TeamInvite" WHEN NEW."id" = '${fixture.inviteId}'`;
      await prisma.$executeRawUnsafe(`CREATE TRIGGER kc011_write_failure ${trigger} BEGIN SELECT RAISE(ABORT, 'injected invite write failure'); END`);
      try {
        await expect(acceptInvite(fixture.token, fixture.recipient.id)).rejects.toThrow();
        expect(await inviteState(fixture.team.id)).toEqual(before);
      } finally {
        await prisma.$executeRawUnsafe('DROP TRIGGER kc011_write_failure');
      }
      await expect(acceptInvite(fixture.token, fixture.recipient.id)).resolves.toEqual({ teamId: fixture.team.id });
    });

    it('allows only one concurrent claim of an invitation', async () => {
      const fixture = await inviteFixture();
      const results = await Promise.allSettled([
        acceptInvite(fixture.token, fixture.recipient.id),
        acceptInvite(fixture.token, fixture.recipient.id),
      ]);
      expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
      expect(await prisma.membership.count({ where: { teamId: fixture.team.id, userId: fixture.recipient.id } })).toBe(1);
      expect((await inviteState(fixture.team.id)).invites[0]?.acceptedAt).toBeInstanceOf(Date);
    });

    it('preserves an existing membership role on valid acceptance', async () => {
      const fixture = await inviteFixture('ADMIN');
      const membership = await prisma.membership.create({ data: { teamId: fixture.team.id, userId: fixture.recipient.id, role: 'MEMBER' } });
      await acceptInvite(fixture.token, fixture.recipient.id);
      expect(await prisma.membership.findUnique({ where: { id: membership.id } })).toEqual(membership);
    });

    it.each([null, [], true, {}, { token: 42 }, { token: {} }, { token: [] }, { token: '' }, { token: '   ' }])('rejects invalid acceptance JSON %j without writes', async (body) => {
      const fixture = await inviteFixture();
      await createSession(fixture.recipient.id);
      const before = await inviteState(fixture.team.id);
      expect((await acceptInviteRoute(inviteRequest(body))).status).toBe(400);
      expect(await inviteState(fixture.team.id)).toEqual(before);
    });

    it.each([null, [], { email: 42 }, { email: {} }, { email: [] }, { email: '' }, { email: 'bad' }, { email: 'valid@test.dev', role: {} }, { email: 'valid@test.dev', role: 'OWNER' }])('rejects invalid creation JSON %j without writes', async (body) => {
      const fixture = await inviteFixture();
      await createSession(fixture.owner.id);
      const before = await inviteState(fixture.team.id);
      expect((await createInviteRoute(inviteRequest(body), { params: Promise.resolve({ teamId: fixture.team.id }) })).status).toBe(400);
      expect(await inviteState(fixture.team.id)).toEqual(before);
    });

    it.each(['OWNER', 'ADMIN', 'MEMBER', 'outsider'])('preserves invitation creation authorization for %s', async (role) => {
      const fixture = await inviteFixture();
      const actor = role === 'OWNER' ? fixture.owner : fixture.other;
      if (role === 'ADMIN' || role === 'MEMBER') await prisma.membership.create({ data: { teamId: fixture.team.id, userId: actor.id, role } });
      await createSession(actor.id);
      const email = `NEW-${randomUUID()}@TEST.DEV`;
      const before = await inviteState(fixture.team.id);
      const response = await createInviteRoute(inviteRequest({ email: `  ${email}  ` }), { params: Promise.resolve({ teamId: fixture.team.id }) });
      expect(response.status).toBe(role === 'OWNER' || role === 'ADMIN' ? 200 : role === 'MEMBER' ? 403 : 404);
      if (response.status === 200) {
        expect(await prisma.teamInvite.findUnique({ where: { teamId_email: { teamId: fixture.team.id, email: email.toLowerCase() } } })).toMatchObject({ role: 'MEMBER', invitedById: actor.id });
      } else {
        expect(await inviteState(fixture.team.id)).toEqual(before);
      }
    });
  });

  describe('requireMembership rbac', () => {
    it('enforces role hierarchy', async () => {
      const owner = await makeUser(`rbac-owner-${Date.now()}@test.dev`);
      const admin = await makeUser(`rbac-admin-${Date.now()}@test.dev`);
      const member = await makeUser(`rbac-member-${Date.now()}@test.dev`);
      const outsider = await makeUser(`rbac-out-${Date.now()}@test.dev`);
      const team = await createTeamForUser(owner.id, 'RBAC Team');
      createdTeamIds.push(team.id);
      await prisma.membership.create({ data: { teamId: team.id, userId: admin.id, role: 'ADMIN' } });
      await prisma.membership.create({ data: { teamId: team.id, userId: member.id, role: 'MEMBER' } });

      await expect(requireMembership(member.id, team.id, 'ADMIN')).rejects.toMatchObject({ status: 403 });
      await expect(requireMembership(admin.id, team.id, 'ADMIN')).resolves.toMatchObject({ role: 'ADMIN' });
      await expect(requireMembership(outsider.id, team.id)).rejects.toMatchObject({ status: 404 });
      await expect(requireMembership(owner.id, team.id, 'OWNER')).resolves.toMatchObject({ role: 'OWNER' });
    });
  });
});
