export const dynamic = 'force-dynamic';

import { getSessionUser, requireUser } from '@/lib/session';
import { acceptInvite } from '@/lib/teams';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/http';

export async function POST(request: Request) {
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const body = await readJson<{ token?: string }>(request);
    if (!body.token) badRequest('Invite token is required.');
    const result = await acceptInvite(body.token, user.id);
    await audit({ actorId: user.id, action: 'team.invite.accepted', targetType: 'team', targetId: result.teamId });
    return result;
  });
}
