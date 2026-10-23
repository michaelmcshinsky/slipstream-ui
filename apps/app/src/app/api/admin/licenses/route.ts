export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { issueLicense, revokeLicense } from '@/lib/licenses';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

export async function GET(request: Request) {
  return handle(request, async () => {
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
  return handle(request, async () => {
    const admin = requireAdmin(await getSessionUser());
    const body = await parseBody(request, z.object({ licenseId: z.string().min(1).optional() }));
    if (!body.licenseId) badRequest('licenseId is required.');
    await revokeLicense(body.licenseId, admin.id);
    return { ok: true };
  });
}

/** Admin-issued comp licenses (sponsorships, enterprise trials). */
export async function POST(request: Request) {
  return handle(request, async () => {
    const admin = requireAdmin(await getSessionUser());
    const body = await parseBody(
      request,
      z.object({
        userId: z.string().min(1).optional(),
        plan: z.string().min(1).optional(),
        maxActivations: z.number().int().positive().max(1000).optional(),
        note: z.string().max(500).optional(),
      }),
    );
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
