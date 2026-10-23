export const dynamic = 'force-dynamic';

import { verifyEmailToken } from '@/lib/verify';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

/**
 * POST /api/auth/verify-email { token } — explicit confirmation of the
 * emailed verification link (KC-040). Single-use tokens; invalid/expired
 * tokens return 400 without revealing account state.
 */
export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await parseBody(request, z.object({ token: z.string().optional() }));
    if (!body.token?.trim()) badRequest('Verification token is required.');
    const result = await verifyEmailToken(body.token.trim());
    if (!result.verified) badRequest(result.reason);
    return { ok: true, verified: true };
  });
}
