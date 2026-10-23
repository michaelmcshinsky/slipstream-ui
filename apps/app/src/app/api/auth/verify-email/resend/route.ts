export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { sendVerificationEmail } from '@/lib/verify';
import { handle } from '@/lib/api/handle';

/**
 * POST /api/auth/verify-email/resend — a signed-in, unverified user requests
 * a fresh verification link (KC-040). Always reports ok for verified users
 * so the endpoint cannot be used to probe account state.
 */
export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const record = await prisma.user.findUnique({ where: { id: user.id }, select: { emailVerifiedAt: true } });
    if (!record?.emailVerifiedAt) {
      try {
        await sendVerificationEmail({ id: user.id, email: user.email });
      } catch (error) {
        console.error('[auth] verification resend failed', user.id, error instanceof Error ? error.message : error);
      }
    }
    return { ok: true };
  });
}
