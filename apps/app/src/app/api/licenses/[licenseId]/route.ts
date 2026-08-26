export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { revokeLicense } from '@/lib/licenses';
import { handle } from '@/lib/http';

type Params = { params: Promise<{ licenseId: string }> };

/** Owner revokes their own key; admins use the admin API. */
export async function DELETE(_request: Request, { params }: Params) {
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const { licenseId } = await params;
    const license = await prisma.licenseKey.findUnique({ where: { id: licenseId } });
    if (!license || license.ownerId !== user.id) {
      return Response.json({ error: 'License not found.' }, { status: 404 });
    }
    await revokeLicense(licenseId, user.id);
    return { ok: true };
  });
}
