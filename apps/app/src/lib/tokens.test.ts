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

  it.each([
    ['PRO', 'pro'],
    ['TEAM', 'team'],
    ['ENTERPRISE', 'enterpri'],
    ['FREE', 'free'],
    ['EnterpriseExtended', 'enterpri'],
    ['', ''],
  ])('retains 96 random prefix bits independently of the %s plan label', (plan, planCode) => {
    const { key, prefix } = generateLicenseKey(plan);
    const label = `slip_${planCode}_`;
    expect(key.startsWith(label)).toBe(true);
    const body = key.slice(label.length);
    expect(body).toMatch(/^[A-Za-z0-9_-]{27}$/);
    expect(Buffer.from(body, 'base64url')).toHaveLength(20);
    expect(key.startsWith(prefix)).toBe(true);
    expect(prefix).toBe(`${label}${body.slice(0, 16)}`);
    const publicBody = prefix.slice(label.length);
    expect(publicBody).toMatch(/^[A-Za-z0-9_-]{16}$/);
    expect(Buffer.from(publicBody, 'base64url')).toEqual(Buffer.from(body, 'base64url').subarray(0, 12));
    expect(prefix).not.toBe(key);
  });

  it('preserves SHA-256 hashes of existing tokens', () => {
    expect(hashToken('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});
