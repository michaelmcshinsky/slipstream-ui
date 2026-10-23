import { randomUUID } from 'node:crypto';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { createSession } from '@/lib/session';
import { createTeamForUser, inviteMember, acceptInvite } from '@/lib/teams';
import { issueLicense, validateLicense } from '@/lib/licenses';
import { activateSubscription, cancelSubscription, validateBillingConfig } from '@/lib/billing';
import { getPrincipal } from '@/lib/api/auth';
import { generateToken, hashToken } from '@/lib/tokens';
import { POST as issueLicenseRoute } from './licenses/route';
import { POST as resetPasswordRoute } from './auth/reset-password/route';
import { POST as forgotPasswordRoute } from './auth/forgot-password/route';
import { POST as signupRoute } from './auth/signup/route';
import { POST as verifyEmailRoute } from './auth/verify-email/route';
import { POST as resendVerifyRoute } from './auth/verify-email/resend/route';
import { POST as createInviteRoute } from './teams/[teamId]/invites/route';
import { DELETE as deactivateRoute } from './licenses/[licenseId]/activations/[machineId]/route';
import { POST as impersonateRoute } from './admin/users/[userId]/impersonate/route';

/**
 * Security regression suite (KC-032): locks in the P1/P2 fixes for license
 * issuance authorization (KC-001), subscription-driven license lifecycle
 * (KC-008), seat limits (KC-013), token single-use (KC-014) and machine
 * deactivation (KC-021).
 */

const cookieStore = new Map<string, { name: string; value: string }>();

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => cookieStore.get(name),
    set: (name: string, value: string) => cookieStore.set(name, { name, value }),
    delete: (name: string) => cookieStore.delete(name),
  }),
}));

const suffix = randomUUID();
const createdUserIds: string[] = [];
const createdTeamIds: string[] = [];

beforeEach(() => cookieStore.clear());

afterAll(async () => {
  await prisma.emailDelivery.deleteMany({ where: { toEmail: { contains: suffix } } });
  await prisma.auditLog.deleteMany({ where: { actorId: { in: createdUserIds } } });
  await prisma.licenseKey.deleteMany({ where: { ownerId: { in: createdUserIds } } });
  await prisma.team.deleteMany({ where: { id: { in: createdTeamIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.$disconnect();
});

async function makeUser(email: string, role: 'USER' | 'ADMIN' = 'USER') {
  // Grandfathered as verified (KC-040 migration semantics for pre-feature
  // accounts); unverified-user cases set emailVerifiedAt explicitly.
  const user = await prisma.user.create({ data: { email, role, emailVerifiedAt: new Date() } });
  createdUserIds.push(user.id);
  return user;
}

async function makeTeam(ownerId: string, name = `Team ${randomUUID().slice(0, 8)}`) {
  const team = await createTeamForUser(ownerId, name);
  createdTeamIds.push(team.id);
  return team;
}

function jsonRequest(url: string, body: unknown, method = 'POST') {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': randomUUID() },
    body: JSON.stringify(body),
  });
}

async function subscribe(teamId: string, plan: 'PRO' | 'TEAM' | 'ENTERPRISE', seats: number) {
  await prisma.subscription.create({
    data: {
      teamId,
      plan,
      status: 'ACTIVE',
      seats,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}

describe('KC-001: self-service license issuance requires paid entitlement', () => {
  it('rejects unauthenticated requests', async () => {
    const response = await issueLicenseRoute(jsonRequest('http://localhost/api/licenses', { plan: 'PRO' }));
    expect(response.status).toBe(401);
  });

  it('requires a teamId for non-admin users', async () => {
    const user = await makeUser(`lic-noteam-${suffix}@test.dev`);
    await createSession(user.id);
    const response = await issueLicenseRoute(jsonRequest('http://localhost/api/licenses', { plan: 'PRO' }));
    expect(response.status).toBe(400);
  });

  it('forbids issuance for teams without a paid subscription', async () => {
    const user = await makeUser(`lic-freesub-${suffix}@test.dev`);
    const team = await makeTeam(user.id, 'Free Team');
    await createSession(user.id);
    const response = await issueLicenseRoute(
      jsonRequest('http://localhost/api/licenses', { teamId: team.id, plan: 'PRO' }),
    );
    expect(response.status).toBe(403);
    expect(await prisma.licenseKey.count({ where: { teamId: team.id } })).toBe(0);
  });

  it('forbids issuance when the subscription is not ACTIVE', async () => {
    const user = await makeUser(`lic-canceled-${suffix}@test.dev`);
    const team = await makeTeam(user.id, 'Canceled Team');
    await prisma.subscription.create({ data: { teamId: team.id, plan: 'PRO', status: 'CANCELED', seats: 1 } });
    await createSession(user.id);
    const response = await issueLicenseRoute(
      jsonRequest('http://localhost/api/licenses', { teamId: team.id, plan: 'PRO' }),
    );
    expect(response.status).toBe(403);
  });

  it('rejects a requested plan above the subscription (no trusted upgrade)', async () => {
    const user = await makeUser(`lic-upgrade-${suffix}@test.dev`);
    const team = await makeTeam(user.id, 'Pro Team');
    await subscribe(team.id, 'PRO', 1);
    await createSession(user.id);
    const response = await issueLicenseRoute(
      jsonRequest('http://localhost/api/licenses', { teamId: team.id, plan: 'ENTERPRISE' }),
    );
    expect(response.status).toBe(400);
    expect(await prisma.licenseKey.count({ where: { teamId: team.id } })).toBe(0);
  });

  it('issues the subscription-derived plan, binds it to the billing period, and is idempotent', async () => {
    const user = await makeUser(`lic-issued-${suffix}@test.dev`);
    const team = await makeTeam(user.id, 'Pro Issued');
    await subscribe(team.id, 'PRO', 1);
    await createSession(user.id);

    const first = await issueLicenseRoute(
      jsonRequest('http://localhost/api/licenses', { teamId: team.id, plan: 'PRO' }),
    );
    expect(first.status).toBe(200);
    const firstBody = await first.json();
    const key = firstBody.data?.key as string;
    expect(key).toBeTruthy();

    const license = await prisma.licenseKey.findUniqueOrThrow({ where: { key } });
    expect(license).toMatchObject({ teamId: team.id, plan: 'PRO', ownerId: user.id });
    expect(license.expiresAt).not.toBeNull(); // KC-008: expires with the billing period

    // Retry returns the same key instead of minting a duplicate (idempotent).
    const second = await issueLicenseRoute(
      jsonRequest('http://localhost/api/licenses', { teamId: team.id, plan: 'PRO' }),
    );
    expect((await second.json()).data?.key).toBe(key);
    expect(await prisma.licenseKey.count({ where: { teamId: team.id } })).toBe(1);
  });

  it('enforces the team-wide activation budget across owners', async () => {
    const owner = await makeUser(`lic-budget-o-${suffix}@test.dev`);
    const member = await makeUser(`lic-budget-m-${suffix}@test.dev`);
    const team = await makeTeam(owner.id, 'Budget Team');
    await subscribe(team.id, 'PRO', 2);
    await prisma.membership.create({ data: { teamId: team.id, userId: member.id, role: 'MEMBER' } });

    // PRO budget is 3 activations; the first key consumes all of it.
    await issueLicense({ ownerId: owner.id, teamId: team.id, plan: 'PRO', maxActivations: 3 });

    await createSession(member.id);
    const response = await issueLicenseRoute(
      jsonRequest('http://localhost/api/licenses', { teamId: team.id, plan: 'PRO' }),
    );
    expect(response.status).toBe(400);
    expect((await response.json()).error?.message).toMatch(/budget/i);
  });

  it('lets platform admins issue comps through the route', async () => {
    const admin = await makeUser(`lic-admin-${suffix}@test.dev`, 'ADMIN');
    await createSession(admin.id);
    const response = await issueLicenseRoute(jsonRequest('http://localhost/api/licenses', { plan: 'ENTERPRISE' }));
    expect(response.status).toBe(200);
    const key = (await response.json()).data?.key as string;
    await prisma.licenseKey.delete({ where: { key } });
  });
});

describe('KC-008: cancellation ends subscription-bound licenses', () => {
  it('revokes active TEAM/ENTERPRISE licenses and keeps PRO licenses to expiry', async () => {
    const owner = await makeUser(`cancel-${suffix}@test.dev`);
    const team = await makeTeam(owner.id, 'Cancel Rights');
    await activateSubscription(team.id, 'TEAM');
    const teamLicense = await issueLicense({ ownerId: owner.id, teamId: team.id, plan: 'TEAM' });
    const proLicense = await issueLicense({ ownerId: owner.id, teamId: team.id, plan: 'PRO' });

    await cancelSubscription(team.id, owner.id);

    const revoked = await prisma.licenseKey.findUniqueOrThrow({ where: { key: teamLicense.key } });
    expect(revoked.status).toBe('REVOKED');
    expect(await validateLicense(teamLicense.key, 'post-cancel-machine')).toMatchObject({ valid: false });

    const pro = await prisma.licenseKey.findUniqueOrThrow({ where: { key: proLicense.key } });
    expect(pro.status).toBe('ACTIVE'); // PRO survives; its expiresAt ends it with the period
  });
});

describe('KC-013: seat limits', () => {
  it('blocks invites on a free team (1 seat)', async () => {
    const owner = await makeUser(`seats-free-o-${suffix}@test.dev`);
    const team = await makeTeam(owner.id, 'Seats Free');
    const { inviteMember } = await import('@/lib/teams');
    await expect(
      inviteMember({ teamId: team.id, email: `seats-invitee-${suffix}@test.dev`, role: 'MEMBER', invitedById: owner.id }),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('blocks acceptance when the team reaches capacity after the invite was issued', async () => {
    const owner = await makeUser(`seats-full-o-${suffix}@test.dev`);
    const accepter = await makeUser(`seats-full-a-${suffix}@test.dev`);
    const team = await makeTeam(owner.id, 'Seats Full');
    await subscribe(team.id, 'TEAM', 2); // owner + one more fills it

    const { inviteMember, acceptInvite } = await import('@/lib/teams');
    // Invite succeeds while the team still has a free seat.
    const invite = await inviteMember({
      teamId: team.id, email: accepter.email, role: 'MEMBER', invitedById: owner.id,
    });

    // The seat is filled by someone else before acceptance (authoritative check).
    const second = await makeUser(`seats-filler-${suffix}@test.dev`);
    await prisma.membership.create({ data: { teamId: team.id, userId: second.id, role: 'MEMBER' } });

    await expect(acceptInvite(invite.token, accepter.id)).rejects.toMatchObject({ status: 409 });
  });
});

describe('KC-014: reset tokens are single-use under concurrency', () => {
  it('only one of two concurrent resets consumes the token', async () => {
    const user = await makeUser(`reset-${suffix}@test.dev`, 'USER');
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: 'placeholder-for-old-password' },
    });
    const token = generateToken();
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 60_000) },
    });

    const request = () =>
      resetPasswordRoute(
        jsonRequest('http://localhost/api/auth/reset-password', { token, password: 'brand-new-pw1!' }),
      );
    const responses = await Promise.all([request(), request()]);
    const statuses = responses.map((response) => response.status).sort();
    expect(statuses).toEqual([200, 400]);

    const record = await prisma.passwordResetToken.findUniqueOrThrow({ where: { tokenHash: hashToken(token) } });
    expect(record.usedAt).not.toBeNull();
  });
});

describe('KC-021: machine deactivation frees activation slots', () => {
  it('owner deactivates a machine and a new activation succeeds', async () => {
    const owner = await makeUser(`deact-${suffix}@test.dev`);
    const { key } = await issueLicense({ ownerId: owner.id, plan: 'PRO', maxActivations: 1 });
    const license = await prisma.licenseKey.findUniqueOrThrow({ where: { key } });

    expect(await validateLicense(key, 'machine-1')).toMatchObject({ valid: true });
    expect(await validateLicense(key, 'machine-2')).toMatchObject({ valid: false }); // limit 1

    await createSession(owner.id);
    const response = await deactivateRoute(
      new Request(`http://localhost/api/licenses/${license.id}/activations/machine-1`, { method: 'DELETE' }),
      { params: Promise.resolve({ licenseId: license.id, machineId: 'machine-1' }) },
    );
    expect(response.status).toBe(200);
    expect((await response.json()).data).toMatchObject({ ok: true, deactivated: true });

    // The freed slot now admits the second machine.
    expect(await validateLicense(key, 'machine-2')).toMatchObject({ valid: true });
  });

  it('rejects outsiders without leaking license existence', async () => {
    const owner = await makeUser(`deact-o-${suffix}@test.dev`);
    const outsider = await makeUser(`deact-x-${suffix}@test.dev`);
    const { key } = await issueLicense({ ownerId: owner.id, plan: 'PRO' });
    const license = await prisma.licenseKey.findUniqueOrThrow({ where: { key } });

    await createSession(outsider.id);
    const response = await deactivateRoute(
      new Request(`http://localhost/api/licenses/${license.id}/activations/machine-1`, { method: 'DELETE' }),
      { params: Promise.resolve({ licenseId: license.id, machineId: 'machine-1' }) },
    );
    expect(response.status).toBe(404);
  });
});

describe('KC-043: explicit credentials never fall back to cookie identity', () => {
  it('rejects a malformed API key (no dot) instead of using the session', async () => {
    const user = await makeUser(`malformed-${suffix}@test.dev`);
    await createSession(user.id); // valid session exists…
    await expect(
      getPrincipal(
        new Request('http://localhost/api/v1/me', {
          headers: { Authorization: 'Bearer totally-malformed' },
        }),
      ),
    ).rejects.toMatchObject({ status: 401, message: expect.stringMatching(/malformed/i) });
  });
});

describe('KC-038: stripe billing configuration validation', () => {
  it('lists every missing setting when stripe mode is misconfigured', () => {
    vi.stubEnv('BILLING_PROVIDER', 'stripe');
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    vi.stubEnv('APP_URL', '');
    vi.stubEnv('STRIPE_PRICE_PRO', '');
    expect(() => validateBillingConfig()).toThrow(/STRIPE_SECRET_KEY[\s\S]*APP_URL[\s\S]*STRIPE_PRICE_PRO/);
    vi.unstubAllEnvs();
  });

  it('passes when stripe mode is fully configured', () => {
    vi.stubEnv('BILLING_PROVIDER', 'stripe');
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_x');
    vi.stubEnv('APP_URL', 'http://localhost:3000');
    vi.stubEnv('STRIPE_PRICE_PRO', 'price_pro');
    vi.stubEnv('STRIPE_PRICE_TEAM', 'price_team');
    vi.stubEnv('STRIPE_PRICE_ENTERPRISE', 'price_ent');
    expect(() => validateBillingConfig()).not.toThrow();
    vi.unstubAllEnvs();
  });

  it('does not validate in mock mode', () => {
    vi.stubEnv('BILLING_PROVIDER', 'mock');
    expect(() => validateBillingConfig()).not.toThrow();
    vi.unstubAllEnvs();
  });
});

describe('KC-040: impersonation start guards', () => {
  it('rejects nested impersonation and suspended targets', async () => {
    const admin = await makeUser(`imp-admin-${suffix}@test.dev`, 'ADMIN');
    const suspended = await makeUser(`imp-suspended-${suffix}@test.dev`);
    await prisma.user.update({ where: { id: suspended.id }, data: { suspendedAt: new Date() } });
    const target = await makeUser(`imp-target-${suffix}@test.dev`);

    await createSession(admin.id);

    // Suspended target is rejected before any cookie/session change.
    const suspendedResponse = await impersonateRoute(
      new Request(`http://localhost/api/admin/users/${suspended.id}/impersonate`, { method: 'POST' }),
      { params: Promise.resolve({ userId: suspended.id }) },
    );
    expect(suspendedResponse.status).toBe(400);

    // Nested impersonation is rejected while a parked admin token exists.
    cookieStore.set('slipstream_impersonator', { name: 'slipstream_impersonator', value: 'parked' });
    const nestedResponse = await impersonateRoute(
      new Request(`http://localhost/api/admin/users/${target.id}/impersonate`, { method: 'POST' }),
      { params: Promise.resolve({ userId: target.id }) },
    );
    expect(nestedResponse.status).toBe(400);
    expect(cookieStore.get('slipstream_impersonator')?.value).toBe('parked'); // token preserved
  });
});

describe('KC-039: email delivery wiring', () => {
  it('forgot-password records a SENT delivery and is enumeration-safe in production', async () => {
    const email = `kc039-fp-${suffix}@test.dev`;
    const missingEmail = `kc039-nobody-${suffix}@test.dev`;

    const user = await makeUser(email);
    const real = await forgotPasswordRoute(
      jsonRequest('http://localhost/api/auth/forgot-password', { email }),
    );
    expect(real.status).toBe(200);
    const delivery = await prisma.emailDelivery.findFirst({
      where: { toEmail: email, kind: 'password_reset' },
    });
    expect(delivery).toMatchObject({ status: 'SENT' });
    expect(delivery?.tokenHash).toBeTruthy();

    // In production the response must not differ between known and unknown
    // accounts (no dev token, identical envelope). Configure the required
    // production transport and fake the webhook.
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('EMAIL_TRANSPORT', 'http');
    vi.stubEnv('EMAIL_WEBHOOK_URL', 'https://hooks.test/email');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 200 }));
    const known = await forgotPasswordRoute(
      jsonRequest('http://localhost/api/auth/forgot-password', { email }),
    );
    const unknown = await forgotPasswordRoute(
      jsonRequest('http://localhost/api/auth/forgot-password', { email: missingEmail }),
    );
    fetchSpy.mockRestore();
    vi.unstubAllEnvs();
    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
    expect((await known.json()).data).toEqual((await unknown.json()).data);
    void user;
  });

  it('team invites deliver an email with a hashed-token record', async () => {
    const owner = await makeUser(`kc039-inv-o-${suffix}@test.dev`);
    const invitee = `kc039-invited-${suffix}@test.dev`;
    const team = await makeTeam(owner.id, 'KC039 Invite Team');
    await subscribe(team.id, 'TEAM', 10);
    await createSession(owner.id);

    const response = await createInviteRoute(
      jsonRequest(`http://localhost/api/teams/${team.id}/invites`, { email: invitee, role: 'MEMBER' }),
      { params: Promise.resolve({ teamId: team.id }) },
    );
    expect(response.status).toBe(200);
    const delivery = await prisma.emailDelivery.findFirst({ where: { toEmail: invitee, kind: 'invite' } });
    expect(delivery).toMatchObject({ status: 'SENT' });
    expect(delivery?.tokenHash).toBeTruthy();
  });
});

describe('KC-040: email verification lifecycle', () => {
  it('signup starts unverified, delivers a verification email, and accepts the emailed token once', async () => {
    const email = `kc040-signup-${suffix}@test.dev`;
    const response = await signupRoute(
      jsonRequest('http://localhost/api/auth/signup', { email, password: 'password123' }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    const verifyToken = body.data?.verifyToken as string | undefined;
    expect(verifyToken).toBeTruthy(); // dev/test convenience

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.emailVerifiedAt).toBeNull();
    const delivery = await prisma.emailDelivery.findFirst({ where: { toEmail: email, kind: 'email_verify' } });
    expect(delivery).toMatchObject({ status: 'SENT' });

    // Explicit confirmation consumes the token exactly once.
    const first = await verifyEmailRoute(jsonRequest('http://localhost/api/auth/verify-email', { token: verifyToken }));
    expect(first.status).toBe(200);
    expect((await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).emailVerifiedAt).not.toBeNull();
    const replay = await verifyEmailRoute(jsonRequest('http://localhost/api/auth/verify-email', { token: verifyToken }));
    expect(replay.status).toBe(400);

    await createSession(user.id);
    const resend = await resendVerifyRoute(new Request('http://localhost/api/auth/verify-email/resend', { method: 'POST' }));
    expect(resend.status).toBe(200); // idempotent for already-verified users
  });

  it('rejects invalid and expired verification tokens without leaking state', async () => {
    const invalid = await verifyEmailRoute(
      jsonRequest('http://localhost/api/auth/verify-email', { token: 'not-a-real-token' }),
    );
    expect(invalid.status).toBe(400);

    const user = await makeUser(`kc040-expired-${suffix}@test.dev`);
    await prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: null } });
    const { createEmailVerification } = await import('@/lib/verify');
    const { token } = await createEmailVerification(user.id);
    await prisma.emailVerificationToken.updateMany({
      where: { userId: user.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    const expired = await verifyEmailRoute(jsonRequest('http://localhost/api/auth/verify-email', { token }));
    expect(expired.status).toBe(400);
    expect((await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).emailVerifiedAt).toBeNull();
  });

  it('blocks invitation acceptance until the invitee verifies, then allows it', async () => {
    const owner = await makeUser(`kc040-owner-${suffix}@test.dev`);
    const inviteeEmail = `kc040-invitee-${suffix}@test.dev`;
    const team = await makeTeam(owner.id, 'KC040 Team');
    await subscribe(team.id, 'TEAM', 10);

    // Invitee exists but is unverified.
    const invitee = await prisma.user.create({ data: { email: inviteeEmail } });
    createdUserIds.push(invitee.id);
    const invite = await inviteMember({
      teamId: team.id, email: inviteeEmail, role: 'MEMBER', invitedById: owner.id,
    });

    await expect(acceptInvite(invite.token, invitee.id)).rejects.toMatchObject({
      status: 403,
      message: expect.stringMatching(/verify your email/i),
    });

    // Verify, then acceptance succeeds (recipient binding still applies).
    await prisma.user.update({ where: { id: invitee.id }, data: { emailVerifiedAt: new Date() } });
    await expect(acceptInvite(invite.token, invitee.id)).resolves.toEqual({ teamId: team.id });
  });

  it('resend requires an authenticated user', async () => {
    cookieStore.clear();
    const response = await resendVerifyRoute(
      new Request('http://localhost/api/auth/verify-email/resend', { method: 'POST' }),
    );
    expect(response.status).toBe(401);
  });
});
