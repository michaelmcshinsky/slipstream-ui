export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle } from '@/lib/api/handle';

export async function GET(request: Request) {
  return handle(request, async () => {
    requireAdmin(await getSessionUser());
    const subscriptions = await prisma.subscription.findMany({
      include: { team: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(new URL(request.url).searchParams.get('take') ?? 200), 500),
    });
    return { subscriptions };
  });
}
