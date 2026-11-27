export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSessionUser, requireUser } from '@/lib/session';
import { exportAccountData } from '@/lib/account';
import { handle } from '@/lib/api/handle';

/** GDPR/CCPA data export: downloads a JSON copy of everything keyed to the user. */
export async function GET(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const data = await exportAccountData(user.id);
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="slipstream-data-export.json"`,
        'Cache-Control': 'no-store',
      },
    });
  });
}
