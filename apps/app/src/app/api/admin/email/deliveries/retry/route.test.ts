import { afterAll, describe, expect, it } from 'vitest';
import { getCookieStore } from '@/test/cookies-mock';
import { prisma } from '@slipstream-ui/db';
import { createSession } from '@/lib/session';
import { POST } from './route';

const store = getCookieStore();
const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const userIds: string[] = [];

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api/admin/email/deliveries/retry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function makeAdmin() {
  const user = await prisma.user.create({
    data: { email: `email-retry-${suffix}-${userIds.length}@test.dev`, role: 'ADMIN', emailVerifiedAt: new Date() },
  });
  userIds.push(user.id);
  await createSession(user.id);
  return user;
}

afterAll(async () => {
  store.clear();
  await prisma.emailDelivery.deleteMany({ where: { toEmail: { contains: suffix } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('admin email delivery retry', () => {
  it('requires an admin session', async () => {
    store.clear();
    const response = await POST(jsonRequest({ kind: 'newsletter' }));
    expect(response.status).toBe(401);
  });

  it('accepts newsletter as a retry kind and only resends that kind', async () => {
    store.clear();
    await makeAdmin();
    const to = `retry-${suffix}@test.dev`;
    await prisma.emailDelivery.createMany({
      data: [
        { toEmail: to, kind: 'newsletter', subject: 'n', bodyText: 'news', status: 'FAILED', attempts: 1 },
        { toEmail: to, kind: 'password_reset', subject: 'p', bodyText: 'reset', status: 'FAILED', attempts: 1 },
      ],
    });

    const response = await POST(jsonRequest({ kind: 'newsletter' }));
    expect(response.status).toBe(200);
    expect((await response.json()).data.resent).toBe(1);

    const newsletter = await prisma.emailDelivery.findFirstOrThrow({
      where: { toEmail: to, kind: 'newsletter' },
    });
    const reset = await prisma.emailDelivery.findFirstOrThrow({
      where: { toEmail: to, kind: 'password_reset' },
    });
    expect(newsletter.status).toBe('SENT');
    expect(reset.status).toBe('FAILED');
  });

  it('rejects unknown kinds', async () => {
    store.clear();
    await makeAdmin();
    const response = await POST(jsonRequest({ kind: 'not-a-kind' }));
    expect(response.status).toBe(400);
  });
});
