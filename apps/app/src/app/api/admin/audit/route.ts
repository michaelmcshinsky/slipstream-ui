export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle } from '@/lib/http';

export async function GET(request: Request) {
  return handle(async () => {
    requireAdmin(await getSessionUser());
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const logs = await prisma.auditLog.findMany({
      where: action ? { action: { contains: action } } : undefined,
      include: { actor: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { logs };
  });
}
