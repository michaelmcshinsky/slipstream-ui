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
  return { key, prefix: key.slice(0, 16) };
}
