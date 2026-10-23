export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { inviteMember, requireMembership } from '@/lib/teams';
import { deliverEmail, buildInviteEmail } from '@/lib/email';
import { hashToken } from '@/lib/tokens';
import { handle, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

const createInviteSchema = z.object({ email: z.string().min(1, 'Email is required.'), role: z.string().nullish() });

type Params = { params: Promise<{ teamId: string }> };

export async function POST(request: Request, { params }: Params) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const { teamId } = await params;
    await requireMembership(user.id, teamId, 'ADMIN');
    const body = await parseBody(request, createInviteSchema);
    const result = await inviteMember({
      teamId,
      email: body.email,
      role: body.role ?? 'MEMBER',
      invitedById: user.id,
    });

    const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
    const inviteUrl = `${appUrl}/api/invites/accept?token=${encodeURIComponent(result.token)}`;
    // Deliver the invitation email; the URL is also returned for dev/tests (KC-039).
    const inviter = await prisma.user.findUnique({ where: { id: user.id }, select: { email: true, name: true } });
    await deliverEmail({
      ...buildInviteEmail({
        to: body.email.trim().toLowerCase(),
        inviterLabel: inviter?.name ?? inviter?.email ?? 'A team admin',
        inviteUrl,
      }),
      tokenHash: hashToken(result.token),
    });

    return { inviteId: result.inviteId, inviteUrl: `/api/invites/accept?token=${result.token}` };
  });
}
