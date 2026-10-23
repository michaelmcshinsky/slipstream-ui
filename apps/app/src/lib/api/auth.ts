import { prisma } from '@slipstream-ui/db';
import { getSessionUser, type SafeUser } from '../session';
import { hashToken } from '../tokens';
import { errors } from './core';

export type Principal =
  | { kind: 'session'; user: SafeUser }
  | { kind: 'apikey'; user: SafeUser; apiKeyId: string };

/**
 * Resolve the caller from, in order:
 *   1. Authorization: Bearer <api-key> or X-API-Key header (external/API users)
 *   2. Session cookie (UI users)
 * Returns null when unauthenticated. Suspended users never authenticate.
 */
export async function getPrincipal(request: Request): Promise<Principal | null> {
  // API keys take precedence so tools always behave consistently even when a
  // browser session exists in the same client.
  const header = request.headers.get('authorization');
  const presented =
    header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : request.headers.get('x-api-key')?.trim();

  if (presented) {
    // A presented credential must be a well-formed key; never fall back to
    // cookie identity when the explicit credential is malformed (KC-043).
    if (!presented.includes('.')) {
      throw errors.unauthorized('Malformed API key.');
    }
    const [prefix] = presented.split('.');
    const record = await prisma.apiKey.findUnique({
      where: { prefix },
      include: { user: true },
    });
    if (!record || record.keyHash !== hashToken(presented) || record.revokedAt || record.user.suspendedAt) {
      throw errors.unauthorized('Invalid API key.');
    }
    // Fire-and-forget last-used stamp; must not slow the hot path. Failures
    // are surfaced operationally without logging the presented credential.
    void prisma.apiKey
      .update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
      .catch((error: unknown) => {
        console.error(
          '[auth] failed to stamp apiKey last-used',
          record.id,
          error instanceof Error ? error.message : error,
        );
      });
    return {
      kind: 'apikey',
      apiKeyId: record.id,
      user: { id: record.user.id, email: record.user.email, name: record.user.name, role: record.user.role },
    };
  }

  const sessionUser = await getSessionUser();
  if (sessionUser) return { kind: 'session', user: sessionUser };
  return null;
}

export function requirePrincipal(principal: Principal | null): Principal {
  if (!principal) throw errors.unauthorized();
  return principal;
}

/** Admin guard across both principal kinds. */
export function requireAdminPrincipal(principal: Principal | null): Principal & { user: SafeUser } {
  const principalSafe = requirePrincipal(principal);
  if (principalSafe.user.role !== 'ADMIN') throw errors.forbidden('Admin access required.');
  return principalSafe as Principal & { user: SafeUser };
}
