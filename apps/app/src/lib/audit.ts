import { prisma } from '@slipstream-ui/db';

interface AuditInput {
  actorId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Append-only audit trail. Never throws into the caller's flow — a failed
 * audit write is logged but must not break the business operation.
 */
export async function audit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    });
  } catch (error) {
    console.error('[audit] failed to record', input.action, error);
  }
}
