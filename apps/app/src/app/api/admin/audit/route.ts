export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle } from '@/lib/api/handle';
import { decodeTimestampCursor, encodeTimestampCursor, paginationSchema, parseQuery } from '@/lib/api/core';

export async function GET(request: Request) {
  return handle(request, async () => {
    requireAdmin(await getSessionUser());
    const action = new URL(request.url).searchParams.get('action');
    const { limit, cursor } = parseQuery(request, paginationSchema(100, 200));
    const after = decodeTimestampCursor(cursor);

    const rows = await prisma.auditLog.findMany({
      where: {
        ...(action ? { action: { contains: action } } : {}),
        ...(after
          ? {
              OR: [
                { createdAt: { lt: after.at } },
                { createdAt: after.at, id: { lt: after.id } },
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
          ? encodeTimestampCursor(last.createdAt, last.id)
          : undefined,
    };
  });
}
