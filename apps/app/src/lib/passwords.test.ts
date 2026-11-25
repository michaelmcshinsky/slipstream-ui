import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { hashPassword, verifyPassword, assertStrongPassword, isPasswordBreached, AuthError } from './passwords';

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

  it('detects breached passwords via the HIBP suffix list', async () => {
    // The suite disables the check globally; these cases exercise it directly.
    const previous = process.env.PASSWORD_BREACH_CHECK;
    process.env.PASSWORD_BREACH_CHECK = '';
    try {
      const password = 'correct horse battery';
      const sha1 = createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase();
      const suffix = sha1.slice(5);
      const hit = (async () =>
        new Response(`${suffix}:12345\nFFFFF0:1`, { status: 200 })) as unknown as typeof fetch;
      const miss = (async () => new Response('AAAAA0:1\nBBBBB1:2', { status: 200 })) as unknown as typeof fetch;
      expect(await isPasswordBreached(password, hit)).toBe(true);
      expect(await isPasswordBreached(password, miss)).toBe(false);
    } finally {
      if (previous === undefined) delete process.env.PASSWORD_BREACH_CHECK;
      else process.env.PASSWORD_BREACH_CHECK = previous;
    }
  });

  it('fails open when the breach service is unreachable', async () => {
    const previous = process.env.PASSWORD_BREACH_CHECK;
    process.env.PASSWORD_BREACH_CHECK = '';
    try {
      const failing = (async () => {
        throw new Error('offline');
      }) as unknown as typeof fetch;
      const notOk = (async () => new Response('nope', { status: 503 })) as unknown as typeof fetch;
      expect(await isPasswordBreached('whatever-password', failing)).toBe(false);
      expect(await isPasswordBreached('whatever-password', notOk)).toBe(false);
    } finally {
      if (previous === undefined) delete process.env.PASSWORD_BREACH_CHECK;
      else process.env.PASSWORD_BREACH_CHECK = previous;
    }
  });
});
