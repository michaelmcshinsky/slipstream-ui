import { afterAll, describe, expect, it } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { createTeamForUser, inviteMember, acceptInvite, requireMembership, TeamError } from './teams';

const createdUserIds: string[] = [];
const createdTeamIds: string[] = [];

async function makeUser(email: string) {
  const user = await prisma.user.create({ data: { email } });
  createdUserIds.push(user.id);
  return user;
}

afterAll(async () => {
  // Teams cascade memberships/invites; users cascade sessions.
  for (const id of createdTeamIds) await prisma.team.delete({ where: { id } }).catch(() => {});
  for (const id of createdUserIds) await prisma.user.delete({ where: { id } }).catch(() => {});
  await prisma.$disconnect();
});

describe('teams', () => {
  it('creates a team with the creator as OWNER', async () => {
    const owner = await makeUser(`owner-${Date.now()}@test.dev`);
    const team = await createTeamForUser(owner.id, 'Acme Inc');
    createdTeamIds.push(team.id);

    expect(team.slug).toBe('acme-inc');
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
    expect(team1.slug).toBe('same-name');
    expect(team2.slug).toBe('same-name-1');
  });

  describe('invites', () => {
    it('creates an invite whose token can be accepted once', async () => {
      const owner = await makeUser(`inv-owner-${Date.now()}@test.dev`);
      const invitee = await makeUser(`inv-member-${Date.now()}@test.dev`);
      const team = await createTeamForUser(owner.id, 'Invite Team');
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
      const team = await createTeamForUser(owner.id, 'Dup Team');
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
      const team = await createTeamForUser(owner.id, 'Bad Invite Team');
      createdTeamIds.push(team.id);

      await expect(
        inviteMember({ teamId: team.id, email: 'a@b.dev', role: 'OWNER', invitedById: owner.id })
      ).rejects.toThrow(/invalid invite role/i);
      await expect(
        inviteMember({ teamId: team.id, email: 'not-an-email', role: 'MEMBER', invitedById: owner.id })
      ).rejects.toThrow(/invalid email/i);
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
