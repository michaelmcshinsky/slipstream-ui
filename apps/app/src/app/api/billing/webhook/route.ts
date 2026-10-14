export const dynamic = 'force-dynamic';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { prisma, Prisma } from '@slipstream-ui/db';
import { z } from 'zod';
import { activateSubscription, downgradeToFree } from '@/lib/billing';
import { handle, badRequest } from '@/lib/api/handle';
import { ApiError } from '@/lib/api/core';

const eventSchema = z.object({
  id: z.string().min(1).max(255),
  type: z.string().min(1).max(255),
  data: z.object({ object: z.record(z.unknown()) }),
});
const teamSchema = z.object({
  client_reference_id: z.string().nullish(),
  metadata: z.object({ teamId: z.string().nullish() }).nullish(),
});
const activationSchema = teamSchema.extend({
  customer: z.string().optional(),
  subscription: z.string().optional(),
  items: z.object({
    data: z.array(z.object({ price: z.object({ nickname: z.string().nullish() }) })).optional(),
  }).nullish(),
});
const invoiceSchema = teamSchema.extend({
  customer: z.string().optional(),
  amount_paid: z.number().int().min(0).max(2147483647).nullish(),
  number: z.string().nullish(),
  id: z.string().nullish(),
});

type BillingEvent = z.infer<typeof eventSchema>;
type BillingAction = (db: Prisma.TransactionClient) => Promise<void>;

function validate<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) badRequest('Invalid webhook payload.');
  return result.data;
}

function verifyStripeSignature(payload: Buffer, header: string | null, secret: string): boolean {
  if (!header || header.length > 8192) return false;
  let timestamp: string | undefined;
  const signatures: Buffer[] = [];
  for (const part of header.split(',')) {
    const match = /^([^=\s]+)=([^=\s]+)$/.exec(part.trim());
    if (!match) return false;
    const [, name, value] = match;
    if (name === 't') {
      if (timestamp !== undefined || !/^[1-9]\d{0,15}$/.test(value)) return false;
      timestamp = value;
    } else if (name === 'v1') {
      if (!/^[a-fA-F0-9]{64}$/.test(value)) return false;
      signatures.push(Buffer.from(value, 'hex'));
    }
  }
  if (!timestamp || signatures.length === 0) return false;
  const seconds = Number(timestamp);
  const age = Math.floor(Date.now() / 1000) - seconds;
  if (!Number.isSafeInteger(seconds) || age > 300 || age < -30) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.`).update(payload).digest();
  let matched = false;
  for (const signature of signatures) {
    matched = timingSafeEqual(expected, signature) || matched;
  }
  return matched;
}

function teamIdFrom(object: z.infer<typeof teamSchema>): string {
  return object.client_reference_id ?? object.metadata?.teamId ?? '';
}

function billingAction(event: BillingEvent): BillingAction | null {
  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.updated': {
      const object = validate(activationSchema, event.data.object);
      const teamId = teamIdFrom(object);
      return async (db) => {
        if (!teamId) return;
        const plan = (object.items?.data?.[0]?.price.nickname ?? 'PRO').toUpperCase();
        await activateSubscription(teamId, plan, {
          customerId: object.customer,
          subscriptionId: object.subscription,
        }, db);
      };
    }
    case 'invoice.paid':
    case 'invoice.payment_succeeded': {
      const object = validate(invoiceSchema, event.data.object);
      const teamId = teamIdFrom(object);
      return async (db) => {
        if (!teamId && !object.customer) return;
        const subscription = await db.subscription.findFirst({
          where: { OR: [{ customerId: object.customer }, { teamId }] },
        });
        if (subscription) {
          await db.payment.create({
            data: {
              teamId: subscription.teamId,
              subscriptionId: subscription.id,
              amountCents: object.amount_paid ?? 0,
              description: `Invoice ${object.number ?? ''}`.trim(),
              status: 'PAID',
              externalId: object.id ?? `in_${Date.now()}`,
            },
          });
        }
      };
    }
    case 'invoice.payment_failed': {
      const teamId = teamIdFrom(validate(teamSchema, event.data.object));
      return async (db) => {
        if (teamId) await db.subscription.updateMany({ where: { teamId }, data: { status: 'PAST_DUE' } });
      };
    }
    case 'customer.subscription.deleted': {
      const teamId = teamIdFrom(validate(teamSchema, event.data.object));
      return async (db) => {
        if (teamId) await downgradeToFree(teamId, db);
      };
    }
    default:
      return null;
  }
}

async function processEvent(event: BillingEvent, action: BillingAction) {
  const where = { provider_eventId: { provider: 'stripe', eventId: event.id } };
  try {
    return await prisma.$transaction(async (db) => {
      if (await db.billingWebhookEvent.findUnique({ where })) return { received: true, duplicate: true };
      await db.billingWebhookEvent.create({ data: { provider: 'stripe', eventId: event.id, type: event.type } });
      await action(db);
      return { received: true };
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (['P2002', 'P2034', 'P1008', 'P2028'].includes(error.code)) {
        if (await prisma.billingWebhookEvent.findUnique({ where })) return { received: true, duplicate: true };
        if (error.code !== 'P2002') {
          throw new ApiError(503, 'webhook_retry', 'Webhook processing is busy. Retry delivery.');
        }
      }
    }
    throw new ApiError(500, 'webhook_processing_failed', 'Webhook processing failed. Retry delivery.');
  }
}

export async function POST(request: Request) {
  return handle(request, async () => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret?.trim()) throw new ApiError(503, 'webhook_unconfigured', 'Webhook verification is unavailable.');
    const payload = Buffer.from(await request.arrayBuffer());
    if (!verifyStripeSignature(payload, request.headers.get('stripe-signature'), secret)) {
      badRequest('Invalid webhook signature.');
    }
    let raw: unknown;
    try {
      raw = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(payload));
    } catch {
      badRequest('Invalid webhook payload.');
    }
    const event = validate(eventSchema, raw);
    const action = billingAction(event);
    if (!action) return { received: true, ignored: true };
    return processEvent(event, action);
  });
}
