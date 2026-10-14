export const dynamic = 'force-dynamic';

import { getSessionUser, requireUser } from '@/lib/session';
import { inviteMember, requireMembership } from '@/lib/teams';
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
    // The invite URL is what would be emailed.
    return { inviteId: result.inviteId, inviteUrl: `/api/invites/accept?token=${result.token}` };
  });
}
