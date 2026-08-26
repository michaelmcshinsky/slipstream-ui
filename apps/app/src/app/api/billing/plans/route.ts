export const dynamic = 'force-dynamic';

import { PLANS } from '@/lib/plans';
import { handle } from '@/lib/http';

export async function GET() {
  return handle(async () => ({ plans: PLANS }));
}
