import { prisma, Prisma } from '@slipstream-ui/db';
import { generateLicenseKey } from './tokens';
import { audit } from './audit';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  plan?: string;
}

class ActivationLimitReached extends Error {}

const ACTIVATION_CLAIM_ATTEMPTS = 2;

/**
 * Validate a license key + machine id pair, recording or refreshing the
 * activation. Enforces status, expiry, and per-key activation limits — this
 * is the endpoint the CLI and MCP server call.
 *
 * The activation claim (count + insert) runs in one transaction so
 * concurrent machines cannot exceed the limit; the unique
 * (licenseId, machineId) constraint collapses same-machine races (KC-014).
 */
export async function validateLicense(key: string, machineId: string): Promise<ValidationResult> {
  const license = await prisma.licenseKey.findUnique({
    where: { key },
    include: { activations: true },
  });
  if (!license || license.status !== 'ACTIVE') {
    return { valid: false, reason: 'License not found or revoked.' };
  }
  if (license.expiresAt && license.expiresAt < new Date()) {
    return { valid: false, reason: 'License expired.' };
  }

  const existing = license.activations.find((activation) => activation.machineId === machineId);
  if (existing) {
    await prisma.licenseActivation.update({
      where: { id: existing.id },
      data: { lastSeenAt: new Date() },
    });
    return { valid: true, plan: license.plan };
  }

  for (let attempt = 1; attempt <= ACTIVATION_CLAIM_ATTEMPTS; attempt++) {
    try {
      await prisma.$transaction(async (tx) => {
        const count = await tx.licenseActivation.count({ where: { licenseId: license.id } });
        if (count >= license.maxActivations) {
          throw new ActivationLimitReached(`Activation limit reached (${license.maxActivations}). Deactivate a machine first.`);
        }
        await tx.licenseActivation.create({ data: { licenseId: license.id, machineId } });
      });
      return { valid: true, plan: license.plan };
    } catch (error) {
      if (error instanceof ActivationLimitReached) {
        return { valid: false, reason: error.message };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // A concurrent request registered the same machine; refresh and accept.
        await prisma.licenseActivation.updateMany({
          where: { licenseId: license.id, machineId },
          data: { lastSeenAt: new Date() },
        });
        return { valid: true, plan: license.plan };
      }
      const contention = error instanceof Prisma.PrismaClientKnownRequestError && ['P2034', 'P1008', 'P2028'].includes(error.code);
      if (contention && attempt < ACTIVATION_CLAIM_ATTEMPTS) continue;
      throw error;
    }
  }
  return { valid: false, reason: 'Activation is busy. Retry shortly.' };
}

const LICENSE_KEY_MAX_ATTEMPTS = 3;

function isGeneratedLicenseCollision(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') return false;
  if (error.meta?.modelName !== undefined && error.meta.modelName !== 'LicenseKey') return false;
  const target = error.meta?.target;
  return Array.isArray(target) && target.length === 1 && (target[0] === 'key' || target[0] === 'prefix');
}

export async function issueLicense(params: {
  ownerId: string;
  plan: string;
  teamId?: string;
  maxActivations?: number;
  note?: string;
  actorId?: string;
  /** Subscription-bound licenses expire with the billing period (KC-008). */
  expiresAt?: Date | null;
}, transaction?: Prisma.TransactionClient): Promise<{ key: string }> {
  if (!transaction) return prisma.$transaction((tx) => issueLicense(params, tx));
  const db = transaction;
  const planInfo = ['PRO', 'TEAM', 'ENTERPRISE'].includes(params.plan) ? params.plan : 'PRO';
  let key = '';
  let prefix = '';
  for (let attempt = 1; attempt <= LICENSE_KEY_MAX_ATTEMPTS; attempt++) {
    ({ key, prefix } = generateLicenseKey(params.plan));
    try {
      await db.licenseKey.create({
        data: {
          key,
          prefix,
          ownerId: params.ownerId,
          teamId: params.teamId,
          plan: planInfo,
          maxActivations: params.maxActivations ?? (planInfo === 'TEAM' || planInfo === 'ENTERPRISE' ? 100 : 3),
          note: params.note,
          expiresAt: params.expiresAt ?? null,
        },
      });
      break;
    } catch (error) {
      if (!isGeneratedLicenseCollision(error)) throw error;
      if (attempt === LICENSE_KEY_MAX_ATTEMPTS) {
        throw new Error(
          `Unable to generate a unique license key after ${LICENSE_KEY_MAX_ATTEMPTS} attempts.`,
          { cause: error },
        );
      }
    }
  }
  await audit({
    actorId: params.actorId ?? params.ownerId,
    action: 'license.issued',
    targetType: 'license',
    targetId: prefix,
    metadata: { plan: planInfo },
  }, transaction);
  return { key };
}

export async function revokeLicense(licenseId: string, actorId: string): Promise<void> {
  await prisma.licenseKey.update({
    where: { id: licenseId },
    data: { status: 'REVOKED', revokedAt: new Date() },
  });
  await audit({ actorId, action: 'license.revoked', targetType: 'license', targetId: licenseId });
}

/**
 * Deactivate a single machine against a license, freeing its slot (KC-021).
 * Idempotent: deactivating an unknown machine is a no-op success.
 */
export async function deactivateMachine(licenseId: string, machineId: string, actorId: string): Promise<boolean> {
  const result = await prisma.licenseActivation.deleteMany({ where: { licenseId, machineId } });
  if (result.count > 0) {
    await audit({
      actorId,
      action: 'license.machine.deactivated',
      targetType: 'license',
      targetId: licenseId,
      metadata: { machineId },
    });
  }
  return result.count > 0;
}

/** Team-wide activation capacity allowed per plan (matches issueLicense defaults). */export function planActivationBudget(plan: string): number {
  return plan === 'TEAM' || plan === 'ENTERPRISE' ? 100 : 3;
}

/**
 * Remaining activation capacity for a team under its plan budget. Issuance
 * must not push the team's aggregate maxActivations over this budget (KC-001).
 */
export async function remainingTeamActivationBudget(teamId: string, plan: string): Promise<number> {
  const budget = planActivationBudget(plan);
  const aggregate = await prisma.licenseKey.aggregate({
    where: { teamId, status: 'ACTIVE' },
    _sum: { maxActivations: true },
  });
  return Math.max(0, budget - (aggregate._sum.maxActivations ?? 0));
}

/**
 * Revoke every active TEAM/ENTERPRISE license bound to a team. Called when a
 * team's paid subscription ends so out-standing licenses stop validating (KC-008).
 */
export async function revokeSubscriptionLicenses(teamId: string, actorId: string, transaction?: Prisma.TransactionClient): Promise<number> {
  const db = transaction ?? prisma;
  const result = await db.licenseKey.updateMany({
    where: { teamId, status: 'ACTIVE', plan: { in: ['TEAM', 'ENTERPRISE'] } },
    data: { status: 'REVOKED', revokedAt: new Date() },
  });
  if (result.count > 0) {
    await audit({
      actorId,
      action: 'license.revoked',
      targetType: 'team',
      targetId: teamId,
      metadata: { reason: 'subscription-ended', count: result.count },
    }, transaction);
  }
  return result.count;
}
