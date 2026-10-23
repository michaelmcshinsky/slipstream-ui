import { prisma, type Prisma } from '@slipstream-ui/db';
import Stripe from 'stripe';
import { getPlan } from './plans';
import { generateToken } from './tokens';
import { requireMembership } from './teams';
import { revokeSubscriptionLicenses } from './licenses';
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

function getStripe(): Stripe {
  // Every real Stripe call goes through here, so stripe mode fails fast with
  // a complete list of missing settings (KC-038) at the point of use.
  validateBillingConfig();
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured.');
  return new Stripe(key);
}

/**
 * Startup validation for stripe mode (KC-038): fail fast with a list of
 * missing settings instead of surfacing errors mid-checkout.
 */
export function validateBillingConfig(): void {
  if (process.env.BILLING_PROVIDER !== 'stripe') return;
  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
  if (!process.env.APP_URL) missing.push('APP_URL');
  for (const plan of ['PRO', 'TEAM', 'ENTERPRISE']) {
    if (!process.env[`STRIPE_PRICE_${plan}`]) missing.push(`STRIPE_PRICE_${plan}`);
  }
  if (missing.length > 0) {
    throw new Error(`Stripe billing is misconfigured. Missing: ${missing.join(', ')}.`);
  }
}

export function getBillingProvider(): BillingProvider {
  // Provider selection is config-only: validation runs when the Stripe SDK is
  // actually used (getStripe), so name-only consumers (webhook activation)
  // are not forced to configure checkout prices.
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

export async function downgradeToFree(teamId: string, db: Prisma.TransactionClient = prisma, actorId = 'system'): Promise<void> {
  await db.subscription.updateMany({
    where: { teamId },
    data: { plan: 'FREE', status: 'CANCELED', cancelAtPeriodEnd: false },
  });
  // Ending the paid relationship must end its licenses (KC-008).
  await revokeSubscriptionLicenses(teamId, actorId, db);
}

/**
 * Cancel a team's paid subscription. Mock mode cancels immediately; Stripe
 * mode schedules cancellation at period end via the Stripe API and only then
 * records it locally — success is reported only after the provider confirms
 * (KC-007). Local-only "success" without a provider call is never allowed in
 * stripe mode.
 */
export async function cancelSubscription(teamId: string, actorId: string): Promise<void> {
  if (getBillingProvider().name !== 'stripe') {
    await downgradeToFree(teamId, prisma, actorId);
    return;
  }
  const subscription = await prisma.subscription.findUnique({ where: { teamId } });
  if (!subscription?.externalId) {
    throw new Error('No Stripe subscription is recorded for this team.');
  }
  const stripe = getStripe();
  // Throws on failure — the route never reports success for an unconfirmed cancellation.
  await stripe.subscriptions.update(subscription.externalId, { cancel_at_period_end: true });
  await prisma.subscription.update({
    where: { teamId },
    data: { cancelAtPeriodEnd: true },
  });
}

/**
 * Refund a recorded payment. Mock mode flips local state; Stripe mode issues
 * a real refund against the payment's invoice/payment intent and only marks
 * the payment refunded after the provider confirms (KC-007).
 */
export async function refundPayment(payment: { id: string; externalId: string | null }): Promise<void> {
  if (getBillingProvider().name !== 'stripe') {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'REFUNDED' } });
    return;
  }
  const stripe = getStripe();
  const externalId = payment.externalId;
  if (!externalId) throw new Error('Payment has no external provider reference to refund.');
  if (externalId.startsWith('in_')) {
    // Invoice shape differs across Stripe API generations: basil+ exposes a
    // payments list, earlier versions expose payment_intent directly.
    const invoice = (await stripe.invoices.retrieve(externalId)) as Stripe.Invoice & {
      payment_intent?: string | { id: string } | null;
      payments?: { data?: Array<{ payment?: string | { id: string } | null }> };
    };
    const reference = invoice.payment_intent ?? invoice.payments?.data?.[0]?.payment;
    const paymentIntentId = typeof reference === 'string' ? reference : reference?.id;
    if (!paymentIntentId) throw new Error('Invoice has no payment intent to refund.');
    await stripe.refunds.create({ payment_intent: paymentIntentId });
  } else if (externalId.startsWith('pi_')) {
    await stripe.refunds.create({ payment_intent: externalId });
  } else if (externalId.startsWith('ch_')) {
    await stripe.refunds.create({ charge: externalId });
  } else {
    throw new Error(`Unrecognized payment reference "${externalId}"; cannot refund.`);
  }
  await prisma.payment.update({ where: { id: payment.id }, data: { status: 'REFUNDED' } });
}
