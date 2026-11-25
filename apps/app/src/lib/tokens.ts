import { createHash, randomBytes } from 'node:crypto';

export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** License keys look like slip_pro_xxxxxxxxxxxx for readability + prefix lookup. */
export function generateLicenseKey(plan: string): { key: string; prefix: string } {
  const body = randomBytes(20).toString('base64url');
  const planCode = plan.toLowerCase().slice(0, 8);
  const key = `slip_${planCode}_${body}`;
  return { key, prefix: `slip_${planCode}_${body.slice(0, 16)}` };
}

/**
 * Masks a license key for list/display contexts: keeps the plan label and
 * the last four characters so owners can recognize a key, while the bearer
 * secret stays out of list payloads, logs and DOM snapshots. Full retrieval
 * goes through the owner-scoped reveal endpoint.
 */
export function maskLicenseKey(key: string): string {
  // Keys are `slip_<planCode>_<body>`; the body alphabet includes '_', so the
  // boundary is the second underscore, not the last one.
  const firstSep = key.indexOf('_');
  const secondSep = firstSep < 0 ? -1 : key.indexOf('_', firstSep + 1);
  if (secondSep < 0 || key.length - secondSep < 8) return '••••';
  return `${key.slice(0, secondSep + 1)}…${key.slice(-4)}`;
}
