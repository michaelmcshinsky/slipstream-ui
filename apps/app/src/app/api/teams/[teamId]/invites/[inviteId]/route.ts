export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { requireMembership } from '@/lib/teams';
import { audit } from '@/lib/audit';
import { handle } from '@/lib/api/handle';
import { errors } from '@/lib/api/core';

type Params = { params: Promise<{ teamId: string; inviteId: string }> };

/** DELETE /api/teams/:teamId/invites/:inviteId — revoke a pending invite. */
export async function DELETE(request: Request, { params }: Params) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const { teamId, inviteId } = await params;
    await requireMembership(user.id, teamId, 'ADMIN');
    const invite = await prisma.teamInvite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.teamId !== teamId) throw errors.notFound('Invite not found.');
    if (invite.acceptedAt) throw errors.conflict('Invite was already accepted.');
    await prisma.teamInvite.delete({ where: { id: invite.id } });
    await audit({
      actorId: user.id,
      action: 'team.invite.revoked',
      targetType: 'team_invite',
      targetId: invite.id,
      metadata: { teamId, email: invite.email },
    });
    return { revoked: true };
  });
}
