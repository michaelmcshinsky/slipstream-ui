import { prisma, Prisma } from '@slipstream-ui/db';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Retention windows, in days. These are the operational commitment behind
 * the privacy policy's data-retention section; change them here and in the
 * policy together.
 *
 * - sessions: deleted as soon as expiresAt passes (idle expiry already
 *   happens lazily in getSessionUser)
 * - auth tokens (email verify / password reset): expired rows are dead on
 *   arrival; used rows are kept a week for support debugging
 * - mock checkouts: dev-only billing stubs, 30 days
 * - email + newsletter deliveries: full rendered bodies, 180 days
 * - audit log: security-relevant, kept longest at 2 years
 */
export const RETENTION_DAYS = {
  authToken: 7,
  mockCheckout: 30,
  emailDelivery: 180,
  newsletterDelivery: 180,
  auditLog: 730,
} as const;

export type PurgeResult = {
  sessions: number;
  emailVerificationTokens: number;
  passwordResetTokens: number;
  mockCheckouts: number;
  emailDeliveries: number;
  newsletterDeliveries: number;
  auditLogs: number;
};

/** Deletes rows past their retention window; safe to re-run (idempotent). */
export async function purgeExpiredData(db: Prisma.TransactionClient = prisma): Promise<PurgeResult> {
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * DAY_MS);

  const [
    sessions,
    emailVerificationTokens,
    passwordResetTokens,
    mockCheckouts,
    emailDeliveries,
    newsletterDeliveries,
    auditLogs,
  ] = await Promise.all([
    db.session.deleteMany({ where: { expiresAt: { lt: now } } }),
    db.emailVerificationToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { usedAt: { lt: daysAgo(RETENTION_DAYS.authToken) } },
        ],
      },
    }),
    db.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { usedAt: { lt: daysAgo(RETENTION_DAYS.authToken) } },
        ],
      },
    }),
    db.mockCheckout.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: daysAgo(RETENTION_DAYS.mockCheckout) } },
          { consumedAt: { lt: daysAgo(RETENTION_DAYS.mockCheckout) } },
        ],
      },
    }),
    db.emailDelivery.deleteMany({
      where: { createdAt: { lt: daysAgo(RETENTION_DAYS.emailDelivery) } },
    }),
    db.newsletterDelivery.deleteMany({
      where: { createdAt: { lt: daysAgo(RETENTION_DAYS.newsletterDelivery) } },
    }),
    db.auditLog.deleteMany({
      where: { createdAt: { lt: daysAgo(RETENTION_DAYS.auditLog) } },
    }),
  ]);

  return {
    sessions: sessions.count,
    emailVerificationTokens: emailVerificationTokens.count,
    passwordResetTokens: passwordResetTokens.count,
    mockCheckouts: mockCheckouts.count,
    emailDeliveries: emailDeliveries.count,
    newsletterDeliveries: newsletterDeliveries.count,
    auditLogs: auditLogs.count,
  };
}
