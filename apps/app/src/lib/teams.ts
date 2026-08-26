import { prisma, type Team, type Membership } from '@slipstream-ui/db';
import { hasAtLeast } from './plans';
import { generateToken, hashToken } from './tokens';

export class TeamError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

export async function createTeamForUser(userId: string, name: string): Promise<Team> {
  const base = slugify(name) || 'team';
  let slug = base;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const existing = await prisma.team.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${base}-${attempt}`;
    if (attempt === 5) throw new TeamError(409, 'Could not derive a unique team slug.');
  }
  return prisma.team.create({
    data: {
      name,
      slug,
      memberships: { create: { userId, role: 'OWNER' } },
    },
  });
}

/** Fetch membership or throw 404/403 semantics used across routes. */
export async function requireMembership(userId: string, teamId: string, minimumRole: 'MEMBER' | 'ADMIN' | 'OWNER' = 'MEMBER'): Promise<Membership> {
  const membership = await prisma.membership.findUnique({ where: { teamId_userId: { teamId, userId } } });
  if (!membership) throw new TeamError(404, 'Team not found.');
  if (!hasAtLeast(membership.role, minimumRole)) throw new TeamError(403, 'Insufficient role.');
  return membership;
}

const INVITE_TTL_DAYS = 7;

export async function inviteMember(params: {
  teamId: string;
  email: string;
  role: string;
  invitedById: string;
}): Promise<{ inviteId: string; token: string }> {
  const email = params.email.trim().toLowerCase();
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) throw new TeamError(400, 'Invalid email address.');
  if (!['ADMIN', 'MEMBER'].includes(params.role)) throw new TeamError(400, 'Invalid invite role.');

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const alreadyMember = await prisma.membership.findUnique({
      where: { teamId_userId: { teamId: params.teamId, userId: existingUser.id } },
    });
    if (alreadyMember) throw new TeamError(409, 'That user is already a member of this team.');
  }

  const duplicate = await prisma.teamInvite.findFirst({
    where: { teamId: params.teamId, email, acceptedAt: null, expiresAt: { gt: new Date() } },
  });
  if (duplicate) throw new TeamError(409, 'An open invite already exists for that email.');

  const token = generateToken();
  const invite = await prisma.teamInvite.create({
    data: {
      teamId: params.teamId,
      email,
      role: params.role,
      invitedById: params.invitedById,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000),
    },
  });
  // In production this token is emailed; the API also returns it so tests and
  // dev environments can complete the flow without a mail server.
  return { inviteId: invite.id, token };
}

export async function acceptInvite(token: string, userId: string): Promise<{ teamId: string }> {
  const invite = await prisma.teamInvite.findUnique({ where: { tokenHash: hashToken(token) }, include: { team: true } });
  if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
    throw new TeamError(400, 'This invite is invalid or has expired.');
  }

  await prisma.$transaction([
    prisma.membership.upsert({
      where: { teamId_userId: { teamId: invite.teamId, userId } },
      create: { teamId: invite.teamId, userId, role: invite.role },
      update: {},
    }),
    prisma.teamInvite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } }),
  ]);
  return { teamId: invite.teamId };
}
