import { createHmac, randomUUID } from 'node:crypto';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma, Prisma } from '@slipstream-ui/db';
import { POST } from './webhook/route';

const secret = 'local-webhook-test-secret';
const teamIds: string[] = [];

function event(type: string, object: Record<string, unknown>, id = `evt_${randomUUID()}`) {
  return { id, type, data: { object } };
}

function signature(payload: string, timestamp = Math.floor(Date.now() / 1000), key = secret) {
  return `t=${timestamp},v1=${createHmac('sha256', key).update(`${timestamp}.${payload}`).digest('hex')}`;
}

function sendRaw(payload: string, header: string | null = signature(payload)) {
  return POST(new Request('http://localhost/api/billing/webhook', {
    method: 'POST',
    headers: { 'x-forwarded-for': randomUUID(), ...(header === null ? {} : { 'stripe-signature': header }) },
    body: payload,
  }));
}

function send(value: unknown) {
  return sendRaw(JSON.stringify(value));
}

async function fixture() {
  const team = await prisma.team.create({ data: { name: 'Webhook test', slug: randomUUID() } });
  teamIds.push(team.id);
  const subscription = await prisma.subscription.create({
    data: { teamId: team.id, plan: 'TEAM', provider: 'stripe', customerId: `cus_${randomUUID()}` },
  });
  return { team, subscription };
}

async function state(teamId: string) {
  return {
    subscription: await prisma.subscription.findUnique({ where: { teamId } }),
    payments: await prisma.payment.findMany({ where: { teamId } }),
  };
}

beforeEach(() => {
  vi.stubEnv('STRIPE_WEBHOOK_SECRET', secret);
  vi.stubEnv('BILLING_PROVIDER', 'stripe');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

afterAll(async () => {
  await prisma.payment.deleteMany({ where: { teamId: { in: teamIds } } });
  await prisma.team.deleteMany({ where: { id: { in: teamIds } } });
  await prisma.$disconnect();
});

describe('webhook trust boundary (KC-005)', () => {
  it.each(['development', 'test', 'production'])('fails closed without configuration in %s', async (environment) => {
    vi.stubEnv('NODE_ENV', environment);
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', undefined);
    const { team } = await fixture();
    const before = await state(team.id);
    const response = await sendRaw(JSON.stringify(event('checkout.session.completed', { client_reference_id: team.id })), null);
    expect(response.status).toBe(503);
    expect(await state(team.id)).toEqual(before);
  });

  it('fails closed with a whitespace-only secret', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', '  ');
    expect((await send(event('unknown.event', {}))).status).toBe(503);
  });

  it.each([null, '', 't=1', 'v1=abc', 't=invalid,v1=abc'])('rejects missing or malformed signatures: %s', async (header) => {
    expect((await sendRaw(JSON.stringify(event('unknown.event', {})), header)).status).toBe(400);
  });

  it.each([-301, 31])('rejects signed timestamps outside the freshness window: %s seconds', async (offset) => {
    const { team } = await fixture();
    const before = await state(team.id);
    const payload = JSON.stringify(event('checkout.session.completed', { client_reference_id: team.id }));
    expect((await sendRaw(payload, signature(payload, Math.floor(Date.now() / 1000) + offset))).status).toBe(400);
    expect(await state(team.id)).toEqual(before);
  });

  it('accepts any matching rotated v1 signature, not only the last', async () => {
    const payload = JSON.stringify(event('unknown.event', {}));
    const response = await sendRaw(payload, `${signature(payload)},v1=${'0'.repeat(64)}`);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ data: { received: true, ignored: true } });
  });

  it('rejects duplicate timestamps even if the last one is signed', async () => {
    const payload = JSON.stringify(event('unknown.event', {}));
    expect((await sendRaw(payload, `t=1,${signature(payload)}`)).status).toBe(400);
  });

  it.each([-300, 0, 30])('accepts freshness boundaries at %s seconds', async (offset) => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const payload = JSON.stringify(event('unknown.event', {}));
    expect((await sendRaw(payload, signature(payload, Math.floor(now / 1000) + offset))).status).toBe(200);
  });

  it.each(['1.5', '-1', '+1', '01', '1e9', '9007199254740992'])('rejects noncanonical timestamps: %s', async (timestamp) => {
    const payload = JSON.stringify(event('unknown.event', {}));
    const digest = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
    expect((await sendRaw(payload, `t=${timestamp},v1=${digest}`)).status).toBe(400);
  });

  it.each(['g'.repeat(64), '0'.repeat(63), '0'.repeat(65), '00=00'])('rejects malformed digest encoding: %s', async (digest) => {
    expect((await sendRaw(JSON.stringify(event('unknown.event', {})), `t=${Math.floor(Date.now() / 1000)},v1=${digest}`)).status).toBe(400);
  });

  it('unsupported events acknowledge explicitly without persistence', async () => {
    const delivery = event('unknown.event', { customer: [] });
    expect(await (await send(delivery)).json()).toMatchObject({ data: { received: true, ignored: true } });
    expect(await prisma.billingWebhookEvent.count({ where: { eventId: delivery.id } })).toBe(0);
  });

  it.each([
    { customer: {} }, { subscription: [] }, { items: [] }, { items: { data: {} } },
    { items: { data: [{ price: { nickname: 123 } }] } },
  ])('rejects malformed activation shapes before claiming an event: %j', async (invalid) => {
    const { team } = await fixture();
    const before = await state(team.id);
    const delivery = event('customer.subscription.updated', { metadata: { teamId: team.id }, ...invalid });
    expect((await send(delivery)).status).toBe(400);
    expect(await state(team.id)).toEqual(before);
    expect(await prisma.billingWebhookEvent.count({ where: { eventId: delivery.id } })).toBe(0);
  });

  it('invalid signatures cannot acknowledge an already processed event', async () => {
    const delivery = event('invoice.payment_failed', {});
    expect((await send(delivery)).status).toBe(200);
    expect((await sendRaw(JSON.stringify(delivery), null)).status).toBe(400);
  });

  it('verifies the exact body and secret', async () => {
    const payload = JSON.stringify(event('unknown.event', {}));
    expect((await sendRaw(`${payload} `, signature(payload))).status).toBe(400);
    expect((await sendRaw(payload, signature(payload, Math.floor(Date.now() / 1000), 'wrong-secret'))).status).toBe(400);
  });

  it.each(['{', 'null', '[]', '{}', '{"id":"evt_bad","type":"invoice.paid","data":{"object":[]}}'])('rejects invalid JSON/envelopes: %s', async (payload) => {
    expect((await sendRaw(payload)).status).toBe(400);
  });

  it.each([
    { customer: {} },
    { amount_paid: '2900' },
    { amount_paid: -1 },
    { amount_paid: 1.5 },
    { amount_paid: 2147483648 },
    { number: {} },
    { metadata: { teamId: [] } },
    { client_reference_id: 42 },
  ])('rejects malformed invoice fields without mutation: %j', async (invalid) => {
    const { team, subscription } = await fixture();
    const before = await state(team.id);
    const response = await send(event('invoice.paid', {
      id: `in_${randomUUID()}`, customer: subscription.customerId, amount_paid: 2900, ...invalid,
    }));
    expect(response.status).toBe(400);
    expect(await state(team.id)).toEqual(before);
  });
});

describe('webhook billing transactions (KC-005)', () => {
  it.each([
    'checkout.session.completed', 'customer.subscription.updated', 'invoice.paid',
    'invoice.payment_succeeded', 'invoice.payment_failed', 'customer.subscription.deleted',
  ])('rolls back receipt and billing writes together for %s, then retries', async (type) => {
    const { team, subscription } = await fixture();
    const delivery = event(type, {
      client_reference_id: team.id, customer: subscription.customerId, amount_paid: 2900,
      id: `in_${randomUUID()}`,
    });
    const before = await state(team.id);
    const original = prisma.$transaction.bind(prisma);
    vi.spyOn(prisma, '$transaction').mockImplementationOnce(async (...args: Parameters<typeof prisma.$transaction>) => {
      const [callback, options] = args;
      return original(async (db) => {
        await callback(db);
        throw new Error('Injected failure before commit');
      }, options);
    });
    expect((await send(delivery)).status).toBe(500);
    expect(await state(team.id)).toEqual(before);
    expect(await prisma.billingWebhookEvent.count({ where: { eventId: delivery.id } })).toBe(0);
    expect((await send(delivery)).status).toBe(200);
    expect(await prisma.billingWebhookEvent.count({ where: { eventId: delivery.id } })).toBe(1);
    const committed = await state(team.id);
    expect(committed).not.toEqual(before);
    await prisma.$disconnect();
    expect((await send(delivery)).status).toBe(200);
    expect(await state(team.id)).toEqual(committed);
  });

  it('deduplicates by event ID even without an invoice ID and keeps invoice defaults', async () => {
    const { team } = await fixture();
    const delivery = event('invoice.paid', { metadata: { teamId: team.id } });
    expect((await send(delivery)).status).toBe(200);
    expect((await send(delivery)).status).toBe(200);
    const { payments } = await state(team.id);
    expect(payments).toHaveLength(1);
    expect(payments[0]).toMatchObject({ amountCents: 0, description: 'Invoice', currency: 'usd', externalId: expect.stringMatching(/^in_/)});
  });

  it.each(['P1008', 'P2028', 'P2034'])('classifies %s contention as retryable instead of failed', async (code) => {
    const { team } = await fixture();
    const before = await state(team.id);
    const delivery = event('invoice.payment_failed', { metadata: { teamId: team.id } });
    vi.spyOn(prisma, '$transaction').mockRejectedValueOnce(new Prisma.PrismaClientKnownRequestError('Timed out', { code, clientVersion: 'test' }));
    expect((await send(delivery)).status).toBe(503);
    expect(await state(team.id)).toEqual(before);
  });

  it('does not treat an unrelated payment uniqueness failure as event completion', async () => {
    const { team, subscription } = await fixture();
    const object = { id: `in_${randomUUID()}`, customer: subscription.customerId, amount_paid: 2900 };
    expect((await send(event('invoice.paid', object))).status).toBe(200);
    const other = event('invoice.payment_succeeded', object);
    expect((await send(other)).status).toBe(500);
    expect(await prisma.billingWebhookEvent.count({ where: { eventId: other.id } })).toBe(0);
    expect(await prisma.payment.count({ where: { teamId: team.id } })).toBe(1);
  });

  it.each(['invoice.payment_failed', 'customer.subscription.deleted'])('preserves no-team no-op for %s', async (type) => {
    const delivery = event(type, {});
    expect((await send(delivery)).status).toBe(200);
    expect(await prisma.billingWebhookEvent.count({ where: { eventId: delivery.id } })).toBe(1);
  });

  it('records a successful invoice once across sequential deliveries', async () => {
    const { team, subscription } = await fixture();
    const invoice = event('invoice.paid', {
      id: `in_${randomUUID()}`, customer: subscription.customerId, amount_paid: 2900, number: 'TEST-1',
    });
    expect((await send(invoice)).status).toBe(200);
    const before = await state(team.id);
    const duplicate = await send(invoice);
    expect(duplicate.status).toBe(200);
    expect(await duplicate.json()).toMatchObject({ data: { received: true, duplicate: true } });
    expect(await state(team.id)).toEqual(before);
    expect(before.payments).toHaveLength(1);
    expect(before.payments[0]).toMatchObject({ amountCents: 2900, description: 'Invoice TEST-1', status: 'PAID' });
  });

  it('does not reapply subscription effects after a later local change', async () => {
    const { team } = await fixture();
    const checkout = event('checkout.session.completed', { client_reference_id: team.id });
    expect((await send(checkout)).status).toBe(200);
    expect(await prisma.subscription.findUnique({ where: { teamId: team.id } })).toMatchObject({ plan: 'PRO', status: 'ACTIVE' });
    await prisma.subscription.update({ where: { teamId: team.id }, data: { plan: 'TEAM', status: 'PAST_DUE' } });
    const before = await state(team.id);
    expect((await send(checkout)).status).toBe(200);
    expect(await state(team.id)).toEqual(before);
  });

  it('preserves explicit nickname mapping and the existing status behavior', async () => {
    const { team } = await fixture();
    const response = await send(event('checkout.session.completed', {
      client_reference_id: team.id, customer: 'cus_test', subscription: 'sub_test',
      payment_status: 'unpaid', items: { data: [{ price: { nickname: 'team' } }] },
    }));
    expect(response.status).toBe(200);
    expect(await prisma.subscription.findUnique({ where: { teamId: team.id } })).toMatchObject({
      plan: 'TEAM', status: 'ACTIVE', customerId: 'cus_test', externalId: 'sub_test',
    });
  });

  it('keeps failed events retryable', async () => {
    const teamId = `missing_${randomUUID()}`;
    const checkout = event('checkout.session.completed', { client_reference_id: teamId });
    expect((await send(checkout)).status).toBe(500);
    await prisma.team.create({ data: { id: teamId, name: 'Retry test', slug: randomUUID() } });
    teamIds.push(teamId);
    expect((await send(checkout)).status).toBe(200);
    expect(await prisma.subscription.findUnique({ where: { teamId } })).toMatchObject({ plan: 'PRO' });
  });

  it('concurrent redeliveries have one billing effect and can retry transient failures', async () => {
    const { team, subscription } = await fixture();
    const invoice = event('invoice.payment_succeeded', {
      id: `in_${randomUUID()}`, customer: subscription.customerId, amount_paid: 9900,
    });
    const responses = await Promise.all(Array.from({ length: 4 }, () => send(invoice)));
    for (const response of responses) expect([200, 503]).toContain(response.status);
    expect(responses.some((response) => response.status === 200)).toBe(true);
    expect((await send(invoice)).status).toBe(200);
    expect(await prisma.payment.count({ where: { teamId: team.id } })).toBe(1);
  });
});
