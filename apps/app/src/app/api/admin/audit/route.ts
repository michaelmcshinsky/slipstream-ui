export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle } from '@/lib/api/handle';
import { decodeCursor, errors, paginationSchema, parseQuery } from '@/lib/api/core';

type AuditCursor = { createdAt: Date; id: string };

function decodeAuditCursor(cursor?: string): AuditCursor | undefined {
  const decoded = decodeCursor(cursor);
  if (!decoded) return undefined;
  const [iso, id, extra] = decoded.split('|');
  const createdAt = iso ? new Date(iso) : undefined;
  if (!id || extra !== undefined || !createdAt || Number.isNaN(createdAt.getTime())) {
    throw errors.badRequest('Invalid cursor.');
  }
  return { createdAt, id };
}

export async function GET(request: Request) {
  return handle(request, async () => {
    requireAdmin(await getSessionUser());
    const action = new URL(request.url).searchParams.get('action');
    const { limit, cursor } = parseQuery(request, paginationSchema(100, 200));
    const after = decodeAuditCursor(cursor);

    const rows = await prisma.auditLog.findMany({
      where: {
        ...(action ? { action: { contains: action } } : {}),
        ...(after
          ? {
              OR: [
                { createdAt: { lt: after.createdAt } },
                { createdAt: after.createdAt, id: { lt: after.id } },
              ],
            }
          : {}),
      },
      include: { actor: { select: { email: true } } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const logs = hasMore ? rows.slice(0, limit) : rows;
    const last = logs.at(-1);
    return {
      logs,
      hasMore,
      nextCursor:
        hasMore && last
          ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
          : undefined,
    };
  });
}
