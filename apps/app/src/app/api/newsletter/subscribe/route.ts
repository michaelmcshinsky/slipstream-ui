/**
 * Newsletter subscribe API
 * POST: Subscribe current user to a newsletter frequency
 */

import { handle, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';
import { errors } from '@/lib/api/core';
import { getSessionUser, requireUser } from '@/lib/session';
import { prisma } from '@slipstream-ui/db';
import { subscribeToNewsletter } from '@slipstream-ui/newsletter';

const subscribeSchema = z.object({
  type: z.enum(['daily', 'weekly']),
});

export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await parseBody(request, subscribeSchema);
    // Only send marketing mail to verified addresses.
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { emailVerifiedAt: true },
    });
    if (!dbUser?.emailVerifiedAt) {
      throw errors.forbidden('Verify your email address before subscribing.');
    }
    await subscribeToNewsletter(user.id, body.type);
    return { success: true, type: body.type };
  }, { routeName: 'newsletter.subscribe' });
}
