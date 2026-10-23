export const dynamic = 'force-dynamic';

import { getSessionUser, requireAdmin } from '@/lib/session';
import { retryFailedDeliveries } from '@/lib/email';
import { handle, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

/**
 * POST /api/admin/email/deliveries/retry — operator-triggered sweep of FAILED
 * email deliveries (KC-039). Cron/workers can call the same helper directly.
 */
export async function POST(request: Request) {
  return handle(request, async () => {
    requireAdmin(await getSessionUser());
    const body = await parseBody(
      request,
      z.object({
        toEmail: z.string().email().optional(),
        kind: z.enum(['password_reset', 'invite', 'email_verify']).optional(),
      }),
    );
    const resent = await retryFailedDeliveries(body);
    return { resent };
  });
}
