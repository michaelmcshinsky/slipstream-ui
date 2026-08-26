export const dynamic = 'force-dynamic';

import { destroySession, getSessionUser } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle } from '@/lib/http';

export async function POST(request: Request) {
  return handle(async () => {
    const url = new URL(request.url);
    const allDevices = url.searchParams.get('all') === 'true';
    const user = await getSessionUser();
    await destroySession(allDevices);
    if (user) await audit({ actorId: user.id, action: 'user.logout' });
    return { ok: true };
  });
}
