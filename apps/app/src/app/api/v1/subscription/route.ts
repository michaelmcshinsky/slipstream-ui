import { prisma } from '@slipstream-ui/db';
import { handle, parseQuery, errors, json } from '@/lib/api/core';
import { getPrincipal, requirePrincipal } from '@/lib/api/auth';
import { z } from 'zod';

const querySchema = z.object({ teamId: z.string() });

/** GET /api/v1/subscription?teamId= — current subscription for a team. */
export async function GET(request: Request) {
  return handle(request, async () => {
    const principal = requirePrincipal(await getPrincipal(request));
    const { teamId } = parseQuery(request, querySchema);

    const membership = await prisma.membership.findUnique({
      where: { teamId_userId: { teamId, userId: principal.user.id } },
    });
    if (!membership) throw errors.notFound('Team not found.');

    const subscription = await prisma.subscription.findUnique({ where: { teamId } });
    return json(subscription ?? { plan: 'FREE', status: 'ACTIVE', seats: 1 }, { request, cacheSeconds: 10 });
  }, { routeName: 'v1.subscription' });
}
