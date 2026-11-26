export const dynamic = 'force-dynamic';

import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle } from '@/lib/api/handle';
import { computeBusinessMetrics } from '@/lib/metrics';

/** Business metrics for the super-admin overview. */
export async function GET(request: Request) {
  return handle(request, async () => {
    requireAdmin(await getSessionUser());
    return computeBusinessMetrics();
  });
}
