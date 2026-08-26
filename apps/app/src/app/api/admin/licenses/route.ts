export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { issueLicense, revokeLicense } from '@/lib/licenses';
import { handle, readJson, badRequest } from '@/lib/http';

export async function GET() {
  return handle(async () => {
    requireAdmin(await getSessionUser());
    const licenses = await prisma.licenseKey.findMany({
      include: { owner: { select: { email: true } }, activations: true },
      orderBy: { createdAt: 'desc' },
    });
    return { licenses };
  });
}

/** Revoke any license (admin override). */
export async function DELETE(request: Request) {
  return handle(async () => {
    const admin = requireAdmin(await getSessionUser());
    const body = await readJson<{ licenseId?: string }>(request);
    if (!body.licenseId) badRequest('licenseId is required.');
    await revokeLicense(body.licenseId, admin.id);
    return { ok: true };
  });
}

/** Admin-issued comp licenses (sponsorships, enterprise trials). */
export async function POST(request: Request) {
  return handle(async () => {
    const admin = requireAdmin(await getSessionUser());
    const body = await readJson<{ userId?: string; plan?: string; maxActivations?: number; note?: string }>(request);
    if (!body.userId || !body.plan) badRequest('userId and plan are required.');
    return issueLicense({
      ownerId: body.userId,
      plan: body.plan,
      maxActivations: body.maxActivations,
      note: body.note ?? `Comp license issued by ${admin.email}`,
      actorId: admin.id,
    });
  });
}
