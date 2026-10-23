export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { deactivateMachine } from '@/lib/licenses';
import { handle } from '@/lib/api/handle';

type Params = { params: Promise<{ licenseId: string; machineId: string }> };

/**
 * DELETE /api/licenses/[licenseId]/activations/[machineId]
 * Owner removes one of their license's machine activations, freeing the slot
 * (KC-021). Idempotent: unknown machines succeed as no-ops.
 */
export async function DELETE(request: Request, { params }: Params) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const { licenseId, machineId } = await params;
    const license = await prisma.licenseKey.findUnique({ where: { id: licenseId } });
    if (!license || license.ownerId !== user.id) {
      return Response.json({ error: 'License not found.' }, { status: 404 });
    }
    const deactivated = await deactivateMachine(licenseId, machineId, user.id);
    return { ok: true, deactivated };
  });
}
