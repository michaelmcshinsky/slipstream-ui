export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { requireMembership } from '@/lib/teams';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/api/handle';
import { errors } from '@/lib/api/core';

type Params = { params: Promise<{ teamId: string; memberId: string }> };

async function countOwners(teamId: string): Promise<number> {
  return prisma.membership.count({ where: { teamId, role: 'OWNER' } });
}

/** Change a member's role. Requires ADMIN; owner rows need an OWNER actor, and the last owner is immutable. */
export async function PATCH(request: Request, { params }: Params) {
  return handle(request, async () => {
    const actor = requireUser(await getSessionUser());
    const { teamId, memberId } = await params;
    const actorMembership = await requireMembership(actor.id, teamId, 'ADMIN');
    const body = await readJson<{ role?: string }>(request);
    if (!['OWNER', 'ADMIN', 'MEMBER'].includes(body.role ?? '')) badRequest('Invalid role.');

    const target = await prisma.membership.findUnique({ where: { id: memberId } });
    if (!target || target.teamId !== teamId) badRequest('Member not found in this team.');

    // Only owners grant or remove the OWNER role, and only owners act on
    // existing owner rows — an admin must never be able to demote one.
    if ((body.role === 'OWNER' || target.role === 'OWNER') && actorMembership.role !== 'OWNER') {
      throw errors.forbidden('Only an owner can change owner roles.');
    }
    // The team must always keep at least one owner.
    if (target.role === 'OWNER' && body.role !== 'OWNER' && (await countOwners(teamId)) <= 1) {
      badRequest('A team must keep at least one owner.');
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

/** Remove a member. ADMINs remove MEMBERs only; OWNERs remove anyone but themselves, and the last owner cannot be removed. */
export async function DELETE(request: Request, { params }: Params) {
  return handle(request, async () => {
    const actor = requireUser(await getSessionUser());
    const { teamId, memberId } = await params;
    const actorMembership = await requireMembership(actor.id, teamId, 'ADMIN');

    const target = await prisma.membership.findUnique({ where: { id: memberId } });
    if (!target || target.teamId !== teamId) badRequest('Member not found in this team.');
    if (target.userId === actor.id) badRequest('Use leave-team instead of removing yourself.');
    if (target.role === 'OWNER') {
      if (actorMembership.role !== 'OWNER') throw errors.forbidden('Only an owner can remove an owner.');
      if ((await countOwners(teamId)) <= 1) badRequest('A team must keep at least one owner.');
    } else if (target.role === 'ADMIN' && actorMembership.role !== 'OWNER') {
      throw errors.forbidden('Only an owner can remove an admin.');
    }

    await prisma.membership.delete({ where: { id: memberId } });
    await audit({ actorId: actor.id, action: 'team.member.removed', targetType: 'membership', targetId: memberId });
    return { ok: true };
  });
}
