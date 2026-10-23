import { randomUUID } from 'node:crypto';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { cancelSubscription, refundPayment } from './billing';
import { makeUser } from '../test/helpers';

/**
 * KC-038 stripe-mode behavior with a mocked SDK: provider calls happen
 * before any local state change, and failures never report success.
 */

const stripeMock = vi.hoisted(() => {
  const subscriptionsUpdate = vi.fn();
  const invoicesRetrieve = vi.fn();
  const refundsCreate = vi.fn();
  const instances: Array<{
    subscriptions: { update: typeof subscriptionsUpdate };
    invoices: { retrieve: typeof invoicesRetrieve };
    refunds: { create: typeof refundsCreate };
  }> = [];
  class Stripe {
    subscriptions = { update: subscriptionsUpdate };
    invoices = { retrieve: invoicesRetrieve };
    refunds = { create: refundsCreate };
    constructor() {
      instances.push(this as never);
    }
  }
  return { instances, subscriptionsUpdate, invoicesRetrieve, refundsCreate, Stripe };
});

vi.mock('stripe', () => ({ default: stripeMock.Stripe }));

const cleanup: { users: string[]; teams: string[] } = { users: [], teams: [] };

beforeEach(() => {
  stripeMock.subscriptionsUpdate.mockReset().mockResolvedValue({ id: 'sub_x', cancel_at_period_end: true });
  stripeMock.refundsCreate.mockReset().mockResolvedValue({ id: 're_x' });
  stripeMock.invoicesRetrieve.mockReset();
  stripeMock.instances.length = 0;
  vi.stubEnv('BILLING_PROVIDER', 'stripe');
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_x');
  vi.stubEnv('APP_URL', 'http://localhost:3000');
  vi.stubEnv('STRIPE_PRICE_PRO', 'price_pro');
  vi.stubEnv('STRIPE_PRICE_TEAM', 'price_team');
  vi.stubEnv('STRIPE_PRICE_ENTERPRISE', 'price_ent');
});

afterEach(() => vi.unstubAllEnvs());

afterAll(async () => {
  await prisma.auditLog.deleteMany({ where: { actorId: { in: cleanup.users } } });
  await prisma.licenseKey.deleteMany({ where: { ownerId: { in: cleanup.users } } });
  await prisma.team.deleteMany({ where: { id: { in: cleanup.teams } } });
  await prisma.user.deleteMany({ where: { id: { in: cleanup.users } } });
  await prisma.$disconnect();
});

async function teamWithStripeSubscription() {
  const owner = await makeUser(cleanup.users, `stripe-${randomUUID()}@test.dev`);
  cleanup.users.push(owner.id);
  const team = await prisma.team.create({
    data: {
      name: 'Stripe Team',
      slug: `stripe-${randomUUID()}`,
      memberships: { create: { userId: owner.id, role: 'OWNER' } },
      subscription: {
        create: { plan: 'PRO', status: 'ACTIVE', provider: 'stripe', externalId: 'sub_stripe_1', customerId: 'cus_1' },
      },
    },
  });
  cleanup.teams.push(team.id);
  return { owner, team };
}

describe('stripe-mode cancel (KC-038/KC-007)', () => {
  it('calls Stripe cancel-at-period-end and records it only after success', async () => {
    const { owner, team } = await teamWithStripeSubscription();
    await cancelSubscription(team.id, owner.id);

    expect(stripeMock.subscriptionsUpdate).toHaveBeenCalledWith('sub_stripe_1', { cancel_at_period_end: true });
    const subscription = await prisma.subscription.findUniqueOrThrow({ where: { teamId: team.id } });
    expect(subscription.cancelAtPeriodEnd).toBe(true);
    expect(subscription.plan).toBe('PRO'); // kept until period end
  });

  it('throws and changes nothing when the provider call fails', async () => {
    const { owner, team } = await teamWithStripeSubscription();
    stripeMock.subscriptionsUpdate.mockRejectedValue(new Error('stripe 500'));

    await expect(cancelSubscription(team.id, owner.id)).rejects.toThrow(/stripe 500/);
    const subscription = await prisma.subscription.findUniqueOrThrow({ where: { teamId: team.id } });
    expect(subscription.cancelAtPeriodEnd).toBe(false);
  });
});

describe('stripe-mode refund (KC-038/KC-007)', () => {
  it('refunds a pi_ payment and marks it refunded only after confirmation', async () => {
    const { team } = await teamWithStripeSubscription();
    const payment = await prisma.payment.create({
      data: { teamId: team.id, amountCents: 2900, description: 'x', externalId: `pi_${randomUUID()}` },
    });

    await refundPayment(payment);

    expect(stripeMock.refundsCreate).toHaveBeenCalledWith({ payment_intent: payment.externalId });
    expect((await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })).status).toBe('REFUNDED');
  });

  it('resolves the payment intent across invoice API generations', async () => {
    const { team } = await teamWithStripeSubscription();
    const payment = await prisma.payment.create({
      data: { teamId: team.id, amountCents: 2900, description: 'x', externalId: `in_${randomUUID()}` },
    });
    stripeMock.invoicesRetrieve.mockResolvedValue({ payments: { data: [{ payment: 'pi_from_payments' }] } });

    await refundPayment(payment);
    expect(stripeMock.refundsCreate).toHaveBeenCalledWith({ payment_intent: 'pi_from_payments' });

    stripeMock.invoicesRetrieve.mockResolvedValue({ payment_intent: 'pi_legacy' });
    const second = await prisma.payment.create({
      data: { teamId: team.id, amountCents: 100, description: 'y', externalId: `in_${randomUUID()}` },
    });
    await refundPayment(second);
    expect(stripeMock.refundsCreate).toHaveBeenCalledWith({ payment_intent: 'pi_legacy' });
  });

  it('leaves the payment untouched when the refund call fails', async () => {
    const { team } = await teamWithStripeSubscription();
    const payment = await prisma.payment.create({
      data: { teamId: team.id, amountCents: 2900, description: 'x', externalId: `pi_${randomUUID()}` },
    });
    stripeMock.refundsCreate.mockRejectedValue(new Error('stripe 500'));

    await expect(refundPayment(payment)).rejects.toThrow(/stripe 500/);
    expect((await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })).status).toBe('PAID');
  });

  it('rejects refunds for unrecognized provider references', async () => {
    const { team } = await teamWithStripeSubscription();
    const payment = await prisma.payment.create({
      data: { teamId: team.id, amountCents: 100, description: 'x', externalId: 'mock_whatever' },
    });
    await expect(refundPayment(payment)).rejects.toThrow(/Unrecognized/);
    expect((await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })).status).toBe('PAID');
  });
});
