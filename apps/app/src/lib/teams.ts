import { prisma, Prisma, type Team, type Membership } from '@slipstream-ui/db';
import { randomBytes } from 'node:crypto';
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

const SLUG_MAX_ATTEMPTS = 5;

/**
 * Create a team with a collision-resistant slug. Slugs are allocated by
 * attempting inserts and retrying on unique-constraint conflicts — never by
 * check-then-insert, which cannot survive concurrent signups (KC-010).
 * Accepts a transaction client so callers can compose user+team creation
 * atomically.
 */
export async function createTeamForUser(userId: string, name: string, db: Prisma.TransactionClient = prisma): Promise<Team> {
  const base = slugify(name) || 'team';
  for (let attempt = 1; attempt <= SLUG_MAX_ATTEMPTS; attempt++) {
    const suffix = randomBytes(4).toString('hex');
    const slug = `${base}-${suffix}`.slice(0, 60);
    try {
      return await db.team.create({
        data: {
          name,
          slug,
          memberships: { create: { userId, role: 'OWNER' } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        continue; // slug raced another insert; retry with a fresh suffix
      }
      throw error;
    }
  }
  throw new TeamError(409, 'Could not derive a unique team slug.');
}

/** Fetch membership or throw 404/403 semantics used across routes. */
export async function requireMembership(userId: string, teamId: string, minimumRole: 'MEMBER' | 'ADMIN' | 'OWNER' = 'MEMBER', db: Prisma.TransactionClient = prisma): Promise<Membership> {
  const membership = await db.membership.findUnique({ where: { teamId_userId: { teamId, userId } } });
  if (!membership) throw new TeamError(404, 'Team not found.');
  if (!hasAtLeast(membership.role, minimumRole)) throw new TeamError(403, 'Insufficient role.');
  return membership;
}

const INVITE_TTL_DAYS = 7;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Seats are a hard cap on memberships: FREE defaults to 1, paid plans use the
 * subscription's seat count (KC-013). Checked at invite time (promise) and
 * again at acceptance (the authoritative fill).
 */
async function assertSeatAvailable(db: Prisma.TransactionClient, teamId: string): Promise<void> {
  const subscription = await db.subscription.findUnique({ where: { teamId } });
  const seats = subscription?.seats ?? 1;
  const members = await db.membership.count({ where: { teamId } });
  if (members >= seats) {
    throw new TeamError(409, `Team seat limit reached (${seats}). Remove a member or upgrade the plan.`);
  }
}

export async function inviteMember(params: {
  teamId: string;
  email: string;
  role: string;
  invitedById: string;
}): Promise<{ inviteId: string; token: string }> {
  const email = normalizeEmail(params.email);
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) throw new TeamError(400, 'Invalid email address.');
  if (!['ADMIN', 'MEMBER'].includes(params.role)) throw new TeamError(400, 'Invalid invite role.');

  try {
    return await prisma.$transaction(async (db) => {
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        const alreadyMember = await db.membership.findUnique({
          where: { teamId_userId: { teamId: params.teamId, userId: existingUser.id } },
        });
        if (alreadyMember) throw new TeamError(409, 'That user is already a member of this team.');
      }

      await assertSeatAvailable(db, params.teamId);

      const existingInvite = await db.teamInvite.findUnique({
        where: { teamId_email: { teamId: params.teamId, email } },
      });
      const now = new Date();
      if (existingInvite && !existingInvite.acceptedAt && existingInvite.expiresAt >= now) {
        throw new TeamError(409, 'An open invite already exists for that email.');
      }

      const token = generateToken();
      const data = {
        role: params.role,
        invitedById: params.invitedById,
        tokenHash: hashToken(token),
        expiresAt: new Date(now.getTime() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000),
        acceptedAt: null,
      };
      if (existingInvite) {
        const reissued = await db.teamInvite.updateMany({
          where: {
            id: existingInvite.id,
            tokenHash: existingInvite.tokenHash,
            acceptedAt: existingInvite.acceptedAt,
            expiresAt: existingInvite.expiresAt,
            OR: [{ acceptedAt: { not: null } }, { expiresAt: { lt: now } }],
          },
          data,
        });
        if (reissued.count !== 1) throw new TeamError(409, 'Invitation changed concurrently. Retry the request.');
        return { inviteId: existingInvite.id, token };
      }

      const invite = await db.teamInvite.create({ data: { teamId: params.teamId, email, ...data } });
      return { inviteId: invite.id, token };
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034', 'P1008', 'P2028'].includes(error.code)) {
      throw new TeamError(409, 'Invitation changed concurrently. Retry the request.');
    }
    throw error;
  }
}

export async function acceptInvite(token: string, userId: string): Promise<{ teamId: string }> {
  return prisma.$transaction(async (db) => {
    const invite = await db.teamInvite.findUnique({ where: { tokenHash: hashToken(token) } });
    const now = new Date();
    if (!invite || invite.acceptedAt || invite.expiresAt < now) {
      throw new TeamError(400, 'This invite is invalid or has expired.');
    }

    const user = await db.user.findUnique({ where: { id: userId }, select: { email: true, emailVerifiedAt: true } });
    if (!user) throw new TeamError(401, 'Authentication required.');
    // Invitations bind identity to an email address; acceptance therefore
    // requires a verified address (KC-040). Pre-feature accounts are
    // grandfathered by the seed backfill (emailVerifiedAt = createdAt).
    if (!user.emailVerifiedAt) {
      throw new TeamError(403, 'Verify your email address before accepting invitations.');
    }
    if (normalizeEmail(invite.email) !== normalizeEmail(user.email)) {
      throw new TeamError(403, 'This invitation was issued to a different email address.');
    }

    const claim = await db.teamInvite.updateMany({
      where: { id: invite.id, tokenHash: invite.tokenHash, acceptedAt: null, expiresAt: { gte: now } },
      data: { acceptedAt: now },
    });
    if (claim.count !== 1) throw new TeamError(400, 'This invite is invalid or has expired.');
    const alreadyMember = await db.membership.findUnique({
      where: { teamId_userId: { teamId: invite.teamId, userId } },
    });
    if (!alreadyMember) await assertSeatAvailable(db, invite.teamId);
    await db.membership.upsert({
      where: { teamId_userId: { teamId: invite.teamId, userId } },
      create: { teamId: invite.teamId, userId, role: invite.role },
      update: {},
    });
    return { teamId: invite.teamId };
  });
}
