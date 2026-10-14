import { prisma, type Prisma } from '@slipstream-ui/db';
import { getPlan } from './plans';
import { generateToken } from './tokens';
import { requireMembership } from './teams';
import { errors } from './api/core';

export type CheckoutResult = {
  url: string;
  provider: string;
};

/**
 * Billing provider abstraction: Stripe in production, a deterministic mock for
 * local dev and tests. Both implement the same lifecycle so the application
 * layer never branches on the provider.
 */
export type BillingProvider = {
  name: string;
  createCheckout(params: { userId: string; teamId: string; plan: string; email: string }): Promise<CheckoutResult>;
  createPortalUrl(teamId: string): Promise<string>;
  /** Records a successful payment (used by webhooks and the mock flow). */
  recordPayment(params: { teamId: string; amountCents: number; description: string; externalId?: string; subscriptionId?: string }): Promise<void>;
};

export function requireMockBilling(): void {
  if (process.env.NODE_ENV === 'production') {
    throw errors.forbidden('Mock checkout is unavailable in production.');
  }
  if (process.env.BILLING_PROVIDER === 'stripe') {
    throw errors.badRequest('Mock checkout is disabled in stripe mode.');
  }
}

export const mockProvider: BillingProvider = {
  name: 'mock',
  async createCheckout({ userId, teamId, plan }) {
    requireMockBilling();
    const planInfo = getPlan(plan);
    if (!planInfo || planInfo.id === 'FREE') throw errors.badRequest('Invalid plan.');
    await requireMembership(userId, teamId, 'ADMIN');
    const checkout = await prisma.mockCheckout.create({
      data: { id: generateToken(), userId, teamId, plan: planInfo.id, expiresAt: new Date(Date.now() + 15 * 60_000) },
    });
    return { url: `/api/billing/mock-confirm?checkoutId=${checkout.id}`, provider: 'mock' };
  },
  async createPortalUrl(teamId) {
    return `/dashboard/billing?portal=${teamId}`;
  },
  async recordPayment() {
    // The mock activate endpoint writes payments directly.
  },
};

export const stripeProvider: BillingProvider = {
  name: 'stripe',
  async createCheckout({ teamId, plan }) {
    const stripe = getStripe();
    const priceId = process.env[`STRIPE_PRICE_${plan}`];
    if (!priceId) throw new Error(`Missing STRIPE_PRICE_${plan} env var.`);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: teamId,
      success_url: `${process.env.APP_URL}/dashboard/billing?checkout=success`,
      cancel_url: `${process.env.APP_URL}/dashboard/billing?checkout=cancelled`,
    });
    return { url: session.url ?? '', provider: 'stripe' };
  },
  async createPortalUrl(teamId) {
    const stripe = getStripe();
    const subscription = await prisma.subscription.findUnique({ where: { teamId } });
    if (!subscription?.customerId) throw new Error('No Stripe customer for this team.');
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${process.env.APP_URL}/dashboard/billing`,
    });
    return session.url;
  },
  async recordPayment() {
    // Real payments are recorded by the Stripe webhook handler.
  },
};

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured.');
  // Lazily and indirectly required so the app builds without stripe installed
  // (mock provider mode) and webpack does not trace the module.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-var-requires
  const Stripe = (0, eval)('require')('stripe');
  return new Stripe(key);
}

export function getBillingProvider(): BillingProvider {
  return process.env.BILLING_PROVIDER === 'stripe' ? stripeProvider : mockProvider;
}

/** Transition a team onto a paid plan; idempotent per plan change. */
export async function activateSubscription(teamId: string, plan: string, external?: { customerId?: string; subscriptionId?: string }, db: Prisma.TransactionClient = prisma): Promise<void> {
  const planInfo = getPlan(plan);
  await db.subscription.upsert({
    where: { teamId },
    create: {
      teamId,
      plan,
      status: 'ACTIVE',
      seats: planInfo?.seats ?? 1,
      provider: getBillingProvider().name,
      customerId: external?.customerId,
      externalId: external?.subscriptionId,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    update: {
      plan,
      status: 'ACTIVE',
      seats: planInfo?.seats ?? 1,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ...(external?.customerId ? { customerId: external.customerId } : {}),
      ...(external?.subscriptionId ? { externalId: external.subscriptionId } : {}),
    },
  });
}

export async function downgradeToFree(teamId: string, db: Prisma.TransactionClient = prisma): Promise<void> {
  await db.subscription.updateMany({
    where: { teamId },
    data: { plan: 'FREE', status: 'CANCELED', cancelAtPeriodEnd: false },
  });
}
