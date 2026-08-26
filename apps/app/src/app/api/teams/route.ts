export const dynamic = 'force-dynamic';

import { getSessionUser, requireUser } from '@/lib/session';
import { createTeamForUser } from '@/lib/teams';
import { prisma } from '@slipstream-ui/db';
import { handle, readJson, badRequest } from '@/lib/http';

export async function GET() {
  return handle(async () => {
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
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const body = await readJson<{ name?: string }>(request);
    if (!body.name?.trim()) badRequest('Team name is required.');
    const team = await createTeamForUser(user.id, body.name.trim());
    return { team: { id: team.id, name: team.name, slug: team.slug } };
  });
}
