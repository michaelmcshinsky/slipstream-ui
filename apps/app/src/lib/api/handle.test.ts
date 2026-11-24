import { afterEach, describe, expect, it, vi } from 'vitest';
import { handle } from './handle';

const ok = () => Promise.resolve({ ok: true });

function request(xff?: string) {
  return new Request('http://localhost/api/probe', {
    headers: xff ? { 'x-forwarded-for': xff } : {},
  });
}

function options() {
  return {
    rateLimit: { limit: 1, windowMs: 60_000 },
    routeName: `probe-${Math.random()}`,
  };
}

describe('handle rate-limit identity', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('ignores X-Forwarded-For unless TRUST_PROXY=true (shared fail-closed bucket)', async () => {
    const previous = process.env.TRUST_PROXY;
    delete process.env.TRUST_PROXY;
    try {
      const opts = options();
      expect((await handle(request('1.1.1.1'), ok, opts)).status).toBe(200);
      // A rotated spoofed header must not buy a fresh bucket.
      expect((await handle(request('2.2.2.2'), ok, opts)).status).toBe(429);
    } finally {
      if (previous !== undefined) process.env.TRUST_PROXY = previous;
    }
  });

  it('keys on the last XFF hop when TRUST_PROXY=true', async () => {
    vi.stubEnv('TRUST_PROXY', 'true');
    const opts = options();
    // Client-controlled earlier hops do not rotate the bucket; only the hop
    // appended by the trusted proxy counts.
    expect((await handle(request('9.9.9.9, 3.3.3.3'), ok, opts)).status).toBe(200);
    expect((await handle(request('8.8.8.8, 3.3.3.3'), ok, opts)).status).toBe(429);
    expect((await handle(request('8.8.8.8, 4.4.4.4'), ok, opts)).status).toBe(200);
  });
});
