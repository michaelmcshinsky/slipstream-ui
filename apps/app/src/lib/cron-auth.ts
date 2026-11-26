import { createHash, timingSafeEqual } from 'node:crypto';
import { errors } from './api/core';

function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

function secretMatches(provided: string | null): boolean {
  // CRON_SECRET is the generic name; NEWSLETTER_CRON_SECRET predates it and
  // stays accepted so existing deployments keep working.
  const expected = process.env.CRON_SECRET ?? process.env.NEWSLETTER_CRON_SECRET;
  if (!expected || !provided) return false;
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

/** 401 unless the request carries `Authorization: Bearer <cron secret>`. */
export function requireCronSecret(request: Request): void {
  if (!secretMatches(bearerToken(request))) {
    throw errors.unauthorized('Unauthorized.');
  }
}
