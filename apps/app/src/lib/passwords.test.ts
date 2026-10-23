import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword, assertStrongPassword, AuthError } from './passwords';

describe('passwords', () => {
  it('hashes and verifies a password', () => {
    const stored = hashPassword('correct horse battery');
    expect(stored).toMatch(/^[a-f0-9]{32}:[a-f0-9]{128}$/);
    expect(verifyPassword('correct horse battery', stored)).toBe(true);
  });

  it('rejects wrong passwords and malformed hashes without throwing', () => {
    const stored = hashPassword('secret');
    expect(verifyPassword('wrong', stored)).toBe(false);
    expect(verifyPassword('secret', 'garbage')).toBe(false);
  });

  it('produces unique salts per call', () => {
    expect(hashPassword('same')).not.toBe(hashPassword('same'));
  });

  it('enforces minimum length', () => {
    expect(() => assertStrongPassword('short')).toThrow(AuthError);
    expect(() => assertStrongPassword('long-enough-password')).not.toThrow();
  });
});
