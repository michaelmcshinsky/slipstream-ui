import { prisma } from '@slipstream-ui/db';
import { handle, parseQuery, paginationSchema, decodeTimestampCursor, encodeTimestampCursor, json } from '@/lib/api/core';
import { getPrincipal, requirePrincipal } from '@/lib/api/auth';
import { z } from 'zod';

const querySchema = paginationSchema(20).extend({
  teamId: z.string().optional(),
});

/** GET /api/v1/payments — payments across the caller's teams, newest first. */
export async function GET(request: Request) {
  return handle(request, async () => {
    const principal = requirePrincipal(await getPrincipal(request));
    const query = parseQuery(request, querySchema);
    const after = decodeTimestampCursor(query.cursor);

    const memberships = await prisma.membership.findMany({
      where: { userId: principal.user.id },
      select: { teamId: true },
    });
    const teamIds = memberships.map((m) => m.teamId);
    const scopedTeamIds = query.teamId ? teamIds.filter((id) => id === query.teamId) : teamIds;

    // Keyset pagination on (createdAt, id): Prisma's `cursor` option cannot
    // express a composite `ORDER BY createdAt DESC, id DESC` position.
    const rows = await prisma.payment.findMany({
      where: {
        teamId: { in: scopedTeamIds },
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
      take: query.limit + 1,
    });

    const hasMore = rows.length > query.limit;
    const page = hasMore ? rows.slice(0, query.limit) : rows;
    const last = page.at(-1);
    const items = page.map((payment) => ({
      id: payment.id,
      teamId: payment.teamId,
      amountCents: payment.amountCents,
      currency: payment.currency,
      status: payment.status,
      description: payment.description,
      createdAt: payment.createdAt,
    }));
    return json(items, {
      request,
      meta: {
        limit: query.limit,
        hasMore,
        ...(hasMore && last ? { nextCursor: encodeTimestampCursor(last.createdAt, last.id) } : {}),
      },
    });
  }, { routeName: 'v1.payments' });
}
