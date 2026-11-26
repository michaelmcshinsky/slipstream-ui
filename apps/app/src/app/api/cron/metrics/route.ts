/**
 * Nightly metric snapshot cron.
 * GET/POST /api/cron/metrics with Authorization: Bearer <secret>
 * Computes the same business metrics the admin overview shows and upserts
 * one MetricSnapshot row per UTC day, so historical numbers are
 * reproducible and diffable.
 */

import { prisma } from '@slipstream-ui/db';
import { computeBusinessMetrics } from '@/lib/metrics';
import { audit } from '@/lib/audit';
import { handle } from '@/lib/api/handle';
import { requireCronSecret } from '@/lib/cron-auth';

async function runSnapshot() {
  const startedAt = Date.now();
  const day = new Date().toISOString().slice(0, 10);
  try {
    const metrics = await computeBusinessMetrics();
    await prisma.metricSnapshot.upsert({
      where: { day },
      create: { day, metrics: JSON.stringify(metrics) },
      update: { metrics: JSON.stringify(metrics) },
    });
    await audit({
      action: 'metrics.snapshot',
      targetType: 'metric_snapshot',
      targetId: day,
      metadata: { mrr: metrics.billing.mrr, activePaidSubscriptions: metrics.billing.activePaidSubscriptions },
    });
    return { success: true, day, durationMs: Date.now() - startedAt };
  } catch (error) {
    console.info(
      JSON.stringify({
        event: 'metrics.cron.failed',
        day,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    throw error;
  }
}

export async function GET(request: Request) {
  return handle(request, async () => {
    requireCronSecret(request);
    return runSnapshot();
  }, { routeName: 'cron.metrics.get' });
}

export async function POST(request: Request) {
  return handle(request, async () => {
    requireCronSecret(request);
    return runSnapshot();
  }, { routeName: 'cron.metrics.post' });
}
