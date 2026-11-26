import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { logWarn } from './log';

const KEY_LENGTH = 64;

/** Hash a password with scrypt; format: salt:hash (both hex). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

/** Constant-time password verification against a stored salt:hash pair. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function assertStrongPassword(password: string): void {
  if (password.length < 8) throw new AuthError('Password must be at least 8 characters.');
}

const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range/';
const HIBP_TIMEOUT_MS = 3000;

/**
 * Have I Been Pwned k-anonymity check: sends only the first 5 SHA-1 hex
 * chars of the password, so the plaintext never leaves the process. The
 * API returns every known suffix for that prefix; a match means the
 * password appears in breach corpora.
 *
 * Fails open on network/parse errors — an unreachable HIBP endpoint must
 * not lock users out of signup. Set PASSWORD_BREACH_CHECK=off to disable.
 */
export async function isPasswordBreached(
  password: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (process.env.PASSWORD_BREACH_CHECK === 'off') return false;
  const sha1 = createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  try {
    const response = await fetchImpl(`${HIBP_RANGE_URL}${prefix}`, {
      headers: { 'Add-Padding': 'true' },
      signal: AbortSignal.timeout(HIBP_TIMEOUT_MS),
    });
    if (!response.ok) {
      logWarn('password breach check unavailable', { status: response.status });
      return false;
    }
    const body = await response.text();
    return body.split('\n').some((line) => line.trim().split(':')[0] === suffix);
  } catch (error) {
    logWarn('password breach check failed', { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

/** Full password policy: local strength rules plus the breach corpus check. */
export async function assertPasswordPolicy(password: string): Promise<void> {
  assertStrongPassword(password);
  if (await isPasswordBreached(password)) {
    throw new AuthError('This password has appeared in a data breach. Choose a different one.');
  }
}

export class AuthError extends Error {}
