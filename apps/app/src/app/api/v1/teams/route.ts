import { prisma } from '@slipstream-ui/db';
import { handle, parseQuery, paginationSchema, paginate, decodeCursor, json } from '@/lib/api/core';
import { getPrincipal, requirePrincipal } from '@/lib/api/auth';
import { parseBody } from '@/lib/api/core';
import { z } from 'zod';

const querySchema = paginationSchema(20);

/** GET /api/v1/teams — cursor-paginated list of the caller's teams. */
export async function GET(request: Request) {
  return handle(request, async () => {
    const principal = requirePrincipal(await getPrincipal(request));
    const query = parseQuery(request, querySchema);
    const cursorId = decodeCursor(query.cursor);

    const rows = await prisma.membership.findMany({
      where: { userId: principal.user.id },
      include: { team: { include: { subscription: true } } },
      orderBy: { id: 'asc' },
      ...(cursorId ? { cursor: { id: cursorId } } : {}),
      take: query.limit + 1,
    });

    const mapped = rows.map((m) => ({
      id: m.team.id,
      name: m.team.name,
      slug: m.team.slug,
      role: m.role,
      plan: m.team.subscription?.plan ?? 'FREE',
    }));
    const { items, meta } = paginate(mapped, query.limit);
    return json(items, { request, meta });
  }, { routeName: 'v1.teams' });
}

const createSchema = z.object({ name: z.string().min(1).max(60) });

/** POST /api/v1/teams — create a team (session or key auth). */
export async function POST(request: Request) {
  return handle(request, async () => {
    const principal = requirePrincipal(await getPrincipal(request));
    const body = await parseBody(request, createSchema);
    // Reuse the internal creation logic to keep one implementation.
    const { createTeamForUser } = await import('@/lib/teams');
    const team = await createTeamForUser(principal.user.id, body.name);
    return json(team, { request, status: 201 });
  }, { routeName: 'v1.teams.create' });
}
