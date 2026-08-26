export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { issueLicense } from '@/lib/licenses';
import { requireMembership } from '@/lib/teams';
import { handle, readJson, badRequest } from '@/lib/http';

export async function GET() {
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const licenses = await prisma.licenseKey.findMany({
      where: { ownerId: user.id },
      include: { activations: true },
      orderBy: { createdAt: 'desc' },
    });
    return { licenses };
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const body = await readJson<{ teamId?: string; plan?: string; note?: string }>(request);
    const plan = body.plan ?? 'PRO';
    if (!['PRO', 'TEAM', 'ENTERPRISE'].includes(plan)) badRequest('Invalid plan.');
    if (body.teamId) await requireMembership(user.id, body.teamId, 'ADMIN');
    return issueLicense({ ownerId: user.id, teamId: body.teamId, plan, note: body.note });
  });
}
