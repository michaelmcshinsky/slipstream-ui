export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/api/handle';

type Params = { params: Promise<{ userId: string }> };

export async function GET(request: Request, { params }: Params) {
  return handle(request, async () => {
    const admin = requireAdmin(await getSessionUser());
    void admin;
    const { userId } = await params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: { include: { team: true } },
        licenseKeys: true,
        subscriptions: false,
      },
    });
    if (!user) badRequest('User not found.');
    const { passwordHash: _hash, ...safe } = user;
    void _hash;
    return { user: safe };
  });
}

/** Update role / suspension. Self-demotion and self-suspension are blocked. */
export async function PATCH(request: Request, { params }: Params) {
  return handle(request, async () => {
    const admin = requireAdmin(await getSessionUser());
    const { userId } = await params;
    if (userId === admin.id) badRequest('Use account settings to change your own account.');
    const body = await readJson<{ role?: string; suspended?: boolean; name?: string }>(request);
    if (body.role && !['USER', 'ADMIN'].includes(body.role)) badRequest('Invalid role.');

    const data: Record<string, unknown> = {};
    if (body.role) data.role = body.role;
    if (typeof body.suspended === 'boolean') data.suspendedAt = body.suspended ? new Date() : null;
    if (body.name !== undefined) data.name = body.name;

    const user = await prisma.user.update({ where: { id: userId }, data });
    // Suspension kills active sessions immediately.
    if (body.suspended === true) {
      await prisma.session.deleteMany({ where: { userId } });
    }
    await audit({
      actorId: admin.id,
      action: body.suspended === true ? 'admin.user.suspend' : 'admin.user.updated',
      targetType: 'user',
      targetId: userId,
      metadata: { role: data.role ?? undefined, suspended: body.suspended },
    });
    return { user: { id: user.id, email: user.email, role: user.role, suspendedAt: user.suspendedAt } };
  });
}
