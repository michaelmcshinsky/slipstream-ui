export const dynamic = 'force-dynamic';

import { getSessionUser, requireUser } from '@/lib/session';
import { inviteMember, requireMembership } from '@/lib/teams';
import { handle, readJson, badRequest } from '@/lib/http';

type Params = { params: Promise<{ teamId: string }> };

export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const { teamId } = await params;
    await requireMembership(user.id, teamId, 'ADMIN');
    const body = await readJson<{ email?: string; role?: string }>(request);
    if (!body.email) badRequest('Email is required.');
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
