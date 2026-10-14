import { prisma, type Prisma } from '@slipstream-ui/db';

type AuditInput = {
  actorId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

export async function audit(input: AuditInput, transaction?: Prisma.TransactionClient): Promise<void> {
  const write = () => (transaction ?? prisma).auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
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
