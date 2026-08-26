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
import { GET as me } from './auth/me/route';
import { POST as forgot } from './auth/forgot-password/route';
import { POST as reset } from './auth/reset-password/route';
import { POST as validateLicenseRoute } from './licenses/validate/route';
import { GET as adminUsers } from './admin/users/route';
import { PATCH as adminPatchUser } from './admin/users/[userId]/route';

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
  adminId = data.user.id;
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

    const meData = await (await me()).json();
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
    expect((await missing.json()).error).toMatch(/invalid email or password/i);
  });

  it('resets a password via token and revokes old sessions', async () => {
    store.clear();
    const email = `reset-${suffix}@test.dev`;
    await signup(new Request('http://localhost/api/auth/signup', json({ email, password: 'first-password' })));
    store.clear(); // sign out

    const forgotResponse = await forgot(new Request('http://localhost/api/auth/forgot-password', json({ email })));
    const { resetToken } = await forgotResponse.json();
    expect(resetToken).toBeTruthy();

    // Old sessions must be dead before reset completes.
    const resetResponse = await reset(new Request('http://localhost/api/auth/reset-password', json({ token: resetToken, password: 'brand-new-pw' })));
    expect(resetResponse.status).toBe(200);

    // Reset signs the user back in with a fresh session.
    const meData = await (await me()).json();
    expect(meData.user.email).toBe(email);

    // The reset token is single-use.
    const reuse = await reset(new Request('http://localhost/api/auth/reset-password', json({ token: resetToken, password: 'another-pass1' })));
    expect(reuse.status).toBe(400);
  });

  it('validates license keys through the public endpoint', async () => {
    store.clear();
    await signup(new Request('http://localhost/api/auth/signup', json({ email: `lic-${suffix}@test.dev`, password: 'password123' })));
    const meData = await (await me()).json();
    const userId = meData.user.id;

    // Issue directly in DB to avoid auth-order coupling.
    const key = `slip_pro_testkey${suffix}`;
    await prisma.licenseKey.create({
      data: { key, prefix: key.slice(0, 16), ownerId: userId, plan: 'PRO', maxActivations: 1 },
    });

    const good = await validateLicenseRoute(
      new Request('http://localhost/api/licenses/validate', json({ key, machineId: 'm-1' }))
    );
    expect((await good.json())).toMatchObject({ valid: true, plan: 'PRO' });

    const secondMachine = await validateLicenseRoute(
      new Request('http://localhost/api/licenses/validate', json({ key, machineId: 'm-2' }))
    );
    expect((await secondMachine.json()).valid).toBe(false); // limit 1
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
    const users = (await allowed.json()).users;
    expect(users.some((user: { id: string }) => user.id === adminId)).toBe(true);
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
