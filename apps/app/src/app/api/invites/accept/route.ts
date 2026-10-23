export const dynamic = 'force-dynamic';

import { getSessionUser, requireUser } from '@/lib/session';
import { acceptInvite } from '@/lib/teams';
import { audit } from '@/lib/audit';
import { handle, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

const acceptInviteSchema = z.object({ token: z.string().refine((token) => token.trim().length > 0, 'Invite token is required.') });

export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await parseBody(request, acceptInviteSchema);
    const result = await acceptInvite(body.token, user.id);
    await audit({ actorId: user.id, action: 'team.invite.accepted', targetType: 'team', targetId: result.teamId });
    return result;
  });
}
