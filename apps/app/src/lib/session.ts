import { cookies } from 'next/headers';
import { prisma, type User } from '@slipstream-ui/db';
import { generateToken, hashToken } from './tokens';

export const SESSION_COOKIE = 'slipstream_session';
const SESSION_TTL_DAYS = 30;

export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

function toSafeUser(user: User): SafeUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

/** Create a DB-backed session and set the httpOnly cookie. */
export async function createSession(userId: string): Promise<void> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { tokenHash: hashToken(token), userId, expiresAt } });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

/** Resolve the current user from the session cookie; null when signed out. */
export async function getSessionUser(): Promise<SafeUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  if (session.user.suspendedAt) return null;

  return toSafeUser(session.user);
}

/** Revoke the current session (and optionally every session for the user). */
export async function destroySession(allDevices = false): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const where = allDevices
      ? (() => {
          // Need the userId from the token being destroyed.
          return prisma.session.findUnique({ where: { tokenHash: hashToken(token) } });
        })()
      : Promise.resolve(null);
    const current = await where;
    if (current) {
      await prisma.session.deleteMany({
        where: allDevices ? { userId: current.userId } : { tokenHash: hashToken(token) },
      });
    }
  }
  store.delete(SESSION_COOKIE);
}

export function requireUser(user: SafeUser | null): SafeUser {
  if (!user) throw new HttpError(401, 'Authentication required.');
  return user;
}

export function requireAdmin(user: SafeUser | null): SafeUser {
  const safe = requireUser(user);
  if (safe.role !== 'ADMIN') throw new HttpError(403, 'Admin access required.');
  return safe;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
