/**
 * Data-retention cron endpoint
 * GET|POST /api/cron/retention with Authorization: Bearer <CRON_SECRET>
 *
 * Deletes rows past their retention window (see lib/retention.ts). Run
 * daily; the operation is idempotent so overlapping runs are harmless.
 */

import { handle } from '@/lib/api/handle';
import { requireCronSecret } from '@/lib/cron-auth';
import { purgeExpiredData, RETENTION_DAYS } from '@/lib/retention';
import { logError, logInfo } from '@/lib/log';

async function runRetention() {
  const startedAt = Date.now();
  try {
    const purged = await purgeExpiredData();
    logInfo('cron.retention.completed', { ...purged, durationMs: Date.now() - startedAt });
    return { success: true, purged, retentionDays: RETENTION_DAYS, timestamp: new Date().toISOString() };
  } catch (error) {
    logError('cron.retention.failed', {
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function GET(request: Request) {
  return handle(request, async () => {
    requireCronSecret(request);
    return runRetention();
  }, { routeName: 'cron.retention.get' });
}

export async function POST(request: Request) {
  return handle(request, async () => {
    requireCronSecret(request);
    return runRetention();
  }, { routeName: 'cron.retention.post' });
}
