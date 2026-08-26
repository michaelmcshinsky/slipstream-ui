export const dynamic = 'force-dynamic';

import { PLANS } from '@/lib/plans';
import { handle } from '@/lib/api/handle';

export async function GET(request: Request) {
  return handle(request, async () => ({ plans: PLANS }));
}
