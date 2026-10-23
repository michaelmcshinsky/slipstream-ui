export const dynamic = 'force-dynamic';

import { prisma, Prisma } from '@slipstream-ui/db';
import { hashPassword, assertStrongPassword } from '@/lib/passwords';
import { createSession } from '@/lib/session';
import { createTeamForUser } from '@/lib/teams';
import { sendVerificationEmail } from '@/lib/verify';
import { audit } from '@/lib/audit';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await parseBody(
      request,
      z.object({ email: z.string().optional(), name: z.string().max(100).optional(), password: z.string().optional() }),
    );
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) badRequest('A valid email is required.');
    if (!body.password) badRequest('Password is required.');
    assertStrongPassword(body.password);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) badRequest('An account with that email already exists.');

    // User + personal team + owner membership commit atomically: a failed
    // team creation must not leave an account without its owner scope (KC-010).
    const passwordHash = hashPassword(body.password);
    const { user, team } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name: body.name?.trim() || null,
          passwordHash,
        },
      });
      // Every buyer gets a personal team so billing/licenses have an owner scope.
      const team = await createTeamForUser(user.id, body.name ? `${body.name.split(' ')[0]}'s team` : 'Personal team', tx);
      return { user, team };
    }).catch((error: unknown) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        badRequest('An account with that email already exists.');
      }
      throw error;
    });

    await createSession(user.id);
    // Email verification lifecycle (KC-040): new accounts start unverified
    // and receive a signed confirmation link. A delivery outage must not
    // block signup — the resend endpoint retries later.
    let devVerifyToken: string | undefined;
    try {
      const { token } = await sendVerificationEmail(user);
      if (process.env.NODE_ENV !== 'production') devVerifyToken = token;
    } catch (error) {
      console.error('[auth] verification email failed', user.id, error instanceof Error ? error.message : error);
    }
    await audit({ actorId: user.id, action: 'user.signup', targetType: 'user', targetId: user.id });
    return { user: { id: user.id, email: user.email }, teamId: team.id, verifyToken: devVerifyToken };
  });
}
