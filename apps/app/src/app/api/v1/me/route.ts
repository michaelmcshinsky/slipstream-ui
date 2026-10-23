import { prisma } from '@slipstream-ui/db';
import { handle } from '@/lib/api/handle';
import { getPrincipal, requirePrincipal } from '@/lib/api/auth';

/** GET /api/v1/me — the authenticated principal and its teams. */
export async function GET(request: Request) {
  return handle(request, async () => {
    const principal = requirePrincipal(await getPrincipal(request));
    const memberships = await prisma.membership.findMany({
      where: { userId: principal.user.id },
      include: { team: true },
    });
    return {
      user: principal.user,
      authKind: principal.kind,
      teams: memberships.map((m) => ({ id: m.team.id, name: m.team.name, slug: m.team.slug, role: m.role })),
    };
  }, { routeName: 'v1.me', rateLimit: { limit: 60, windowMs: 60_000 } });
}
