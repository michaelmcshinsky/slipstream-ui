import { prisma } from '@slipstream-ui/db';
import { generateToken, hashToken } from './tokens';
import { deliverEmail } from './email';
import { audit } from './audit';

/**
 * Email verification lifecycle (KC-040).
 *
 * Signup leaves the account unverified; a signed link delivered by email
 * flips `emailVerifiedAt`. Tokens are single-use (conditional claim) and
 * expire after 24 hours. Identity-sensitive actions such as invitation
 * acceptance require a verified address.
 */

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/** Issue a fresh verification token for a user (invalidates prior tokens). */
export async function createEmailVerification(userId: string): Promise<{ token: string }> {
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });
  const token = generateToken();
  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
  });
  return { token };
}

/** Deliver the verification email for a user; returns the issued token. */
export async function sendVerificationEmail(user: { id: string; email: string }): Promise<{ token: string }> {
  const { token } = await createEmailVerification(user.id);
  const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
  await deliverEmail({
    to: user.email,
    kind: 'email_verify',
    subject: 'Verify your email address',
    text: `Confirm your email address: ${appUrl}/verify-email?token=${encodeURIComponent(token)}\nThis link expires in 24 hours.`,
    token,
    tokenHash: hashToken(token),
  });
  return { token };
}

export type VerifyResult = { verified: true; userId: string } | { verified: false; reason: string };

/** Consume a verification token (single-use, expiry-checked). */
export async function verifyEmailToken(token: string): Promise<VerifyResult> {
  const tokenHash = hashToken(token);
  const claimed = await prisma.$transaction(async (tx) => {
    const claim = await tx.emailVerificationToken.updateMany({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (claim.count !== 1) return null;
    return tx.emailVerificationToken.findUniqueOrThrow({ where: { tokenHash } });
  });
  if (!claimed) {
    return { verified: false, reason: 'This verification link is invalid or has expired.' };
  }
  await prisma.user.update({ where: { id: claimed.userId }, data: { emailVerifiedAt: new Date() } });
  await audit({
    actorId: claimed.userId,
    action: 'user.email.verified',
    targetType: 'user',
    targetId: claimed.userId,
  });
  return { verified: true, userId: claimed.userId };
}
