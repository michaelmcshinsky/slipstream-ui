import { describe, expect, it, beforeAll, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { prisma } from '@slipstream-ui/db';

/**
 * Integration tests for the versioned external API (/api/v1) covering:
 * API-key auth, session auth fallback absence, envelope shape, pagination
 * meta, and 401s.
 */
const cookieStore = new Map<string, { name: string; value: string }>();

// Self-contained mock (factories are hoisted and must not close over
// top-level variables).
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieStore.has(name)
        ? { name, value: cookieStore.get(name)!.value }
        : undefined,
    set: (name: string, value: string) => {
      cookieStore.set(name, { name, value });
    },
    delete: (name: string) => {
      cookieStore.delete(name);
    },
    getAll: () => Array.from(cookieStore.values()),
  }),
}));

import { GET as v1Me } from './me/route';
import { GET as v1Teams, POST as v1CreateTeam } from './teams/route';
import { GET as v1Licenses } from './licenses/route';
import { GET as v1Payments } from './payments/route';
import { POST as v1Validate } from './licenses/validate/route';

const suffix = Date.now();
let apiKey = '';
let userId = '';

function bearer(request: { url: string; method?: string; body?: unknown }) {
  return new Request(request.url, {
    method: request.method ?? 'GET',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    ...(request.body !== undefined ? { body: JSON.stringify(request.body) } : {}),
  });
}

beforeAll(async () => {
  const user = await prisma.user.create({ data: { email: `v1-${suffix}@test.dev` } });
  userId = user.id;
  const fullKey = `slip_test.kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk`;
  await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: 'test',
      prefix: 'slip_test',
      keyHash: createSha256(fullKey),
    },
  });
  apiKey = fullKey;
});

function createSha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('GET /api/v1/me', () => {
  it('authenticates via API key and returns teams', async () => {
    const response = await v1Me(bearer({ url: 'http://x/api/v1/me' }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.user.id).toBe(userId);
    expect(body.data.authKind).toBe('apikey');
    expect(body.meta.requestId).toBeTruthy();
  });

  it('rejects missing auth with the error envelope', async () => {
    cookieStore.clear();
    const response = await v1Me(new Request('http://x/api/v1/me'));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe('unauthorized');
    expect(body.meta.requestId).toBeTruthy();
  });

  it('rejects invalid keys', async () => {
    cookieStore.clear();
    const response = await v1Me(
      new Request('http://x/api/v1/me', { headers: { Authorization: 'Bearer slip_bad.nope' } })
    );
    expect(response.status).toBe(401);
    expect((await response.json()).error.message).toMatch(/invalid api key/i);
  });
});

describe('POST /api/v1/teams', () => {
  it('creates a team and lists it paginated', async () => {
    const created = await v1CreateTeam(
      bearer({ url: 'http://x/api/v1/teams', method: 'POST', body: { name: 'V1 Team' } })
    );
    expect(created.status).toBe(201);

    const list = await v1Teams(bearer({ url: 'http://x/api/v1/teams?limit=20' }));
    const body = await list.json();
    expect(body.data.some((team: { name: string }) => team.name === 'V1 Team')).toBe(true);
    expect(body.meta.limit).toBe(20);
  });

  it('validates the create payload', async () => {
    const response = await v1CreateTeam(
      bearer({ url: 'http://x/api/v1/teams', method: 'POST', body: { name: '' } })
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe('bad_request');
  });
});

describe('GET /api/v1/licenses', () => {
  it('returns an empty page with etag for a fresh user', async () => {
    const response = await v1Licenses(bearer({ url: 'http://x/api/v1/licenses' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('etag')).toBeTruthy();
    const body = await response.json();
    expect(body.data).toEqual([]);
    expect(body.meta.hasMore).toBe(false);
  });
});

describe('pagination traversal (KC-015)', () => {
  it('walks teams pages without repeating the boundary item', async () => {
    for (let i = 0; i < 5; i++) {
      const created = await v1CreateTeam(
        bearer({ url: 'http://x/api/v1/teams', method: 'POST', body: { name: `Cursor Team ${i}-${suffix}` } })
      );
      expect(created.status).toBe(201);
    }

    const seen: string[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < 10; page++) {
      const url: string = `http://x/api/v1/teams?limit=2${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
      const response = await v1Teams(bearer({ url }));
      expect(response.status).toBe(200);
      const body = await response.json();
      const pageIds: string[] = body.data.map((team: { id: string }) => team.id);
      // No repeats within or across pages (skip:1 regression).
      expect(new Set([...seen, ...pageIds]).size).toBe(seen.length + pageIds.length);
      seen.push(...pageIds);
      if (!body.meta.hasMore) break;
      cursor = body.meta.nextCursor;
      expect(cursor).toBeTruthy();
    }

    const mine = await prisma.membership.findMany({ where: { userId } });
    expect(seen.length).toBe(mine.length);
    expect(new Set(seen).size).toBe(seen.length);
  });

  it('walks payments pages without repeating the boundary item', async () => {
    const teams = await prisma.membership.findMany({ where: { userId }, select: { teamId: true } });
    expect(teams.length).toBeGreaterThan(0);
    const teamId = teams[0]!.teamId;
    const base = Date.now();
    for (let i = 0; i < 5; i++) {
      await prisma.payment.create({
        data: {
          teamId,
          amountCents: 100 + i,
          description: `cursor-payment-${i}`,
          externalId: `cursor_${suffix}_${i}`,
          createdAt: new Date(base - i * 1000),
        },
      });
    }

    const seen: string[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < 10; page++) {
      const url: string = `http://x/api/v1/payments?limit=2${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
      const response = await v1Payments(bearer({ url }));
      expect(response.status).toBe(200);
      const body = await response.json();
      const pageIds: string[] = body.data.map((payment: { id: string }) => payment.id);
      expect(new Set([...seen, ...pageIds]).size).toBe(seen.length + pageIds.length);
      seen.push(...pageIds);
      if (!body.meta.hasMore) break;
      cursor = body.meta.nextCursor;
    }
    expect(seen.length).toBe(5);
  });
});

describe('POST /api/v1/licenses/validate (public)', () => {
  it('works without any auth', async () => {
    const response = await v1Validate(
      new Request('http://x/api/v1/licenses/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'slip_pro_missing', machineId: 'm-1' }),
      })
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.valid).toBe(false); // unknown key — endpoint reachable unauthenticated
  });

  it('rejects payloads failing validation with details', async () => {
    const response = await v1Validate(
      new Request('http://x/api/v1/licenses/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machineId: 'm-1' }),
      })
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.details[0].path).toBe('key');
  });
});

