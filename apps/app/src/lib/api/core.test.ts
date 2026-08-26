import { describe, expect, it } from 'vitest';
import { rateLimit, paginate, decodeCursor, parseQuery, paginationSchema, errors, ApiError } from './core';
import { z } from 'zod';

describe('rateLimit', () => {
  it('allows up to the limit then blocks with retry-after', () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit({ key, limit: 3, windowMs: 1000 }).allowed).toBe(true);
    }
    const blocked = rateLimit({ key, limit: 3, windowMs: 1000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });

  it('isolates buckets by key', () => {
    const sharedKey = `shared-${Math.random()}`;
    const otherKey = `other-${Math.random()}`;
    rateLimit({ key: sharedKey, limit: 1, windowMs: 1000 });
    expect(rateLimit({ key: sharedKey, limit: 1, windowMs: 1000 }).allowed).toBe(false);
    expect(rateLimit({ key: otherKey, limit: 1, windowMs: 1000 }).allowed).toBe(true);
  });

  it('lets the window slide: old requests stop counting', async () => {
    const key = `slide-${Math.random()}`;
    expect(rateLimit({ key, limit: 2, windowMs: 50 }).allowed).toBe(true);
    expect(rateLimit({ key, limit: 2, windowMs: 50 }).allowed).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(rateLimit({ key, limit: 2, windowMs: 50 }).allowed).toBe(true);
  });
});

describe('paginate', () => {
  const rows = Array.from({ length: 5 }, (_, i) => ({ id: `row-${i}` }));

  it('returns a full page with hasMore=false when under the limit', () => {
    const { items, meta } = paginate(rows, 10);
    expect(items).toHaveLength(5);
    expect(meta.hasMore).toBe(false);
    expect(meta.nextCursor).toBeUndefined();
  });

  it('trims to the limit and emits an opaque next cursor', () => {
    const { items, meta } = paginate(rows, 4);
    expect(items).toHaveLength(4);
    expect(meta.hasMore).toBe(true);
    expect(decodeCursor(meta.nextCursor!)).toBe('row-3');
  });

  it('round-trips cursors and rejects malformed ones', () => {
    expect(decodeCursor(undefined)).toBeUndefined();
    expect(() => parseQuery(new Request('http://x/?cursor=%%%'), z.object({ cursor: z.string().optional() }))).not.toThrow();
    expect(() => decodeCursor('!!!not-base64url!!!')).toThrow(ApiError);
  });
});

describe('parseQuery', () => {
  it('applies defaults via coerced schemas', () => {
    const schema = paginationSchema(25);
    const parsed = parseQuery(new Request('http://x/'), schema);
    expect(parsed.limit).toBe(25);
    expect(parsed.cursor).toBeUndefined();

    const limited = parseQuery(new Request('http://x/?limit=5&cursor=abc'), schema);
    expect(limited).toEqual({ limit: 5, cursor: 'abc' });
  });

  it('rejects out-of-range limits with field-level details', () => {
    try {
      parseQuery(new Request('http://x/?limit=500'), paginationSchema(25));
      throw new Error('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      const apiError = error as ApiError;
      expect(apiError.status).toBe(400);
      expect(apiError.details).toEqual([{ path: 'limit', message: expect.any(String) }]);
    }
  });
});

describe('errors', () => {
  it('carries status, code, message, details', () => {
    const error = errors.badRequest('Nope', [{ path: 'x' }]);
    expect(error.status).toBe(400);
    expect(error.code).toBe('bad_request');
    expect(error.details).toBeDefined();
  });
});
