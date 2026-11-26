export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSessionUser, requireUser, SESSION_COOKIE } from '@/lib/session';
import { deleteAccount } from '@/lib/account';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

const deleteSchema = z.object({
  confirmEmail: z.string().email(),
  password: z.string().optional(),
});

/**
 * Account deletion (GDPR/CCPA erasure). Requires the account email and,
 * when the account has a password, the current password. Admins cannot
 * self-delete; shared teams require an admin successor or member removal
 * first — see lib/account.ts for the full policy.
 */
export async function DELETE(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());

    // Deleting while impersonating would erase the target's account under
    // the admin's session — refuse outright.
    const store = await cookies();
    if (store.get('slipstream_impersonator')) {
      badRequest('Stop impersonating before deleting an account.');
    }

    const body = await parseBody(request, deleteSchema);
    await deleteAccount(user, body);

    store.delete(SESSION_COOKIE);
    store.delete('slipstream_impersonator');
    return { ok: true };
  });
}
