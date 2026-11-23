/**
 * Newsletter preferences API
 * GET: Get current user's newsletter preferences
 * PATCH: Update newsletter preferences
 */

import { handle, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';
import { getSessionUser, requireUser } from '@/lib/session';
import {
  getNewsletterPreferences,
  updateNewsletterPreferences,
  getAvailableContentTypes,
  getAvailableFrequencies,
} from '@slipstream-ui/newsletter';

const updateSchema = z.object({
  dailyEnabled: z.boolean().optional(),
  weeklyEnabled: z.boolean().optional(),
  contentTypes: z.array(z.enum(['audit_log', 'release', 'github', 'custom'])).optional(),
  frequency: z.enum(['daily', 'weekly', 'both']).optional(),
  timezone: z.string().min(1).max(100).optional(),
});

export async function GET(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const [preferences, contentTypes, frequencies] = await Promise.all([
      getNewsletterPreferences(user.id),
      Promise.resolve(getAvailableContentTypes()),
      Promise.resolve(getAvailableFrequencies()),
    ]);
    return { preferences, contentTypes, frequencies };
  }, { routeName: 'newsletter.preferences.get' });
}

export async function PATCH(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await parseBody(request, updateSchema);
    const preferences = await updateNewsletterPreferences(user.id, body);
    return { preferences };
  }, { routeName: 'newsletter.preferences.patch' });
}
