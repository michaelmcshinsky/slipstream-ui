/**
 * Newsletter cron job endpoint
 * Called by OpenWork Automation on schedule
 * GET /api/cron/newsletter?frequency=daily|weekly with Authorization: Bearer <secret>
 */

import { createHash, timingSafeEqual } from 'node:crypto';
import { createNewsletterGenerator, queueNewsletterDeliveries, processQueuedDeliveries } from '@slipstream-ui/newsletter';
import { deliverEmail } from '@/lib/email';
import { handle, z, badRequest } from '@/lib/api/handle';
import { errors, parseBody, ApiError } from '@/lib/api/core';

const frequencySchema = z.enum(['daily', 'weekly']);
const postSchema = z.object({ frequency: frequencySchema });

function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

function secretMatches(provided: string | null): boolean {
  const expected = process.env.NEWSLETTER_CRON_SECRET;
  if (!expected || !provided) return false;
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

function requireCronSecret(request: Request): void {
  if (!secretMatches(bearerToken(request))) {
    throw errors.unauthorized('Unauthorized.');
  }
}

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
    return result;
  } catch (error) {
    logCron('failed', {
      frequency,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
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
