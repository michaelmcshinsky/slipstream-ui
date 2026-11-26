export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle, z } from '@/lib/api/handle';
import { decodeTimestampCursor, encodeTimestampCursor, paginationSchema, parseQuery } from '@/lib/api/core';

const STATUSES = ['QUEUED', 'SENT', 'FAILED'] as const;

/** GET /api/admin/email/deliveries — recent outbound email deliveries. */
export async function GET(request: Request) {
  return handle(request, async () => {
    requireAdmin(await getSessionUser());
    const url = new URL(request.url);
    const status = z.enum(STATUSES).optional().safeParse(url.searchParams.get('status') || undefined);
    const { limit, cursor } = parseQuery(request, paginationSchema(100, 200));
    const after = decodeTimestampCursor(cursor);

    const rows = await prisma.emailDelivery.findMany({
      where: {
        ...(status.success ? { status: status.data } : {}),
        ...(after
          ? {
              OR: [
                { createdAt: { lt: after.at } },
                { createdAt: after.at, id: { lt: after.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const deliveries = hasMore ? rows.slice(0, limit) : rows;
    const last = deliveries.at(-1);
    return {
      deliveries,
      hasMore,
      nextCursor:
        hasMore && last
          ? encodeTimestampCursor(last.createdAt, last.id)
          : undefined,
    };
  });
}
