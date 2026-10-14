import { randomUUID } from 'node:crypto';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { getCookieStore } from '../../../test/cookies-mock';
import { createTeamForUser } from '@/lib/teams';
import { createSession, SESSION_COOKIE } from '@/lib/session';
import { mockProvider } from '@/lib/billing';
import { hashToken } from '@/lib/tokens';
import { GET, POST } from './mock-confirm/route';
import { POST as startCheckout } from './checkout/route';

const store = getCookieStore();
const userIds: string[] = [];
const teamIds: string[] = [];
const base = 'http://localhost';

async function makeUser() {
  const user = await prisma.user.create({ data: { email: `mock-${randomUUID()}@test.dev` } });
  userIds.push(user.id);
  return user;
}

async function signIn(userId: string) {
  store.clear();
  await createSession(userId);
}

async function fixture() {
  const owner = await makeUser();
  const team = await createTeamForUser(owner.id, `Mock ${randomUUID()}`);
  teamIds.push(team.id);
  await signIn(owner.id);
  return { owner, team };
}

function initiation(body: unknown) {
  return startCheckout(new Request(`${base}/api/billing/checkout`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: base },
    body: JSON.stringify(body),
  }));
}

async function checkout(teamId: string, plan = 'PRO') {
  const response = await initiation({ teamId, plan, userId: 'untrusted-user' });
  expect(response.status).toBe(200);
  const body: unknown = await response.json();
  expect(body).toMatchObject({ data: { provider: 'mock', url: expect.any(String) } });
  if (!body || typeof body !== 'object' || !('data' in body)) throw new Error('Missing checkout data');
  const data = body.data;
  if (!data || typeof data !== 'object' || !('url' in data) || typeof data.url !== 'string') throw new Error('Missing checkout URL');
  const url = new URL(data.url, base);
  const id = url.searchParams.get('checkoutId');
  expect(id).toMatch(/^[A-Za-z0-9_-]{43}$/);
  if (!id) throw new Error('Missing persisted checkout ID');
  expect([...url.searchParams.keys()]).toEqual(['checkoutId']);
  return { id, url };
}

function confirm(id?: string, origin: string | null = base, extra: Record<string, string> = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/x-www-form-urlencoded' };
  if (origin !== null) headers.origin = origin;
  return POST(new Request(`${base}/api/billing/mock-confirm`, {
    method: 'POST', headers,
    body: new URLSearchParams({ ...(id ? { checkoutId: id } : {}), ...extra }),
  }));
}

async function state(teamId: string) {
  return {
    subscription: await prisma.subscription.findUnique({ where: { teamId } }),
    payments: await prisma.payment.findMany({ where: { teamId }, orderBy: { id: 'asc' } }),
    licenses: await prisma.licenseKey.findMany({ where: { teamId }, orderBy: { id: 'asc' } }),
    checkouts: await prisma.mockCheckout.findMany({ where: { teamId }, orderBy: { id: 'asc' } }),
    audits: await prisma.auditLog.findMany({ where: { actorId: { in: userIds } }, orderBy: { id: 'asc' } }),
  };
}

beforeEach(() => {
  store.clear();
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('BILLING_PROVIDER', 'mock');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

afterAll(async () => {
  await prisma.licenseKey.deleteMany({ where: { ownerId: { in: userIds } } });
  await prisma.payment.deleteMany({ where: { teamId: { in: teamIds } } });
  await prisma.team.deleteMany({ where: { id: { in: teamIds } } });
  await prisma.auditLog.deleteMany({ where: { actorId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('mock checkout (KC-002)', () => {
  it('rejects the legacy mutable GET without creating billing state', async () => {
    const { team } = await fixture();
    const response = await GET(new Request(`${base}/api/billing/mock-confirm?teamId=${team.id}&plan=PRO`));
    expect(response.status).toBe(400);
    expect(await prisma.subscription.count({ where: { teamId: team.id } })).toBe(0);
    expect(await prisma.payment.count({ where: { teamId: team.id } })).toBe(0);
    expect(await prisma.licenseKey.count({ where: { teamId: team.id } })).toBe(0);
  });

  it('persists a short-lived checkout bound to the authenticated initiating user, team and plan', async () => {
    const { owner, team } = await fixture();
    const started = Date.now();
    const { id } = await checkout(team.id, 'TEAM');
    const stored = await prisma.mockCheckout.findUniqueOrThrow({ where: { id } });
    expect(stored).toMatchObject({ userId: owner.id, teamId: team.id, plan: 'TEAM', consumedAt: null });
    expect(stored.expiresAt.getTime()).toBeGreaterThan(started);
    expect(stored.expiresAt.getTime()).toBeLessThanOrEqual(Date.now() + 15 * 60_000);
    expect(await prisma.subscription.count({ where: { teamId: team.id } })).toBe(0);
    expect(await prisma.payment.count({ where: { teamId: team.id } })).toBe(0);
    expect(await prisma.licenseKey.count({ where: { teamId: team.id } })).toBe(0);
  });

  it('GET renders a read-only accessible explicit POST form and escapes team names', async () => {
    const { team } = await fixture();
    await prisma.team.update({ where: { id: team.id }, data: { name: '<script>alert("team")</script>' } });
    const { id, url } = await checkout(team.id);
    const before = await state(team.id);
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await GET(new Request(url));
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');
      expect(response.headers.get('cache-control')).toContain('no-store');
      expect(response.headers.get('referrer-policy')).toBe('no-referrer');
      const html = await response.text();
      expect(html).toMatch(/<html lang="en">/);
      expect(html).toMatch(/<title>.+<\/title>/);
      expect(html).toMatch(/<main>/);
      expect(html).toMatch(/<h1>.+<\/h1>/);
      expect(html).toMatch(/<form[^>]*method="post"[^>]*action="\/api\/billing\/mock-confirm"/);
      expect(html).toContain(`name="checkoutId" value="${id}"`);
      expect(html).toMatch(/<button type="submit">Confirm mock checkout<\/button>/);
      expect(html).toContain('PRO');
      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>');
      expect(html).not.toMatch(/http-equiv="refresh"|onload=|<script/i);
    }
    expect(await state(team.id)).toEqual(before);
  });

  it.each(['PRO', 'TEAM', 'ENTERPRISE'])('explicit POST activates stored %s values and redirects', async (plan) => {
    const { owner, team } = await fixture();
    const foreign = await createTeamForUser(owner.id, `Foreign ${randomUUID()}`);
    teamIds.push(foreign.id);
    const { id } = await checkout(team.id, plan);
    const response = await confirm(id, base, { teamId: foreign.id, plan: 'FREE', userId: 'foreign', amountCents: '1' });
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(`${base}/dashboard/billing?checkout=success&teamId=${team.id}`);
    expect(response.headers.get('x-request-id')).toBeTruthy();
    const result = await state(team.id);
    expect(result.subscription).toMatchObject({ plan, status: 'ACTIVE', provider: 'mock' });
    expect(result.payments).toHaveLength(1);
    expect(result.payments[0]).toMatchObject({ externalId: `mock_${id}`, userId: owner.id, status: 'PAID', amountCents: plan === 'PRO' ? 2900 : plan === 'TEAM' ? 9900 : 49900 });
    expect(result.licenses).toHaveLength(1);
    expect(result.licenses[0]).toMatchObject({ ownerId: owner.id, teamId: team.id, plan });
    expect(result.checkouts[0]?.consumedAt).toBeInstanceOf(Date);
    expect(result.audits.filter((entry) => entry.actorId === owner.id).map((entry) => entry.action).sort()).toEqual(['billing.mock-checkout.completed', 'license.issued']);
    expect(await prisma.subscription.count({ where: { teamId: foreign.id } })).toBe(0);
  });

  it('allows an initiating ADMIN and issues the license to the team owner', async () => {
    const { owner, team } = await fixture();
    const admin = await makeUser();
    await prisma.membership.create({ data: { teamId: team.id, userId: admin.id, role: 'ADMIN' } });
    await signIn(admin.id);
    const { id } = await checkout(team.id);
    expect((await confirm(id)).status).toBe(302);
    expect(await prisma.licenseKey.findFirst({ where: { teamId: team.id } })).toMatchObject({ ownerId: owner.id });
    expect(await prisma.auditLog.count({ where: { actorId: admin.id, action: 'billing.mock-checkout.completed' } })).toBe(1);
  });

  it.each(['signed-out', 'invalid-session', 'expired-session', 'suspended'])('rejects %s authentication for GET and POST', async (mode) => {
    const { owner, team } = await fixture();
    const { id, url } = await checkout(team.id);
    if (mode === 'signed-out') store.clear();
    if (mode === 'invalid-session') store.set(SESSION_COOKIE, { name: SESSION_COOKIE, value: 'invalid' });
    if (mode === 'expired-session') await prisma.session.updateMany({ where: { userId: owner.id }, data: { expiresAt: new Date(0) } });
    if (mode === 'suspended') await prisma.user.update({ where: { id: owner.id }, data: { suspendedAt: new Date() } });
    const before = await state(team.id);
    expect((await GET(new Request(url))).status).toBe(401);
    expect((await confirm(id)).status).toBe(401);
    expect(await state(team.id)).toEqual(before);
  });

  it.each(['MEMBER', 'removed'])('rechecks current initiating membership after demotion/removal: %s', async (role) => {
    const { owner, team } = await fixture();
    const { id, url } = await checkout(team.id);
    if (role === 'removed') await prisma.membership.deleteMany({ where: { teamId: team.id, userId: owner.id } });
    else await prisma.membership.updateMany({ where: { teamId: team.id, userId: owner.id }, data: { role } });
    const before = await state(team.id);
    expect((await GET(new Request(url))).status).toBe(role === 'removed' ? 404 : 403);
    expect((await confirm(id)).status).toBe(role === 'removed' ? 404 : 403);
    expect(await state(team.id)).toEqual(before);
  });

  it.each(['outsider', 'ADMIN', 'OWNER'])('rejects a foreign user holding the token even as %s', async (role) => {
    const { team } = await fixture();
    const { id, url } = await checkout(team.id);
    const foreign = await makeUser();
    if (role !== 'outsider') await prisma.membership.create({ data: { teamId: team.id, userId: foreign.id, role } });
    await signIn(foreign.id);
    const before = await state(team.id);
    expect((await GET(new Request(url))).status).toBe(404);
    expect((await confirm(id)).status).toBe(404);
    expect(await state(team.id)).toEqual(before);
  });

  it.each(['missing', 'unknown', 'expired'])('rejects %s checkout IDs without effects', async (mode) => {
    const { team } = await fixture();
    const issued = await checkout(team.id);
    if (mode === 'expired') await prisma.mockCheckout.update({ where: { id: issued.id }, data: { expiresAt: new Date(0) } });
    const id = mode === 'missing' ? undefined : mode === 'unknown' ? 'x'.repeat(43) : issued.id;
    const before = await state(team.id);
    const status = mode === 'missing' ? 400 : mode === 'unknown' ? 404 : 409;
    expect((await GET(new Request(`${base}/api/billing/mock-confirm${id ? `?checkoutId=${id}` : ''}`))).status).toBe(status);
    expect((await confirm(id)).status).toBe(status);
    expect(await state(team.id)).toEqual(before);
  });

  it.each([null, 'null', 'https://foreign.test', 'http://localhost:3000', 'https://localhost', 'http://localhost.foreign.test'])('rejects POST origin %s', async (origin) => {
    const { team } = await fixture();
    const { id } = await checkout(team.id);
    const before = await state(team.id);
    expect((await confirm(id, origin)).status).toBe(403);
    expect(await state(team.id)).toEqual(before);
  });

  it('rejects duplicate IDs and malformed confirmation bodies', async () => {
    const { team } = await fixture();
    const { id } = await checkout(team.id);
    const before = await state(team.id);
    expect((await POST(new Request(`${base}/api/billing/mock-confirm`, {
      method: 'POST', headers: { origin: base, 'content-type': 'application/x-www-form-urlencoded' },
      body: `checkoutId=${id}&checkoutId=${id}`,
    }))).status).toBe(400);
    expect((await POST(new Request(`${base}/api/billing/mock-confirm`, {
      method: 'POST', headers: { origin: base, 'content-type': 'application/json' }, body: '{',
    }))).status).toBe(400);
    expect(await state(team.id)).toEqual(before);
  });

  it.each(['production', 'stripe'])('denies GET, POST and mock creation in %s', async (mode) => {
    const { owner, team } = await fixture();
    const { id, url } = await checkout(team.id);
    const before = await state(team.id);
    if (mode === 'production') vi.stubEnv('NODE_ENV', 'production');
    else vi.stubEnv('BILLING_PROVIDER', 'stripe');
    const status = mode === 'production' ? 403 : 400;
    expect((await GET(new Request(url))).status).toBe(status);
    expect((await confirm(id)).status).toBe(status);
    await expect(mockProvider.createCheckout({ teamId: team.id, userId: owner.id, plan: 'PRO', email: owner.email })).rejects.toMatchObject({ status });
    expect(await state(team.id)).toEqual(before);
  });

  it.each(['FREE', 'ENTERPRISE_ULTIMATE', '', null, 42])('keeps invalid-plan guard at checkout creation: %s', async (plan) => {
    const { team } = await fixture();
    expect((await initiation({ teamId: team.id, plan })).status).toBe(400);
    expect(await prisma.mockCheckout.count({ where: { teamId: team.id } })).toBe(0);
  });

  it.each(['signed-out', 'outsider', 'MEMBER', 'unknown-team'])('keeps checkout initiation guard: %s', async (mode) => {
    const { team } = await fixture();
    if (mode === 'signed-out') store.clear();
    if (mode === 'outsider' || mode === 'MEMBER') {
      const other = await makeUser();
      if (mode === 'MEMBER') await prisma.membership.create({ data: { teamId: team.id, userId: other.id, role: 'MEMBER' } });
      await signIn(other.id);
    }
    expect((await initiation({ teamId: mode === 'unknown-team' ? 'unknown' : team.id, plan: 'PRO' })).status).toBe(mode === 'signed-out' ? 401 : mode === 'MEMBER' ? 403 : 404);
    expect(await prisma.mockCheckout.count({ where: { teamId: team.id } })).toBe(0);
  });

  it('sequential replay conflicts without renewing or duplicating any state', async () => {
    const { team } = await fixture();
    const { id, url } = await checkout(team.id);
    expect((await confirm(id)).status).toBe(302);
    const before = await state(team.id);
    expect((await confirm(id)).status).toBe(409);
    expect((await GET(new Request(url))).status).toBe(409);
    expect(await state(team.id)).toEqual(before);
  });

  it('concurrent replay commits exactly once and returns explicit conflicts', async () => {
    const { team } = await fixture();
    const { id } = await checkout(team.id);
    const responses = await Promise.all([confirm(id), confirm(id), confirm(id)]);
    expect(responses.map((response) => response.status).sort()).toEqual([302, 409, 409]);
    const result = await state(team.id);
    expect(result.payments).toHaveLength(1);
    expect(result.licenses).toHaveLength(1);
    expect(result.checkouts[0]?.consumedAt).toBeInstanceOf(Date);
    expect(result.audits.filter((entry) => entry.targetId === id)).toHaveLength(1);
  });

  it('reuses an existing active team license without duplicate issuance audit', async () => {
    const { owner, team } = await fixture();
    const first = await checkout(team.id);
    expect((await confirm(first.id)).status).toBe(302);
    const second = await checkout(team.id);
    expect((await confirm(second.id)).status).toBe(302);
    expect(await prisma.licenseKey.count({ where: { teamId: team.id } })).toBe(1);
    expect(await prisma.auditLog.count({ where: { actorId: owner.id, action: 'license.issued' } })).toBe(1);
    expect(await prisma.payment.count({ where: { teamId: team.id } })).toBe(2);
  });

  it.each(['Payment', 'LicenseKey', 'AuditLog'])('rolls back consumption and all effects when %s insertion fails, then permits retry', async (table) => {
    const { owner, team } = await fixture();
    const { id } = await checkout(team.id);
    const before = await state(team.id);
    const column = table === 'AuditLog' ? 'actorId' : 'teamId';
    const value = table === 'AuditLog' ? owner.id : team.id;
    await prisma.$executeRawUnsafe(`CREATE TRIGGER kc002_failure BEFORE INSERT ON "${table}" WHEN NEW."${column}" = '${value}' BEGIN SELECT RAISE(ABORT, 'injected checkout failure'); END`);
    try {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect((await confirm(id)).status).toBe(500);
      expect(await state(team.id)).toEqual(before);
    } finally {
      await prisma.$executeRawUnsafe('DROP TRIGGER kc002_failure');
    }
    expect((await confirm(id)).status).toBe(302);
    expect(await prisma.payment.count({ where: { teamId: team.id } })).toBe(1);
  });

  it('rolls back an existing subscription update when the final checkout audit fails', async () => {
    const { team } = await fixture();
    const first = await checkout(team.id);
    expect((await confirm(first.id)).status).toBe(302);
    const { id } = await checkout(team.id, 'TEAM');
    const before = await state(team.id);
    await prisma.$executeRawUnsafe(`CREATE TRIGGER kc002_final_audit_failure BEFORE INSERT ON "AuditLog" WHEN NEW."targetId" = '${id}' BEGIN SELECT RAISE(ABORT, 'injected final audit failure'); END`);
    try {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect((await confirm(id)).status).toBe(500);
      expect(await state(team.id)).toEqual(before);
    } finally {
      await prisma.$executeRawUnsafe('DROP TRIGGER kc002_final_audit_failure');
    }
    expect((await confirm(id)).status).toBe(302);
    expect(await prisma.subscription.findUnique({ where: { teamId: team.id } })).toMatchObject({ plan: 'TEAM' });
    expect(await prisma.payment.count({ where: { teamId: team.id } })).toBe(2);
  });

  it('rechecks membership inside the transaction after outer authentication', async () => {
    const { owner, team } = await fixture();
    const { id } = await checkout(team.id);
    const original = prisma.$transaction.bind(prisma);
    vi.spyOn(prisma, '$transaction').mockImplementationOnce(async (...args: Parameters<typeof prisma.$transaction>) => {
      await prisma.membership.updateMany({ where: { teamId: team.id, userId: owner.id }, data: { role: 'MEMBER' } });
      return original(...args);
    });
    const before = await state(team.id);
    expect((await confirm(id)).status).toBe(403);
    expect(await state(team.id)).toEqual(before);
  });

  it('revalidates session inside the transaction after outer authentication', async () => {
    const { owner, team } = await fixture();
    const { id } = await checkout(team.id);
    const token = store.get(SESSION_COOKIE)?.value;
    expect(token).toBeTruthy();
    const original = prisma.$transaction.bind(prisma);
    vi.spyOn(prisma, '$transaction').mockImplementationOnce(async (...args: Parameters<typeof prisma.$transaction>) => {
      await prisma.session.deleteMany({ where: { tokenHash: hashToken(token ?? '') } });
      return original(...args);
    });
    const before = await state(team.id);
    expect((await confirm(id)).status).toBe(401);
    expect(await state(team.id)).toEqual(before);
    expect(await prisma.user.findUnique({ where: { id: owner.id } })).not.toBeNull();
  });
});
