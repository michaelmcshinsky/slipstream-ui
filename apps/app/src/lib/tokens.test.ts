import { describe, expect, it } from 'vitest';
import { generateToken, hashToken, generateLicenseKey } from './tokens';

describe('tokens', () => {
  it('generates url-safe tokens with matching hashes', () => {
    const token = generateToken();
    expect(token).not.toContain('+');
    expect(token).not.toContain('/');
    expect(hashToken(token)).toHaveLength(64);
    expect(hashToken(token)).toBe(hashToken(token));
  });

  it('generates plan-prefixed license keys', () => {
    const { key, prefix } = generateLicenseKey('PRO');
    expect(key.startsWith('slip_pro_')).toBe(true);
    expect(key.startsWith(prefix)).toBe(true);
    expect(prefix).toBe(key.slice(0, 16));
  });
});
