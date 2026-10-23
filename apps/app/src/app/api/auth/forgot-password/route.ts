export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { generateToken, hashToken } from '@/lib/tokens';
import { deliverEmail, buildResetEmail } from '@/lib/email';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await parseBody(request, z.object({ email: z.string().optional() }));
    const email = body.email?.trim().toLowerCase();
    if (!email) badRequest('Email is required.');

    const user = await prisma.user.findUnique({ where: { email } });
    // Always report success to avoid account enumeration.
    if (!user) return { ok: true };

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const token = generateToken();
    const tokenHash = hashToken(token);
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    // Deliver through the configured transport; failures are recorded and
    // surface as a 500 so operators can retry (KC-039). The response never
    // reveals whether the account exists.
    const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
    await deliverEmail({
      ...buildResetEmail({
        to: email,
        resetUrl: `${appUrl}/reset?token=${encodeURIComponent(token)}`,
      }),
      token,
      tokenHash,
    });

    // Dev convenience only: in production the token travels exclusively by email.
    const devToken = process.env.NODE_ENV === 'production' ? undefined : token;
    return { ok: true, resetToken: devToken };
  });
}
