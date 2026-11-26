export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { previewInvite } from '@/lib/teams';
import { handle } from '@/lib/api/handle';

const previewSchema = z.object({ token: z.string().min(1).max(255) });

/** GET /api/invites/preview?token= — invite details for the accept page. */
export async function GET(request: Request) {
  return handle(request, async () => {
    const parsed = previewSchema.safeParse({
      token: new URL(request.url).searchParams.get('token'),
    });
    if (!parsed.success) return { invite: null };
    return { invite: await previewInvite(parsed.data.token) };
  }, { routeName: 'invites.preview.get' });
}
