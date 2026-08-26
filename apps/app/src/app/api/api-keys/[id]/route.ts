export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle } from '@/lib/http';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const { id } = await params;
    // Scoped by userId so ownership is enforced in the query itself.
    const updated = await prisma.apiKey.updateMany({
      where: { id, userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (updated.count > 0) {
      await audit({ actorId: user.id, action: 'apikey.revoked', targetType: 'apikey', targetId: id });
    }
    return { ok: updated.count > 0 };
  });
}
