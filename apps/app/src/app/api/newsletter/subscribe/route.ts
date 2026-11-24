/**
 * Newsletter subscribe API
 * POST: Subscribe current user to a newsletter frequency
 */

import { handle, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';
import { getSessionUser, requireUser } from '@/lib/session';
import { subscribeToNewsletter } from '@slipstream-ui/newsletter';

const subscribeSchema = z.object({
  type: z.enum(['daily', 'weekly']),
});

export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await parseBody(request, subscribeSchema);
    await subscribeToNewsletter(user.id, body.type);
    return { success: true, type: body.type };
  }, { routeName: 'newsletter.subscribe' });
}
