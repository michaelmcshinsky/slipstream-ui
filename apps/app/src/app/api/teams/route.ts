export const dynamic = 'force-dynamic';

import { getSessionUser, requireUser } from '@/lib/session';
import { createTeamForUser } from '@/lib/teams';
import { prisma } from '@slipstream-ui/db';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

export async function GET(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const memberships = await prisma.membership.findMany({
      where: { userId: user.id },
      include: { team: true },
    });
    return {
      teams: memberships.map((m) => ({
        id: m.team.id,
        name: m.team.name,
        slug: m.team.slug,
        role: m.role,
      })),
    };
  });
}

export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await parseBody(request, z.object({ name: z.string().optional() }));
    if (!body.name?.trim()) badRequest('Team name is required.');
    const team = await createTeamForUser(user.id, body.name.trim());
    return { team: { id: team.id, name: team.name, slug: team.slug } };
  });
}
