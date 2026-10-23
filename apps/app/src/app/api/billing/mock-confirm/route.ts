export const dynamic = 'force-dynamic';

import { prisma, Prisma } from '@slipstream-ui/db';
import { NextResponse } from 'next/server';
import { getSessionUser, requireUser } from '@/lib/session';
import { requireMembership } from '@/lib/teams';
import { activateSubscription, requireMockBilling } from '@/lib/billing';
import { getPlan } from '@/lib/plans';
import { issueLicense } from '@/lib/licenses';
import { audit } from '@/lib/audit';
import { handle, badRequest } from '@/lib/api/handle';
import { errors } from '@/lib/api/core';

function checkoutId(values: (string | File)[]): string {
  const id = values[0];
  if (values.length !== 1 || typeof id !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(id)) {
    badRequest('A valid checkoutId is required.');
  }
  return id;
}

async function pendingCheckout(id: string, userId: string, db: Prisma.TransactionClient) {
  const checkout = await db.mockCheckout.findUnique({ where: { id }, include: { team: true } });
  if (!checkout || checkout.userId !== userId) throw errors.notFound('Checkout not found.');
  await requireMembership(userId, checkout.teamId, 'ADMIN', db);
  if (checkout.consumedAt) throw errors.conflict('Checkout has already been completed.');
  if (checkout.expiresAt <= new Date()) throw errors.conflict('Checkout has expired. Start a new checkout.');
  const plan = getPlan(checkout.plan);
  if (!plan || plan.id === 'FREE') badRequest('Invalid checkout plan.');
  return { checkout, plan };
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export async function GET(request: Request) {
  return handle(request, async () => {
    requireMockBilling();
    const user = requireUser(await getSessionUser());
    const id = checkoutId(new URL(request.url).searchParams.getAll('checkoutId'));
    const { checkout, plan } = await pendingCheckout(id, user.id, prisma);
    return new NextResponse(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Confirm mock checkout</title></head>
<body><main>
<h1>Confirm mock checkout</h1>
<p>Activate ${escapeHtml(plan.id)} for ${escapeHtml(checkout.team.name)} at $${(plan.priceCents / 100).toFixed(2)} per month.</p>
<p>This is a mock payment. No money will be charged. This checkout expires in 15 minutes from creation.</p>
<form method="post" action="/api/billing/mock-confirm">
<input type="hidden" name="checkoutId" value="${escapeHtml(checkout.id)}">
<button type="submit">Confirm mock checkout</button>
</form>
<p><a href="/dashboard/billing">Cancel and return to billing</a></p>
</main></body></html>`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
      },
    });
  });
}

async function consumeCheckout(id: string, initiatingUserId: string): Promise<string> {
  try {
    return await prisma.$transaction(async (tx) => {
      const user = requireUser(await getSessionUser(tx));
      if (user.id !== initiatingUserId) throw errors.unauthorized();
      const { checkout, plan } = await pendingCheckout(id, user.id, tx);
      const claimed = await tx.mockCheckout.updateMany({
        where: { id, userId: user.id, consumedAt: null, expiresAt: { gt: new Date() } },
        data: { consumedAt: new Date() },
      });
      if (claimed.count !== 1) throw errors.conflict('Checkout is expired or already completed.');
      const teamId = checkout.teamId;
      const owner = await tx.membership.findFirst({ where: { teamId, role: 'OWNER' }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] });
      if (!owner) throw errors.conflict('Team must have an owner to complete checkout.');
      await activateSubscription(teamId, plan.id, undefined, tx);
      const subscription = await tx.subscription.findUniqueOrThrow({ where: { teamId } });
      await tx.payment.create({
        data: {
          teamId, userId: user.id, subscriptionId: subscription.id,
          amountCents: plan.priceCents, description: `${plan.id} monthly`, status: 'PAID', externalId: `mock_${checkout.id}`,
        },
      });
      const existing = await tx.licenseKey.findFirst({ where: { teamId, plan: plan.id, status: 'ACTIVE' } });
      if (!existing) {
        // Subscription-issued licenses expire with the billing period (KC-008).
        await issueLicense({ ownerId: owner.userId, teamId, plan: plan.id, actorId: user.id, note: `Auto-issued with ${plan.id} subscription`, expiresAt: subscription.currentPeriodEnd }, tx);
      }
      await audit({
        actorId: user.id, action: 'billing.mock-checkout.completed', targetType: 'mockCheckout', targetId: checkout.id,
        metadata: { teamId, plan: plan.id },
      }, tx);
      return teamId;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2034', 'P1008', 'P2028'].includes(error.code)) {
      throw errors.conflict('Checkout could not be completed concurrently. Retry or start a new checkout.');
    }
    throw error;
  }
}

export async function POST(request: Request) {
  return handle(request, async () => {
    requireMockBilling();
    const origin = new URL(request.url).origin;
    if (request.headers.get('origin') !== origin) throw errors.forbidden('Same-origin confirmation is required.');
    const user = requireUser(await getSessionUser());
    if (request.headers.get('content-type')?.split(';')[0]?.trim() !== 'application/x-www-form-urlencoded') {
      badRequest('A confirmation form is required.');
    }
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      badRequest('Invalid confirmation form.');
    }
    const teamId = await consumeCheckout(checkoutId(form.getAll('checkoutId')), user.id);
    return NextResponse.redirect(new URL(`/dashboard/billing?checkout=success&teamId=${encodeURIComponent(teamId)}`, origin), 302);
  });
}
