export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { requireMembership } from '@/lib/teams';
import { audit } from '@/lib/audit';
import { handle, readJson } from '@/lib/api/handle';

type Params = { params: Promise<{ teamId: string }> };

export async function GET(request: Request, { params }: Params) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const { teamId } = await params;
    await requireMembership(user.id, teamId);
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        memberships: { include: { user: { select: { id: true, email: true, name: true } } } },
        invites: { where: { acceptedAt: null, expiresAt: { gt: new Date() } } },
        subscription: true,
      },
    });
    if (!team) return { error: 'Team not found.' };
    return { team };
  });
}

export async function PATCH(request: Request, { params }: Params) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const { teamId } = await params;
    await requireMembership(user.id, teamId, 'ADMIN');
    const body = await readJson<{ name?: string }>(request);
    const team = await prisma.team.update({ where: { id: teamId }, data: { name: body.name } });
    await audit({ actorId: user.id, action: 'team.renamed', targetType: 'team', targetId: teamId, metadata: { name: body.name } });
    return { team: { id: team.id, name: team.name } };
  });
}
