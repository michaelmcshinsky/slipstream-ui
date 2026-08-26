export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle } from '@/lib/api/handle';

export async function GET(request: Request) {
  return handle(request, async () => {
    requireAdmin(await getSessionUser());
    const payments = await prisma.payment.findMany({
      include: { team: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return { payments };
  });
}
