export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { hashPassword, assertStrongPassword } from '@/lib/passwords';
import { createSession } from '@/lib/session';
import { createTeamForUser } from '@/lib/teams';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/api/handle';

export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await readJson<{ email?: string; name?: string; password?: string }>(request);
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) badRequest('A valid email is required.');
    if (!body.password) badRequest('Password is required.');
    assertStrongPassword(body.password);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) badRequest('An account with that email already exists.');

    const user = await prisma.user.create({
      data: {
        email,
        name: body.name?.trim() || null,
        passwordHash: hashPassword(body.password),
      },
    });

    // Every buyer gets a personal team so billing/licenses have an owner scope.
    const team = await createTeamForUser(user.id, body.name ? `${body.name.split(' ')[0]}'s team` : 'Personal team');
    await createSession(user.id);
    await audit({ actorId: user.id, action: 'user.signup', targetType: 'user', targetId: user.id });
    return { user: { id: user.id, email: user.email }, teamId: team.id };
  });
}
