import { prisma } from '@slipstream-ui/db';
import { badRequest } from './api/handle';
import { audit } from './audit';
import { cancelSubscription } from './billing';
import { verifyPassword } from './passwords';
import type { SafeUser } from './session';

/**
 * Account data export (GDPR/CCPA access right): everything we hold keyed to
 * the user, minus secrets. Key material (`keyHash`, license `key`, token
 * hashes) is never included — only the public prefixes shown in the UI.
 */
export async function exportAccountData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: { include: { team: { select: { id: true, name: true, slug: true } } } },
      subscriptions: true,
      payments: { include: { team: { select: { name: true } } } },
      licenseKeys: { select: { prefix: true, plan: true, status: true, maxActivations: true, createdAt: true, expiresAt: true, revokedAt: true, teamId: true } },
      apiKeys: { select: { name: true, prefix: true, lastUsedAt: true, createdAt: true, revokedAt: true } },
      newsletterPreferences: true,
      newsletterSubscriptions: true,
      auditLogs: { orderBy: { createdAt: 'desc' }, take: 200, select: { action: true, targetType: true, targetId: true, metadata: true, createdAt: true } },
    },
  });
  if (!user) badRequest('Account not found.');

  const teamIds = user.memberships.map((m) => m.teamId);
  const teamSubscriptions = teamIds.length
    ? await prisma.subscription.findMany({
        where: { teamId: { in: teamIds } },
        select: { teamId: true, plan: true, status: true, seats: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, provider: true },
      })
    : [];

  return {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt,
      termsAcceptedAt: user.termsAcceptedAt,
      termsVersion: user.termsVersion,
      createdAt: user.createdAt,
    },
    teams: user.memberships.map((m) => ({ ...m.team, role: m.role })),
    subscriptions: teamSubscriptions,
    payments: user.payments.map((p) => ({
      id: p.id,
      team: p.team.name,
      amountCents: p.amountCents,
      currency: p.currency,
      status: p.status,
      description: p.description,
      createdAt: p.createdAt,
    })),
    licenses: user.licenseKeys,
    apiKeys: user.apiKeys,
    newsletter: {
      preferences: user.newsletterPreferences
        ? {
            dailyEnabled: user.newsletterPreferences.dailyEnabled,
            weeklyEnabled: user.newsletterPreferences.weeklyEnabled,
            frequency: user.newsletterPreferences.frequency,
            timezone: user.newsletterPreferences.timezone,
            contentTypes: user.newsletterPreferences.contentTypes,
          }
        : null,
      subscriptions: user.newsletterSubscriptions.map((s) => ({
        type: s.type,
        status: s.status,
        unsubscribedAt: s.unsubscribedAt,
      })),
    },
    auditLog: user.auditLogs,
  };
}

type DeleteInput = { confirmEmail: string; password?: string };

/**
 * Delete the account (GDPR/CCPA erasure right).
 *
 * Referential policy:
 * - Sessions, tokens, API keys, newsletter data, memberships and mock
 *   checkouts cascade with the user row.
 * - Payments, subscriptions and audit rows survive with the user link
 *   nulled — they are financial/legal records, not profile data.
 * - License keys and sent team invites have required FKs, so they are
 *   removed explicitly (activations cascade).
 * - EmailDelivery bodies are keyed by address, not user id, so they are
 *   deleted explicitly — they contain message content (a privacy risk).
 *
 * Team edge cases:
 * - Sole-member teams (every user's personal team) are left as billing
 *   shells: the subscription is cancelled first so nothing keeps charging,
 *   and payment rows stay intact for accounting.
 * - Teams the user owns with other members require a successor: the
 *   longest-tenured ADMIN is promoted to OWNER automatically; if there is
 *   no admin, deletion is refused until the owner removes members or
 *   transfers the team.
 */
export async function deleteAccount(user: SafeUser, input: DeleteInput): Promise<void> {
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) badRequest('Account not found.');
  if (dbUser.role === 'ADMIN') {
    badRequest('Admin accounts cannot delete themselves. Ask another admin to change your role first.');
  }
  if (input.confirmEmail.trim().toLowerCase() !== dbUser.email.toLowerCase()) {
    badRequest('The email address does not match your account.');
  }
  if (dbUser.passwordHash) {
    if (!input.password || !verifyPassword(input.password, dbUser.passwordHash)) {
      badRequest('Password is incorrect.');
    }
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: {
      team: {
        include: {
          memberships: {
            select: { id: true, userId: true, role: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });

  const orphanedTeamIds: string[] = [];
  const promotions: { membershipId: string; teamName: string }[] = [];

  for (const membership of memberships) {
    if (membership.role !== 'OWNER') continue;
    const others = membership.team.memberships.filter((m) => m.userId !== user.id);
    if (others.length === 0) {
      orphanedTeamIds.push(membership.teamId);
      continue;
    }
    const successor = others.find((m) => m.role === 'ADMIN');
    if (!successor) {
      badRequest(
        `You own the team "${membership.team.name}" with other members and no admin to take over. ` +
          'Remove the other members or ask an admin to take ownership before deleting your account.',
      );
    }
    promotions.push({ membershipId: successor.id, teamName: membership.team.name });
  }

  // Cancel billing on teams that will be left memberless. External provider
  // calls happen before the transaction so a Stripe failure aborts deletion.
  for (const teamId of orphanedTeamIds) {
    const subscription = await prisma.subscription.findUnique({ where: { teamId } });
    if (subscription && subscription.plan !== 'FREE' && subscription.status === 'ACTIVE') {
      await cancelSubscription(teamId, user.id);
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const promotion of promotions) {
      await tx.membership.update({ where: { id: promotion.membershipId }, data: { role: 'OWNER' } });
    }
    await tx.licenseKey.deleteMany({ where: { ownerId: user.id } });
    await tx.teamInvite.deleteMany({ where: { invitedById: user.id } });
    await tx.teamInvite.deleteMany({ where: { email: dbUser.email } });
    await tx.emailDelivery.deleteMany({ where: { toEmail: dbUser.email } });
    await audit(
      {
        actorId: user.id,
        action: 'account.delete',
        targetType: 'user',
        targetId: user.id,
        metadata: { email: dbUser.email, orphanedTeams: orphanedTeamIds.length, ownershipTransfers: promotions.length },
      },
      tx,
    );
    await tx.user.delete({ where: { id: user.id } });
  });
}
