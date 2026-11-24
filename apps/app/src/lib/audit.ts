import { cookies } from 'next/headers';
import { prisma, type Prisma } from '@slipstream-ui/db';
import { hashToken } from './tokens';

type AuditInput = {
  actorId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

const IMPERSONATOR_COOKIE = 'slipstream_impersonator';

/**
 * When an admin is impersonating, the session cookie resolves to the target
 * user, so audit rows would otherwise record the victim as the actor. Resolve
 * the parked admin session and attach it to metadata so impersonated actions
 * stay distinguishable. Returns null outside a request scope (webhooks, cron)
 * or when no impersonation is active.
 */
async function impersonatorContext(): Promise<{ id: string; email: string } | null> {
  try {
    const store = await cookies();
    const token = store.get(IMPERSONATOR_COOKIE)?.value;
    if (!token) return null;
    const session = await prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date() || session.user.suspendedAt) return null;
    return { id: session.user.id, email: session.user.email };
  } catch {
    return null;
  }
}

export async function audit(input: AuditInput, transaction?: Prisma.TransactionClient): Promise<void> {
  const impersonator = await impersonatorContext();
  const metadata = impersonator
    ? { ...input.metadata, impersonatedBy: impersonator }
    : input.metadata;
  const write = () => (transaction ?? prisma).auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
  if (transaction) {
    await write();
    return;
  }
  try {
    await write();
  } catch (error) {
    console.error('[audit] failed to record', input.action, error);
  }
}
