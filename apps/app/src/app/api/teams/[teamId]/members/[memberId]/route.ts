export const dynamic = 'force-dynamic';

import { prisma, Prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { requireMembership } from '@/lib/teams';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/api/handle';
import { errors } from '@/lib/api/core';

type Params = { params: Promise<{ teamId: string; memberId: string }> };

async function memberTransaction<T>(operation: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  try {
    return await prisma.$transaction(operation);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2034', 'P1008', 'P2028'].includes(error.code)) {
      throw errors.conflict('Team membership changed concurrently. Retry the request.');
    }
    throw error;
  }
}

export async function PATCH(request: Request, { params }: Params) {
  return handle(request, async () => {
    const initiatingActor = requireUser(await getSessionUser());
    const { teamId, memberId } = await params;
    await requireMembership(initiatingActor.id, teamId, 'ADMIN');
    const body = await readJson<{ role?: string }>(request);
    if (!['OWNER', 'ADMIN', 'MEMBER'].includes(body.role ?? '')) badRequest('Invalid role.');

    return memberTransaction(async (tx) => {
      const actor = requireUser(await getSessionUser(tx));
      if (actor.id !== initiatingActor.id) throw errors.unauthorized();
      const actorMembership = await requireMembership(actor.id, teamId, 'ADMIN', tx);
      const target = await tx.membership.findUnique({ where: { id: memberId } });
      if (!target || target.teamId !== teamId) badRequest('Member not found in this team.');

      if ((body.role === 'OWNER' || target.role === 'OWNER') && actorMembership.role !== 'OWNER') {
        throw errors.forbidden('Only an owner can change owner roles.');
      }
      if (target.role === 'OWNER' && body.role !== 'OWNER') {
        const owners = await tx.membership.count({ where: { teamId, role: 'OWNER' } });
        if (owners <= 1) badRequest('A team must keep at least one owner.');
      }

      const updated = await tx.membership.update({
        where: { id: memberId },
        data: { role: body.role },
      });
      await audit({
        actorId: actor.id,
        action: 'team.member.role_changed',
        targetType: 'membership',
        targetId: memberId,
        metadata: { role: body.role },
      }, tx);
      return { membership: updated };
    });
  });
}

export async function DELETE(request: Request, { params }: Params) {
  return handle(request, async () => {
    const initiatingActor = requireUser(await getSessionUser());
    const { teamId, memberId } = await params;

    return memberTransaction(async (tx) => {
      const actor = requireUser(await getSessionUser(tx));
      if (actor.id !== initiatingActor.id) throw errors.unauthorized();
      const actorMembership = await requireMembership(actor.id, teamId, 'ADMIN', tx);
      const target = await tx.membership.findUnique({ where: { id: memberId } });
      if (!target || target.teamId !== teamId) badRequest('Member not found in this team.');
      if (target.userId === actor.id) badRequest('Use leave-team instead of removing yourself.');
      if (target.role === 'OWNER') {
        if (actorMembership.role !== 'OWNER') throw errors.forbidden('Only an owner can remove an owner.');
        const owners = await tx.membership.count({ where: { teamId, role: 'OWNER' } });
        if (owners <= 1) badRequest('A team must keep at least one owner.');
      } else if (target.role === 'ADMIN' && actorMembership.role !== 'OWNER') {
        throw errors.forbidden('Only an owner can remove an admin.');
      }

      await tx.membership.delete({ where: { id: memberId } });
      await audit({ actorId: actor.id, action: 'team.member.removed', targetType: 'membership', targetId: memberId }, tx);
      return { ok: true };
    });
  });
}
