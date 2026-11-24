import { afterAll, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { getCookieStore } from '../../../test/cookies-mock';
import { prisma } from '@slipstream-ui/db';
import { createSession } from '@/lib/session';
import { GET as getPreferences, PATCH as patchPreferences } from './preferences/route';
import { POST as subscribe } from './subscribe/route';
import { POST as unsubscribe } from './unsubscribe/route';

const store = getCookieStore();
const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const userIds: string[] = [];

function jsonRequest(url: string, body: unknown, method = 'POST') {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function makeUser() {
  const user = await prisma.user.create({
    data: { email: `newsletter-${suffix}-${userIds.length}@test.dev`, emailVerifiedAt: new Date() },
  });
  userIds.push(user.id);
  return user;
}

async function preferencesFor(userId: string) {
  await createSession(userId);
  const response = await getPreferences(new Request('http://localhost/api/newsletter/preferences'));
  expect(response.status).toBe(200);
  return (await response.json()).data;
}

afterAll(async () => {
  store.clear();
  await prisma.newsletterSubscription.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.newsletterPreference.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect();
});

describe('newsletter subscription controls', () => {
  it('requires a session', async () => {
    store.clear();
    const response = await getPreferences(new Request('http://localhost/api/newsletter/preferences'));
    expect(response.status).toBe(401);
  });

  it('exposes real subscription rows and lets the user subscribe and unsubscribe', async () => {
    store.clear();
    const user = await makeUser();
    await createSession(user.id);

    const initial = await getPreferences(new Request('http://localhost/api/newsletter/preferences'));
    expect(initial.status).toBe(200);
    const initialBody = await initial.json();
    expect(initialBody.data.preferences).toBeTruthy();
    expect(initialBody.data.subscriptions).toEqual([]);

    const subscribed = await subscribe(
      jsonRequest('http://localhost/api/newsletter/subscribe', { type: 'daily' }),
    );
    expect(subscribed.status).toBe(200);

    const afterSubscribe = await preferencesFor(user.id);
    expect(afterSubscribe.subscriptions).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'daily', status: 'active' })]),
    );
    expect(afterSubscribe.preferences.dailyEnabled).toBe(true);

    const unsubscribed = await unsubscribe(
      jsonRequest('http://localhost/api/newsletter/unsubscribe', { type: 'daily' }),
    );
    expect(unsubscribed.status).toBe(200);

    const afterUnsubscribe = await preferencesFor(user.id);
    expect(afterUnsubscribe.subscriptions).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'daily', status: 'unsubscribed' })]),
    );
    expect(afterUnsubscribe.preferences.dailyEnabled).toBe(false);
  });

  it('validates preference updates and returns the standard envelope', async () => {
    store.clear();
    const user = await makeUser();
    await createSession(user.id);

    const invalid = await patchPreferences(
      jsonRequest('http://localhost/api/newsletter/preferences', { contentTypes: ['not-a-type'] }, 'PATCH'),
    );
    expect(invalid.status).toBe(400);

    const valid = await patchPreferences(
      jsonRequest(
        'http://localhost/api/newsletter/preferences',
        { timezone: 'UTC', contentTypes: ['release'], frequency: 'weekly' },
        'PATCH',
      ),
    );
    expect(valid.status).toBe(200);
    const body = await valid.json();
    expect(body.data.preferences).toMatchObject({
      timezone: 'UTC',
      frequency: 'weekly',
    });
    expect(body.data.preferences.contentTypes).toEqual(['release']);
  });
});
