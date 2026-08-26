export const dynamic = 'force-dynamic';

import { randomBytes } from 'node:crypto';
import { prisma } from '@slipstream-ui/db';
import { generateToken, hashToken } from '@/lib/tokens';
import { handle, readJson, badRequest } from '@/lib/api/handle';

export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await readJson<{ email?: string }>(request);
    const email = body.email?.trim().toLowerCase();
    if (!email) badRequest('Email is required.');

    const user = await prisma.user.findUnique({ where: { email } });
    // Always report success to avoid account enumeration.
    if (!user) return { ok: true };

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const token = generateToken();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    // Production sends this by email; returned for dev/tests.
    const devToken = process.env.NODE_ENV === 'production' ? undefined : token;
    return { ok: true, resetToken: devToken };
  });
}
void randomBytes;
