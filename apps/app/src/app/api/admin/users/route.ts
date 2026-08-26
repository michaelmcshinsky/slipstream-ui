export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle } from '@/lib/api/handle';

/** Search + list users for the admin table. */
export async function GET(request: Request) {
  return handle(request, async () => {
    requireAdmin(await getSessionUser());
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.trim();
    const take = Math.min(Number(url.searchParams.get('take') ?? 50), 100);

    const users = await prisma.user.findMany({
      where: q
        ? {
            OR: [
              { email: { contains: q } },
              { name: { contains: q } },
            ],
          }
        : undefined,
      select: {
        id: true, email: true, name: true, role: true,
        suspendedAt: true, createdAt: true,
        _count: { select: { memberships: true, licenseKeys: true } },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
    return { users };
  });
}
