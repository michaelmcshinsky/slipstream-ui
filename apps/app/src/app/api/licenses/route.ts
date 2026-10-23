export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { issueLicense, remainingTeamActivationBudget, planActivationBudget } from '@/lib/licenses';
import { requireMembership } from '@/lib/teams';
import { getPlan } from '@/lib/plans';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody, errors } from '@/lib/api/core';

export async function GET(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const licenses = await prisma.licenseKey.findMany({
      where: { ownerId: user.id },
      include: { activations: true },
      orderBy: { createdAt: 'desc' },
    });
    return { licenses };
  });
}

/**
 * Self-service license issuance. Requires a paid, active subscription on the
 * target team and derives the plan from that subscription — a requested plan
 * can never exceed what the team actually pays for (KC-001). Comp issuance
 * (no entitlement) lives on POST /api/admin/licenses and is admin-only.
 */
export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await parseBody(
      request,
      z.object({
        teamId: z.string().min(1).optional(),
        plan: z.string().optional(),
        note: z.string().max(500).optional(),
      }),
    );
    const requestedPlan = body.plan ?? 'PRO';
    if (!['PRO', 'TEAM', 'ENTERPRISE'].includes(requestedPlan)) badRequest('Invalid plan.');

    // Platform admins may issue comps through this route with any plan.
    if (user.role === 'ADMIN') {
      return issueLicense({ ownerId: user.id, teamId: body.teamId, plan: requestedPlan, note: body.note, actorId: user.id });
    }

    if (!body.teamId) badRequest('teamId is required.');
    await requireMembership(user.id, body.teamId, 'MEMBER');

    const subscription = await prisma.subscription.findUnique({ where: { teamId: body.teamId } });
    if (
      !subscription ||
      subscription.status !== 'ACTIVE' ||
      (getPlan(subscription.plan)?.priceCents ?? 0) <= 0
    ) {
      throw errors.forbidden('An active paid subscription is required to issue licenses.');
    }
    if (subscription.plan !== requestedPlan) {
      badRequest(`Your subscription covers the ${subscription.plan} plan only.`);
    }

    // Idempotent retries: an existing active key for this owner/team/plan is
    // returned instead of minting a duplicate (KC-001 reissuance).
    const existing = await prisma.licenseKey.findFirst({
      where: {
        ownerId: user.id,
        teamId: body.teamId,
        plan: subscription.plan,
        status: 'ACTIVE',
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: 'desc' },
    });
    if (existing) return { key: existing.key };

    // Team-wide activation budget: never exceed the plan's aggregate capacity.
    const remaining = await remainingTeamActivationBudget(body.teamId, subscription.plan);
    if (remaining <= 0) {
      badRequest(`Team activation budget exhausted (${planActivationBudget(subscription.plan)} per ${subscription.plan} plan).`);
    }

    return issueLicense({
      ownerId: user.id,
      teamId: body.teamId,
      plan: subscription.plan,
      maxActivations: remaining,
      note: body.note,
      expiresAt: subscription.currentPeriodEnd,
    });
  });
}
