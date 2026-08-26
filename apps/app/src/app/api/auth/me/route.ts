export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { handle, readJson } from '@/lib/api/handle';

export async function GET(request: Request) {
  return handle(request, async () => {
    const user = await getSessionUser();
    if (!user) return { user: null, teams: [], activeRole: null };
    const memberships = await prisma.membership.findMany({
      where: { userId: user.id },
      include: { team: true },
    });
    return { user, teams: memberships.map((m) => ({ id: m.team.id, name: m.team.name, slug: m.team.slug, role: m.role })) };
  });
}

/** Update own profile (display name). */
export async function PATCH(request: Request) {
  return handle(request, async () => {
    const current = requireUser(await getSessionUser());
    const body = await readJson<{ name?: string }>(request);
    const user = await prisma.user.update({
      where: { id: current.id },
      data: { name: body.name?.trim() || null },
      select: { id: true, email: true, name: true },
    });
    return { user };
  });
}
