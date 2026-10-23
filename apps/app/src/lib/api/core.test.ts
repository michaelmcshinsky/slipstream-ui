import { describe, expect, it } from 'vitest';
import { NextResponse } from 'next/server';
import { rateLimit, paginate, decodeCursor, parseQuery, paginationSchema, withEtag, errors, ApiError } from './core';
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

  it('encodes the cursor from the configured field, not the item id (KC-015)', () => {
    const rows = [
      { id: 'team-a', membershipId: 'mem-1' },
      { id: 'team-b', membershipId: 'mem-2' },
    ];
    const { meta } = paginate(rows, 1, { cursorOf: (row) => row.membershipId });
    // First page ends at team-a; the cursor must be its membership id, not 'team-a'.
    expect(decodeCursor(meta.nextCursor!)).toBe('mem-1');
  });
});

describe('withEtag (KC-016)', () => {
  it('hashes the response body so different payloads get different etags', async () => {
    const request = new Request('http://x/');
    const first = await withEtag(request, NextResponse.json({ items: [1] }));
    const second = await withEtag(request, NextResponse.json({ items: [2] }));
    const firstEtag = first.headers.get('ETag');
    const secondEtag = second.headers.get('ETag');
    expect(firstEtag).toBeTruthy();
    expect(firstEtag).not.toBe(secondEtag);
  });

  it('returns 304 when if-none-match matches the current body', async () => {
    const initial = await withEtag(new Request('http://x/'), NextResponse.json({ items: [1] }));
    const etag = initial.headers.get('ETag')!;
    const revalidated = await withEtag(
      new Request('http://x/', { headers: { 'if-none-match': etag } }),
      NextResponse.json({ items: [1] }),
    );
    expect(revalidated.status).toBe(304);
    expect(revalidated.headers.get('ETag')).toBe(etag);
  });

  it('does not 304 when the body has changed', async () => {
    const etag = (await withEtag(new Request('http://x/'), NextResponse.json({ items: [1] }))).headers.get('ETag')!;
    const changed = await withEtag(
      new Request('http://x/', { headers: { 'if-none-match': etag } }),
      NextResponse.json({ items: [999] }),
    );
    expect(changed.status).toBe(200);
    expect(changed.headers.get('ETag')).not.toBe(etag);
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
