/**
 * Per-account login failure tracker, independent of client IP. Complements
 * the IP-based rate limiter in `handle()`: an attacker rotating IPs still
 * hits the per-email ceiling, and the ceiling keys on the account rather
 * than the network.
 *
 * In-memory like the rest of the rate-limit layer — correct for a single
 * process; swap the map for Redis in multi-instance deployments.
 */

const WINDOW_MS = 15 * 60_000;
const MAX_FAILURES = 8;

type Bucket = { failures: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function bucketFor(email: string, now: number): Bucket {
  const existing = buckets.get(email);
  if (existing && existing.resetAt > now) return existing;
  const fresh: Bucket = { failures: 0, resetAt: now + WINDOW_MS };
  buckets.set(email, fresh);
  return fresh;
}

/** Returns seconds until the account may try again, or null when allowed. */
export function loginThrottleRemaining(email: string): number | null {
  const now = Date.now();
  const bucket = buckets.get(email);
  if (!bucket || bucket.resetAt <= now || bucket.failures < MAX_FAILURES) return null;
  return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
}

export function recordLoginFailure(email: string): void {
  const bucket = bucketFor(email, Date.now());
  bucket.failures += 1;
}

export function resetLoginFailures(email: string): void {
  buckets.delete(email);
}
