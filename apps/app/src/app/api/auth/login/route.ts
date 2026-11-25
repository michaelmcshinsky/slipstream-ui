export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { verifyPassword } from '@/lib/passwords';
import { createSession } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody, errors } from '@/lib/api/core';
import { loginThrottleRemaining, recordLoginFailure, resetLoginFailures } from '@/lib/login-throttle';

export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await parseBody(request, z.object({ email: z.string().optional(), password: z.string().optional() }));
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? '';
    if (!email || !password) badRequest('Email and password are required.');

    // Per-account ceiling independent of IP: rotating addresses does not
    // reset the failure count for this email.
    const throttledFor = loginThrottleRemaining(email);
    if (throttledFor !== null) throw errors.rateLimited(throttledFor);

    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user?.passwordHash ? verifyPassword(password, user.passwordHash) : false;
    if (!user || !valid) {
      // Uniform response prevents account enumeration; the failure still
      // counts toward the per-account throttle.
      recordLoginFailure(email);
      badRequest('Invalid email or password.');
    }
    resetLoginFailures(email);
    if (user.suspendedAt) badRequest('This account has been suspended.');

    await createSession(user.id);
    await audit({ actorId: user.id, action: 'user.login', targetType: 'user', targetId: user.id });
    return { user: { id: user.id, email: user.email, role: user.role } };
  }, { routeName: 'auth.login', rateLimit: { limit: 30, windowMs: 60_000 } });
}
