/**
 * End-to-end auth + billing flow tests that drive the real route handlers
 * with a mocked cookie store. Covers signup → session → password reset →
 * license validation → admin guard behavior.
 */
import { describe, expect, it, beforeAll } from 'vitest';
import { getCookieStore } from '../../test/cookies-mock';
const store = getCookieStore();
import { prisma } from '@slipstream-ui/db';

import { POST as signup } from './auth/signup/route';
import { POST as login } from './auth/login/route';
import { POST as logout } from './auth/logout/route';
import { GET as me } from './auth/me/route';
import { POST as forgot } from './auth/forgot-password/route';
import { POST as reset } from './auth/reset-password/route';
import { POST as validateLicenseRoute } from './licenses/validate/route';
import { GET as adminUsers } from './admin/users/route';
import { PATCH as adminPatchUser } from './admin/users/[userId]/route';
import { POST as stopImpersonating } from './admin/impersonate/stop/route';
import { createSession, getSessionUser, SESSION_COOKIE } from '@/lib/session';
import { hashToken } from '@/lib/tokens';

const json = (body: unknown) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

async function promoteToAdmin(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
}

let adminId = '';
const suffix = Date.now();

beforeAll(async () => {
  // Seed the admin directly in the DB (admin bootstrap happens out-of-band).
  const response = await signup(
    new Request('http://localhost/api/auth/signup', json({ email: `admin-${suffix}@test.dev`, name: 'Admin', password: 'supersecret1' }))
  );
  const data = await response.json();
  adminId = data.data.user.id;
  await promoteToAdmin(adminId);
});

describe('auth lifecycle through route handlers', () => {
  it('signs up a user, creating a personal team and session', async () => {
    const store = getCookieStore();
    expect(store.get('slipstream_session')).toBeDefined(); // admin seeded

    store.clear();
    const email = `flow-${suffix}@test.dev`;
    const response = await signup(new Request('http://localhost/api/auth/signup', json({ email, password: 'password123' })));
    expect(response.status).toBe(200);
    expect(store.has('slipstream_session')).toBe(true);

    const meData = (await (await me(new Request('http://localhost/api/auth/me'))).json()).data;
    expect(meData.user.email).toBe(email);
    expect(meData.teams).toHaveLength(1);
  });

  it('rejects duplicate signups and bad credentials uniformly', async () => {
    const duplicate = await signup(
      new Request('http://localhost/api/auth/signup', json({ email: `flow-${suffix}@test.dev`, password: 'password123' }))
    );
    expect(duplicate.status).toBe(400);

    store.clear();
    const wrong = await login(new Request('http://localhost/api/auth/login', json({ email: `flow-${suffix}@test.dev`, password: 'wrong' })));
    expect(wrong.status).toBe(400);

    const missing = await login(new Request('http://localhost/api/auth/login', json({ email: 'ghost@test.dev', password: 'whatever' })));
    expect((await missing.json()).error.message).toMatch(/invalid email or password/i);
  });

  it('resets a password via token and revokes old sessions', async () => {
    store.clear();
    const email = `reset-${suffix}@test.dev`;
    await signup(new Request('http://localhost/api/auth/signup', json({ email, password: 'first-password' })));
    store.clear(); // sign out

    const forgotResponse = await forgot(new Request('http://localhost/api/auth/forgot-password', json({ email })));
    const { resetToken } = (await forgotResponse.json()).data;
    expect(resetToken).toBeTruthy();

    // Old sessions must be dead before reset completes.
    const resetResponse = await reset(new Request('http://localhost/api/auth/reset-password', json({ token: resetToken, password: 'brand-new-pw' })));
    expect(resetResponse.status).toBe(200);

    // Reset signs the user back in with a fresh session.
    const meData = (await (await me(new Request('http://localhost/api/auth/me'))).json()).data;
    expect(meData.user.email).toBe(email);

    // The reset token is single-use.
    const reuse = await reset(new Request('http://localhost/api/auth/reset-password', json({ token: resetToken, password: 'another-pass1' })));
    expect(reuse.status).toBe(400);
  });

  it('validates license keys through the public endpoint', async () => {
    store.clear();
    await signup(new Request('http://localhost/api/auth/signup', json({ email: `lic-${suffix}@test.dev`, password: 'password123' })));
    const meData = (await (await me(new Request('http://localhost/api/auth/me'))).json()).data;
    const userId = meData.user.id;

    // Issue directly in DB to avoid auth-order coupling.
    const key = `slip_pro_testkey${suffix}`;
    await prisma.licenseKey.create({
      data: { key, prefix: key.slice(0, 16), ownerId: userId, plan: 'PRO', maxActivations: 1 },
    });

    const good = await validateLicenseRoute(
      new Request('http://localhost/api/licenses/validate', json({ key, machineId: 'm-1' }))
    );
    expect((await good.json()).data).toMatchObject({ valid: true, plan: 'PRO' });

    const secondMachine = await validateLicenseRoute(
      new Request('http://localhost/api/licenses/validate', json({ key, machineId: 'm-2' }))
    );
    expect((await secondMachine.json()).data.valid).toBe(false); // limit 1
  });

  it('guards admin routes by role', async () => {
    store.clear();
    // Signed out:
    const signedOut = await adminUsers(new Request('http://localhost/api/admin/users'));
    expect(signedOut.status).toBeGreaterThanOrEqual(401);

    // Signed in as non-admin (fresh user):
    await signup(new Request('http://localhost/api/auth/signup', json({ email: `nonadmin-${suffix}@test.dev`, password: 'password123' })));
    const forbidden = await adminUsers(new Request('http://localhost/api/admin/users'));
    expect(forbidden.status).toBe(403);

    // As admin:
    store.clear();
    await login(new Request('http://localhost/api/auth/login', json({ email: `admin-${suffix}@test.dev`, password: 'supersecret1' })));
    const allowed = await adminUsers(new Request('http://localhost/api/admin/users'));
    expect(allowed.status).toBe(200);
    const users = (await allowed.json()).data.users;
    expect(users.some((user: { id: string }) => user.id === adminId)).toBe(true);
  });

  it('revokes the impersonated session before restoring the admin session', async () => {
    store.clear();
    await createSession(adminId);
    const adminToken = store.get(SESSION_COOKIE)!.value;
    const target = await prisma.user.create({ data: { email: `impersonated-${suffix}@test.dev` } });
    await createSession(target.id);
    const targetToken = store.get(SESSION_COOKIE)!.value;
    store.set('slipstream_impersonator', { name: 'slipstream_impersonator', value: adminToken });

    const response = await stopImpersonating(new Request('http://localhost/api/admin/impersonate/stop', { method: 'POST' }));

    expect(response.status).toBe(200);
    expect(store.get(SESSION_COOKIE)?.value).toBe(adminToken);
    expect(store.has('slipstream_impersonator')).toBe(false);
    expect((await getSessionUser())?.id).toBe(adminId);
    expect(await prisma.session.findUnique({ where: { tokenHash: hashToken(targetToken) } })).toBeNull();
  });

  it.each([false, true])('revokes logout sessions with allDevices=%s without affecting another user', async (allDevices) => {
    store.clear();
    const user = await prisma.user.create({ data: { email: `logout-${allDevices}-${suffix}@test.dev` } });
    await createSession(adminId);
    const unrelatedToken = store.get(SESSION_COOKIE)!.value;
    await createSession(user.id);
    const otherDeviceToken = store.get(SESSION_COOKIE)!.value;
    await createSession(user.id);
    const currentToken = store.get(SESSION_COOKIE)!.value;

    expect((await logout(new Request(`http://localhost/api/auth/logout?all=${allDevices}`, { method: 'POST' }))).status).toBe(200);
    expect(store.has(SESSION_COOKIE)).toBe(false);
    expect(await prisma.session.findUnique({ where: { tokenHash: hashToken(currentToken) } })).toBeNull();
    expect(await prisma.session.count({ where: { tokenHash: hashToken(otherDeviceToken) } })).toBe(allDevices ? 0 : 1);
    expect(await prisma.session.count({ where: { tokenHash: hashToken(unrelatedToken) } })).toBe(1);
    expect((await logout(new Request('http://localhost/api/auth/logout', { method: 'POST' }))).status).toBe(200);
  });

  it('clears and revokes both sessions when logging out during impersonation', async () => {
    store.clear();
    await createSession(adminId);
    const adminToken = store.get(SESSION_COOKIE)!.value;
    const user = await prisma.user.create({ data: { email: `logout-impersonated-${suffix}@test.dev` } });
    await createSession(user.id);
    const targetToken = store.get(SESSION_COOKIE)!.value;
    store.set('slipstream_impersonator', { name: 'slipstream_impersonator', value: adminToken });

    expect((await logout(new Request('http://localhost/api/auth/logout', { method: 'POST' }))).status).toBe(200);
    expect(store.has(SESSION_COOKIE)).toBe(false);
    expect(store.has('slipstream_impersonator')).toBe(false);
    expect(await prisma.session.count({ where: { tokenHash: { in: [hashToken(adminToken), hashToken(targetToken)] } } })).toBe(0);
  });

  it.each(['expired', 'suspended', 'demoted', 'missing'] as const)('does not restore a %s administrator session', async (state) => {
    store.clear();
    const admin = await prisma.user.create({ data: { email: `parked-${state}-${suffix}@test.dev`, role: 'ADMIN' } });
    await createSession(admin.id);
    const token = store.get(SESSION_COOKIE)!.value;
    if (state === 'expired') await prisma.session.updateMany({ where: { userId: admin.id }, data: { expiresAt: new Date(0) } });
    if (state === 'suspended') await prisma.user.update({ where: { id: admin.id }, data: { suspendedAt: new Date() } });
    if (state === 'demoted') await prisma.user.update({ where: { id: admin.id }, data: { role: 'USER' } });
    if (state === 'missing') await prisma.session.deleteMany({ where: { userId: admin.id } });
    store.delete(SESSION_COOKIE);
    store.set('slipstream_impersonator', { name: 'slipstream_impersonator', value: token });

    expect((await stopImpersonating(new Request('http://localhost/api/admin/impersonate/stop', { method: 'POST' }))).status).toBe(400);
    expect(store.has(SESSION_COOKIE)).toBe(false);
    expect(store.has('slipstream_impersonator')).toBe(false);
  });

  it('blocks admins from suspending themselves', async () => {
    store.clear();
    await login(new Request('http://localhost/api/auth/login', json({ email: `admin-${suffix}@test.dev`, password: 'supersecret1' })));
    const response = await adminPatchUser(
      new Request('http://localhost/api/admin/users/x', json({ suspended: true })),
      { params: Promise.resolve({ userId: adminId }) }
    );
    expect(response.status).toBe(400);
  });
});
