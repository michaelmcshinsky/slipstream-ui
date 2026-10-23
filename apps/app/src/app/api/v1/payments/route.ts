import { prisma } from '@slipstream-ui/db';
import { handle, parseQuery, paginationSchema, paginate, decodeCursor, json } from '@/lib/api/core';
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
    const cursorId = decodeCursor(query.cursor);

    const memberships = await prisma.membership.findMany({
      where: { userId: principal.user.id },
      select: { teamId: true },
    });
    const teamIds = memberships.map((m) => m.teamId);
    const scopedTeamIds = query.teamId ? teamIds.filter((id) => id === query.teamId) : teamIds;

    const rows = await prisma.payment.findMany({
      where: { teamId: { in: scopedTeamIds } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
      take: query.limit + 1,
    });

    const { items, meta } = paginate(rows, query.limit);
    return json(
      items.map((payment) => ({
        id: payment.id,
        teamId: payment.teamId,
        amountCents: payment.amountCents,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        createdAt: payment.createdAt,
      })),
      { request, meta }
    );
  }, { routeName: 'v1.payments' });
}
