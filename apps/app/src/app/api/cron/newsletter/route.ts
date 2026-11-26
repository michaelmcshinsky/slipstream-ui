/**
 * Newsletter cron job endpoint
 * Called by OpenWork Automation on schedule
 * GET /api/cron/newsletter?frequency=daily|weekly with Authorization: Bearer <secret>
 */

import { createNewsletterGenerator, queueNewsletterDeliveries, processQueuedDeliveries } from '@slipstream-ui/newsletter';
import { deliverEmail } from '@/lib/email';
import { handle, z, badRequest } from '@/lib/api/handle';
import { ApiError, parseBody } from '@/lib/api/core';
import { requireCronSecret } from '@/lib/cron-auth';
import { audit } from '@/lib/audit';

const frequencySchema = z.enum(['daily', 'weekly']);
const postSchema = z.object({ frequency: frequencySchema });

function logCron(event: string, fields: Record<string, unknown>): void {
  // Single-line JSON so log drains can index cron runs without a logger dep.
  console.info(JSON.stringify({ event: `newsletter.cron.${event}`, ...fields }));
}

async function runNewsletter(frequency: 'daily' | 'weekly') {
  const startedAt = Date.now();
  try {
    // Unsubscribe/preferences links are app routes, so they must be built from
    // the app origin — never the docs origin or an unset public fallback.
    const siteUrl = process.env.APP_URL?.replace(/\/+$/, '');
    if (!siteUrl) {
      throw new ApiError(503, 'newsletter_unconfigured', 'Newsletter app URL is not configured.');
    }
    const generator = createNewsletterGenerator(siteUrl);
    const { queued, failed: queueFailed } = await queueNewsletterDeliveries(generator, frequency);
    const { sent, failed: sendFailed } = await processQueuedDeliveries(100, deliverEmail, siteUrl);
    const result = {
      success: true,
      frequency,
      queued,
      sent,
      failed: queueFailed + sendFailed,
      timestamp: new Date().toISOString(),
    };
    logCron('completed', { frequency, queued, sent, failed: result.failed, durationMs: Date.now() - startedAt });
    // Persist the run so admins can see which cron invocation queued/sent
    // what; failures are recorded too so silent cron breakage is visible.
    await audit({
      action: 'newsletter.cron.run',
      targetType: 'newsletter',
      metadata: { frequency, queued, sent, failed: result.failed, durationMs: Date.now() - startedAt },
    });
    return result;
  } catch (error) {
    logCron('failed', {
      frequency,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    await audit({
      action: 'newsletter.cron.failed',
      targetType: 'newsletter',
      metadata: {
        frequency,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
}


export async function GET(request: Request) {
  return handle(request, async () => {
    requireCronSecret(request);
    const parsed = frequencySchema.safeParse(new URL(request.url).searchParams.get('frequency'));
    if (!parsed.success) badRequest('Invalid frequency. Must be "daily" or "weekly".');
    return runNewsletter(parsed.data);
  }, { routeName: 'cron.newsletter.get' });
}

/**
 * Manual trigger endpoint for testing
 * POST /api/cron/newsletter with { frequency: "daily" | "weekly" }
 */
export async function POST(request: Request) {
  return handle(request, async () => {
    requireCronSecret(request);
    const body = await parseBody(request, postSchema);
    return runNewsletter(body.frequency);
  }, { routeName: 'cron.newsletter.post' });
}
