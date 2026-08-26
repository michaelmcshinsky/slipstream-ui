import { afterAll, describe, expect, it } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { validateLicense, issueLicense, revokeLicense } from './licenses';
import { activateSubscription, downgradeToFree, getBillingProvider, mockProvider } from './billing';
import { makeUser } from '../test/helpers';

const cleanup: { users: string[]; teams: string[]; licenses: string[] } = {
  users: [], teams: [], licenses: [],
};

afterAll(async () => {
  for (const id of cleanup.licenses) await prisma.licenseKey.delete({ where: { id } }).catch(() => {});
  for (const id of cleanup.teams) await prisma.team.delete({ where: { id } }).catch(() => {});
  for (const id of cleanup.users) await prisma.user.delete({ where: { id } }).catch(() => {});
  await prisma.$disconnect();
});

describe('licenses', () => {
  it('validates a key and enforces activation limits per machine', async () => {
    const owner = await makeUser(cleanup.users, `lic-${Date.now()}@test.dev`);
    const { key } = await issueLicense({ ownerId: owner.id, plan: 'PRO', maxActivations: 2 });

    expect(await validateLicense(key, 'machine-a')).toEqual({ valid: true, plan: 'PRO' });
    expect(await validateLicense(key, 'machine-b')).toEqual({ valid: true, plan: 'PRO' });
    // Third machine exceeds the limit of 2.
    const third = await validateLicense(key, 'machine-c');
    expect(third.valid).toBe(false);
    expect(third.reason).toContain('Activation limit');

    // Existing machines revalidate without consuming new slots.
    expect((await validateLicense(key, 'machine-a')).valid).toBe(true);
  });

  it('rejects revoked keys', async () => {
    const owner = await makeUser(cleanup.users, `revoked-${Date.now()}@test.dev`);
    const { key } = await issueLicense({ ownerId: owner.id, plan: 'PRO' });
    const license = await prisma.licenseKey.findUniqueOrThrow({ where: { key } });
    cleanup.licenses.push(license.id);

    await revokeLicense(license.id, owner.id);
    const result = await validateLicense(key, 'any-machine');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('revoked');
  });

  it('issues TEAM licenses with higher activation limits', async () => {
    const owner = await makeUser(cleanup.users, `team-lic-${Date.now()}@test.dev`);
    const { key } = await issueLicense({ ownerId: owner.id, plan: 'TEAM', maxActivations: 100 });
    const license = await prisma.licenseKey.findUniqueOrThrow({
      where: { key },
      include: { activations: true },
    });
    cleanup.licenses.push(license.id);
    expect(license.maxActivations).toBe(100);
  });
});

describe('billing', () => {
  it('defaults to the mock provider', () => {
    // Test env does not set BILLING_PROVIDER.
    delete process.env.BILLING_PROVIDER;
    expect(getBillingProvider().name).toBe('mock');
  });

  it('activates a subscription with plan seats and records state', async () => {
    const owner = await makeUser(cleanup.users, `bill-owner-${Date.now()}@test.dev`);
    const team = await prisma.team.create({
      data: { name: 'Bill Team', slug: `bill-team-${Date.now()}`, memberships: { create: { userId: owner.id, role: 'OWNER' } } },
    });
    cleanup.teams.push(team.id);

    await mockProvider.createCheckout({ teamId: team.id, plan: 'TEAM', email: owner.email });
    await activateSubscription(team.id, 'TEAM');

    const subscription = await prisma.subscription.findUnique({ where: { teamId: team.id } });
    expect(subscription).toMatchObject({ plan: 'TEAM', status: 'ACTIVE', seats: 10 });
  });

  it('downgrades to FREE on cancellation', async () => {
    const owner = await makeUser(cleanup.users, `cancel-owner-${Date.now()}@test.dev`);
    const team = await prisma.team.create({
      data: { name: 'Cancel Team', slug: `cancel-team-${Date.now()}`, memberships: { create: { userId: owner.id, role: 'OWNER' } } },
    });
    cleanup.teams.push(team.id);

    await activateSubscription(team.id, 'PRO');
    await downgradeToFree(team.id);

    const subscription = await prisma.subscription.findUnique({ where: { teamId: team.id } });
    expect(subscription).toMatchObject({ plan: 'FREE', status: 'CANCELED' });
  });
});
