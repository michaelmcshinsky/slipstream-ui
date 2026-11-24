import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Stateless HMAC tokens for newsletter unsubscribe links.
 *
 * Email links cannot require a session, so the token carries `userId.type`
 * signed with NEWSLETTER_UNSUBSCRIBE_SECRET (falling back to SESSION_SECRET).
 * No token is stored: verification recomputes the signature, keeping links
 * stable and unsubscribe idempotent.
 */

export type NewsletterUnsubscribeType = 'daily' | 'weekly';

function secret(): string {
  const value = (
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ??
    process.env.SESSION_SECRET ??
    ''
  ).trim();
  if (!value) {
    throw new Error('NEWSLETTER_UNSUBSCRIBE_SECRET or SESSION_SECRET must be configured');
  }
  return value;
}

function signature(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

/** Unsubscribe links must outlive archived mail but not live forever. */
const TOKEN_TTL_SECONDS = 365 * 24 * 60 * 60;

export function newsletterUnsubscribeToken(
  userId: string,
  type: NewsletterUnsubscribeType,
): string {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = `${userId}.${type}.${exp}`;
  return `${payload}.${signature(payload)}`;
}

export function newsletterUnsubscribeUrl(
  siteUrl: string,
  userId: string,
  type: NewsletterUnsubscribeType,
): string {
  const base = siteUrl.replace(/\/+$/, '');
  const token = newsletterUnsubscribeToken(userId, type);
  return `${base}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}&type=${type}`;
}

export function verifyNewsletterUnsubscribeToken(
  token: string,
  type: NewsletterUnsubscribeType,
): string | null {
  const parts = token.split('.');
  if (parts.length !== 4) return null;
  const [userId, tokenType, expRaw, sig] = parts as [string, string, string, string];
  if (tokenType !== type || !/^[0-9a-f]{64}$/.test(sig)) return null;

  const exp = Number(expRaw);
  if (!Number.isSafeInteger(exp) || exp * 1000 <= Date.now()) return null;

  const expected = Buffer.from(signature(`${userId}.${type}.${expRaw}`), 'hex');
  const provided = Buffer.from(sig, 'hex');
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;
  return userId;
}
