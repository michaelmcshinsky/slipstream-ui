export const dynamic = 'force-dynamic';

import { randomBytes } from 'node:crypto';
import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { hashToken } from '@/lib/tokens';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/http';

export async function GET() {
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const keys = await prisma.apiKey.findMany({
      where: { userId: user.id, revokedAt: null },
      select: { id: true, name: true, prefix: true, lastUsedAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return { keys };
  });
}

/** Creates a key; the plaintext value is shown exactly once. */
export async function POST(request: Request) {
  return handle(async () => {
    const user = requireUser(await getSessionUser());
    const body = await readJson<{ name?: string }>(request);
    if (!body.name?.trim()) badRequest('A key name is required.');

    const secret = randomBytes(24).toString('base64url');
    const prefix = `slip_${randomBytes(4).toString('hex')}`;
    const fullKey = `${prefix}.${secret}`;
    const created = await prisma.apiKey.create({
      data: { userId: user.id, name: body.name.trim(), prefix, keyHash: hashToken(fullKey) },
    });
    await audit({ actorId: user.id, action: 'apikey.created', targetType: 'apikey', targetId: created.id });
    return { id: created.id, name: created.name, key: fullKey };
  });
}
