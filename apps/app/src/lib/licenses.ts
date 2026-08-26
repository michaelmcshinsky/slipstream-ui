import { prisma } from '@slipstream-ui/db';
import { generateLicenseKey } from './tokens';
import { audit } from './audit';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  plan?: string;
}

/**
 * Validate a license key + machine id pair, recording or refreshing the
 * activation. Enforces status, expiry, and per-key activation limits — this
 * is the endpoint the CLI and MCP server call.
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

  if (license.activations.length >= license.maxActivations) {
    return {
      valid: false,
      reason: `Activation limit reached (${license.maxActivations}). Deactivate a machine first.`,
    };
  }

  await prisma.licenseActivation.create({ data: { licenseId: license.id, machineId } });
  return { valid: true, plan: license.plan };
}

export async function issueLicense(params: {
  ownerId: string;
  plan: string;
  teamId?: string;
  maxActivations?: number;
  note?: string;
  actorId?: string;
}): Promise<{ key: string }> {
  const { key, prefix } = generateLicenseKey(params.plan);
  const planInfo = ['PRO', 'TEAM', 'ENTERPRISE'].includes(params.plan) ? params.plan : 'PRO';
  await prisma.licenseKey.create({
    data: {
      key,
      prefix,
      ownerId: params.ownerId,
      teamId: params.teamId,
      plan: planInfo,
      maxActivations: params.maxActivations ?? (planInfo === 'TEAM' || planInfo === 'ENTERPRISE' ? 100 : 3),
      note: params.note,
    },
  });
  await audit({
    actorId: params.actorId ?? params.ownerId,
    action: 'license.issued',
    targetType: 'license',
    targetId: prefix,
    metadata: { plan: planInfo },
  });
  return { key };
}

export async function revokeLicense(licenseId: string, actorId: string): Promise<void> {
  await prisma.licenseKey.update({
    where: { id: licenseId },
    data: { status: 'REVOKED', revokedAt: new Date() },
  });
  await audit({ actorId, action: 'license.revoked', targetType: 'license', targetId: licenseId });
}
