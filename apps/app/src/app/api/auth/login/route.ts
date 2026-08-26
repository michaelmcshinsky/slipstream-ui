export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { verifyPassword } from '@/lib/passwords';
import { createSession } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/http';

export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson<{ email?: string; password?: string }>(request);
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? '';
    if (!email || !password) badRequest('Email and password are required.');

    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user?.passwordHash ? verifyPassword(password, user.passwordHash) : false;
    if (!user || !valid) {
      // Uniform response prevents account enumeration.
      badRequest('Invalid email or password.');
    }
    if (user.suspendedAt) badRequest('This account has been suspended.');

    await createSession(user.id);
    await audit({ actorId: user.id, action: 'user.login', targetType: 'user', targetId: user.id });
    return { user: { id: user.id, email: user.email, role: user.role } };
  });
}
