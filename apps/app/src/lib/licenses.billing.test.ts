import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import { prisma, Prisma } from '@slipstream-ui/db';
import * as tokens from './tokens';
import * as auditModule from './audit';
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
  it.each(['PRO', 'TEAM', 'ENTERPRISE'])('preserves legacy and new %s key lookup and validation', async (plan) => {
    const owner = await makeUser(cleanup.users, `prefix-${plan}-${Date.now()}@test.dev`);
    const label = `slip_${plan.toLowerCase().slice(0, 8)}_`;
    const legacyKey = `${label}abcdefghijklmnopqrstuvwxyz0`;
    const legacy = await prisma.licenseKey.create({
      data: { key: legacyKey, prefix: legacyKey.slice(0, 16), ownerId: owner.id, plan },
    });
    cleanup.licenses.push(legacy.id);

    const { key } = await issueLicense({ ownerId: owner.id, plan });
    const issued = await prisma.licenseKey.findUniqueOrThrow({ where: { key } });
    cleanup.licenses.push(issued.id);
    expect(issued.prefix).toBe(`${label}${key.slice(label.length, label.length + 16)}`);
    expect(await prisma.auditLog.findFirst({
      where: { actorId: owner.id, action: 'license.issued', targetId: issued.prefix },
    })).not.toBeNull();

    for (const license of [legacy, issued]) {
      expect(await prisma.licenseKey.findUnique({ where: { prefix: license.prefix } })).toMatchObject({
        id: license.id, key: license.key,
      });
      expect(await validateLicense(license.key, 'prefix-compat-machine')).toEqual({ valid: true, plan });
      expect(await validateLicense(license.prefix, 'prefix-compat-machine')).toMatchObject({ valid: false });
      expect(await validateLicense(`${license.key}x`, 'prefix-compat-machine')).toMatchObject({ valid: false });
    }
    expect(await prisma.licenseKey.findUnique({ where: { key: legacyKey } })).toMatchObject({
      prefix: legacyKey.slice(0, 16),
    });
  });

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

describe('license collision retry (KC-009)', () => {
  const ownerIds: string[] = [];

  afterEach(async () => {
    vi.restoreAllMocks();
    await prisma.licenseKey.deleteMany({ where: { ownerId: { in: ownerIds } } });
    await prisma.auditLog.deleteMany({ where: { actorId: { in: ownerIds } } });
    await prisma.user.deleteMany({ where: { id: { in: ownerIds } } });
    ownerIds.length = 0;
  });

  async function fixture(plan = 'PRO', target = 'prefix') {
    const owner = await makeUser(ownerIds, `collision-${ownerIds.length}-${Date.now()}@test.dev`);
    const candidate = tokens.generateLicenseKey(plan);
    const fresh = tokens.generateLicenseKey(plan);
    const stored = await prisma.licenseKey.create({
      data: {
        key: target === 'key' ? candidate.key : `${candidate.key}different`,
        prefix: target === 'prefix' ? candidate.prefix : candidate.key.slice(0, 16),
        ownerId: owner.id,
        plan,
      },
    });
    const generate = vi.spyOn(tokens, 'generateLicenseKey').mockReturnValue(fresh);
    const audit = vi.spyOn(auditModule, 'audit');
    return { owner, candidate, fresh, stored, generate, audit };
  }

  async function issue(ownerId: string, plan: string, transactional: boolean) {
    const params = { ownerId, plan, maxActivations: 7, note: 'collision test', actorId: ownerId };
    return transactional
      ? prisma.$transaction((tx) => issueLicense(params, tx))
      : issueLicense(params);
  }

  describe.each([false, true])('transaction client: %s', (transactional) => {
    it.each([
      ['PRO', 'prefix'], ['PRO', 'key'],
      ['TEAM', 'prefix'], ['TEAM', 'key'],
      ['ENTERPRISE', 'prefix'], ['ENTERPRISE', 'key'],
    ])('retries persisted %s %s conflicts and audits once on the last attempt', async (plan, target) => {
      const { owner, candidate, fresh, stored, generate, audit } = await fixture(plan, target);
      await expect(prisma.licenseKey.create({
        data: { ...candidate, ownerId: owner.id, plan },
      })).rejects.toMatchObject({ code: 'P2002', meta: { modelName: 'LicenseKey', target: [target] } });
      generate.mockReturnValueOnce(candidate).mockReturnValueOnce(candidate);

      await expect(issue(owner.id, plan, transactional)).resolves.toEqual({ key: fresh.key });

      expect(generate).toHaveBeenCalledTimes(3);
      expect(generate.mock.calls).toEqual([[plan], [plan], [plan]]);
      expect(await prisma.licenseKey.findUnique({ where: { id: stored.id } })).toEqual(stored);
      expect(await prisma.licenseKey.findUnique({ where: { key: fresh.key } })).toMatchObject({
        ...fresh, ownerId: owner.id, plan, maxActivations: 7, note: 'collision test',
      });
      expect(await prisma.licenseKey.count({ where: { ownerId: owner.id } })).toBe(2);
      expect(audit).toHaveBeenCalledTimes(1);
      expect(await prisma.auditLog.findMany({ where: { actorId: owner.id } })).toEqual([
        expect.objectContaining({ action: 'license.issued', targetId: fresh.prefix, metadata: JSON.stringify({ plan }) }),
      ]);
    });

    it.each(['prefix', 'key'])('fails explicitly after three persisted %s collisions', async (target) => {
      const { owner, candidate, generate, audit } = await fixture('PRO', target);
      generate.mockReturnValue(candidate);
      const operation = transactional
        ? prisma.$transaction(async (tx) => {
          await tx.user.update({ where: { id: owner.id }, data: { name: 'must roll back' } });
          return issueLicense({ ownerId: owner.id, plan: 'PRO' }, tx);
        })
        : issueLicense({ ownerId: owner.id, plan: 'PRO' });

      await expect(operation).rejects.toThrow('Unable to generate a unique license key after 3 attempts.');
      expect(generate).toHaveBeenCalledTimes(3);
      expect(audit).not.toHaveBeenCalled();
      expect(await prisma.licenseKey.count({ where: { ownerId: owner.id } })).toBe(1);
      expect(await prisma.auditLog.count({ where: { actorId: owner.id } })).toBe(0);
      expect(await prisma.user.findUnique({ where: { id: owner.id } })).toMatchObject({ name: owner.name });
    });

    it('propagates real foreign-key failures without retrying', async () => {
      const { owner, generate, audit } = await fixture();
      const params = { ownerId: owner.id, teamId: 'missing-collision-test-team', plan: 'PRO' };
      const operation = transactional
        ? prisma.$transaction((tx) => issueLicense(params, tx))
        : issueLicense(params);
      await expect(operation).rejects.toMatchObject({ code: 'P2003' });
      expect(generate).toHaveBeenCalledTimes(1);
      expect(audit).not.toHaveBeenCalled();
      expect(await prisma.licenseKey.count({ where: { ownerId: owner.id } })).toBe(1);
    });

    it('propagates real audit failures without repeating a successful insert', async () => {
      const { owner, candidate, fresh, generate, audit } = await fixture();
      generate.mockReturnValueOnce(candidate);
      const params = { ownerId: owner.id, actorId: 'missing-collision-test-actor', plan: 'PRO' };
      const operation = transactional
        ? prisma.$transaction((tx) => issueLicense(params, tx))
        : issueLicense(params);
      await expect(operation).rejects.toMatchObject({ code: 'P2003' });
      expect(generate).toHaveBeenCalledTimes(2);
      expect(audit).toHaveBeenCalledTimes(1);
      expect(await prisma.licenseKey.count({ where: { key: fresh.key } })).toBe(0);
      expect(await prisma.auditLog.count({ where: { actorId: owner.id } })).toBe(0);
      expect(await prisma.licenseKey.count({ where: { ownerId: owner.id } })).toBe(1);

      await expect(issue(owner.id, 'PRO', transactional)).resolves.toEqual({ key: fresh.key });
      expect(generate).toHaveBeenCalledTimes(3);
      expect(audit).toHaveBeenCalledTimes(2);
      expect(await prisma.licenseKey.count({ where: { ownerId: owner.id } })).toBe(2);
      expect(await prisma.licenseKey.findUnique({ where: { key: fresh.key } })).toMatchObject(fresh);
      expect(await prisma.auditLog.findMany({ where: { actorId: owner.id } })).toEqual([
        expect.objectContaining({ action: 'license.issued', targetId: fresh.prefix }),
      ]);
    });

    it('never treats an audit P2002 as an insert collision', async () => {
      const { owner, candidate, fresh, generate, audit } = await fixture();
      const failure = new Prisma.PrismaClientKnownRequestError('audit failure', {
        code: 'P2002', clientVersion: Prisma.prismaVersion.client,
        meta: { modelName: 'LicenseKey', target: ['prefix'] },
      });
      generate.mockReturnValueOnce(candidate);
      audit.mockRejectedValueOnce(failure);
      await expect(issue(owner.id, 'PRO', transactional)).rejects.toBe(failure);
      expect(generate).toHaveBeenCalledTimes(2);
      expect(audit).toHaveBeenCalledTimes(1);
      expect(await prisma.licenseKey.count({ where: { key: fresh.key } })).toBe(0);
    });
  });

  it.each([
    { code: 'P2002', meta: { modelName: 'LicenseKey', target: ['id'] } },
    { code: 'P2002', meta: { modelName: 'LicenseKey', target: ['ownerId'] } },
    { code: 'P2002', meta: { modelName: 'AuditLog', target: ['prefix'] } },
    { code: 'P2002', meta: { target: ['key', 'ownerId'] } },
    { code: 'P2002', meta: { target: [] } },
    { code: 'P2002', meta: { target: 'LicenseKey_prefix_key' } },
    { code: 'P2002', meta: { target: ['prefix_extra'] } },
    { code: 'P2002', meta: {} },
    { code: 'P2003', meta: { target: ['prefix'] } },
    { code: 'P2028', meta: { target: ['key'] } },
  ])('propagates unrelated Prisma insert failure %j', async ({ code, meta }) => {
    const { owner, generate, audit } = await fixture();
    const failure = new Prisma.PrismaClientKnownRequestError('insert failure', {
      code, meta, clientVersion: Prisma.prismaVersion.client,
    });
    const create = vi.fn(() => { throw failure; });
    await expect(prisma.$transaction((tx) => {
      const db: Prisma.TransactionClient = { ...tx, licenseKey: { ...tx.licenseKey, create } };
      return issueLicense({ ownerId: owner.id, plan: 'PRO' }, db);
    })).rejects.toBe(failure);
    expect(create).toHaveBeenCalledTimes(1);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(audit).not.toHaveBeenCalled();
  });

  it.each([
    new Error('database unavailable'),
    { code: 'P2002', meta: { modelName: 'LicenseKey', target: ['prefix'] } },
  ])('does not retry non-Prisma failures', async (failure) => {
    const { owner, generate, audit } = await fixture();
    const create = vi.fn(() => { throw failure; });
    await expect(prisma.$transaction((tx) => {
      const db: Prisma.TransactionClient = { ...tx, licenseKey: { ...tx.licenseKey, create } };
      return issueLicense({ ownerId: owner.id, plan: 'PRO' }, db);
    })).rejects.toBe(failure);
    expect(create).toHaveBeenCalledTimes(1);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(audit).not.toHaveBeenCalled();
  });

  it('rolls back the retried license, audit and caller writes on a later transaction failure', async () => {
    const { owner, candidate, fresh, generate, audit } = await fixture();
    generate.mockReturnValueOnce(candidate);
    const failure = new Error('later caller failure');
    await expect(prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: owner.id }, data: { name: 'must roll back' } });
      await issueLicense({ ownerId: owner.id, plan: 'PRO' }, tx);
      expect(await tx.licenseKey.count({ where: { key: fresh.key } })).toBe(1);
      expect(await tx.auditLog.count({ where: { actorId: owner.id } })).toBe(1);
      throw failure;
    })).rejects.toBe(failure);
    expect(generate).toHaveBeenCalledTimes(2);
    expect(audit).toHaveBeenCalledTimes(1);
    expect(await prisma.licenseKey.count({ where: { ownerId: owner.id } })).toBe(1);
    expect(await prisma.auditLog.count({ where: { actorId: owner.id } })).toBe(0);
    expect(await prisma.user.findUnique({ where: { id: owner.id } })).toMatchObject({ name: owner.name });
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

    await mockProvider.createCheckout({ teamId: team.id, userId: owner.id, plan: 'TEAM', email: owner.email });
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
