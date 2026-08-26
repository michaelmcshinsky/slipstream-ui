export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { requireMembership } from '@/lib/teams';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/http';

type Params = { params: Promise<{ teamId: string; memberId: string }> };

/** Change a member's role. Requires ADMIN; only OWNER can set OWNER. */
export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    const actor = requireUser(await getSessionUser());
    const { teamId, memberId } = await params;
    await requireMembership(actor.id, teamId, 'ADMIN');
    const body = await readJson<{ role?: string }>(request);
    if (!['OWNER', 'ADMIN', 'MEMBER'].includes(body.role ?? '')) badRequest('Invalid role.');

    const target = await prisma.membership.findUnique({ where: { id: memberId } });
    if (!target || target.teamId !== teamId) badRequest('Member not found in this team.');
    if (body.role === 'OWNER') {
      const me = await requireMembership(actor.id, teamId, 'OWNER');
      void me;
    }

    const updated = await prisma.membership.update({
      where: { id: memberId },
      data: { role: body.role },
    });
    await audit({
      actorId: actor.id,
      action: 'team.member.role_changed',
      targetType: 'membership',
      targetId: memberId,
      metadata: { role: body.role },
    });
    return { membership: updated };
  });
}

/** Remove a member. ADMINs can remove MEMBERs; OWNERs can remove anyone but themselves. */
export async function DELETE(_request: Request, { params }: Params) {
  return handle(async () => {
    const actor = requireUser(await getSessionUser());
    const { teamId, memberId } = await params;
    const actorMembership = await requireMembership(actor.id, teamId, 'ADMIN');

    const target = await prisma.membership.findUnique({ where: { id: memberId } });
    if (!target || target.teamId !== teamId) badRequest('Member not found in this team.');
    if (target.userId === actor.id) badRequest('Use leave-team instead of removing yourself.');
    if (target.role === 'OWNER' && actorMembership.role !== 'OWNER') {
      badRequest('Only an owner can remove an owner.');
    }

    await prisma.membership.delete({ where: { id: memberId } });
    await audit({ actorId: actor.id, action: 'team.member.removed', targetType: 'membership', targetId: memberId });
    return { ok: true };
  });
}
