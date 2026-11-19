/**
 * Newsletter cron job endpoint
 * Called by OpenWork Automation on schedule
 * GET /api/cron/newsletter?frequency=daily|weekly&secret=...
 */

import { NextRequest, NextResponse } from 'next/server';
import { createNewsletterGenerator, queueNewsletterDeliveries, processQueuedDeliveries } from '@slipstream-ui/newsletter';
import { deliverEmail } from '@/lib/email';

const CRON_SECRET = process.env.NEWSLETTER_CRON_SECRET;

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const frequency = searchParams.get('frequency') as 'daily' | 'weekly' | null;

    if (!CRON_SECRET || secret !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!frequency || !['daily', 'weekly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency. Must be "daily" or "weekly"' }, { status: 400 });
    }

    // Generate and queue newsletters
    const generator = createNewsletterGenerator(process.env.NEXT_PUBLIC_APP_URL);
    const { queued, failed: queueFailed } = await queueNewsletterDeliveries(generator, frequency);

    // Process queued deliveries
    const { sent, failed: sendFailed } = await processQueuedDeliveries(100, deliverEmail);

    return NextResponse.json({
      success: true,
      frequency,
      queued,
      sent,
      failed: queueFailed + sendFailed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Newsletter cron job failed:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger endpoint for testing
 * POST /api/cron/newsletter with { frequency: "daily" | "weekly" }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${CRON_SECRET}`;

    if (!CRON_SECRET || authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const frequency = body.frequency as 'daily' | 'weekly' | null;

    if (!frequency || !['daily', 'weekly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency. Must be "daily" or "weekly"' }, { status: 400 });
    }

    // Generate and queue newsletters
    const generator = createNewsletterGenerator(process.env.NEXT_PUBLIC_APP_URL);
    const { queued, failed: queueFailed } = await queueNewsletterDeliveries(generator, frequency);

    // Process queued deliveries
    const { sent, failed: sendFailed } = await processQueuedDeliveries(100, deliverEmail);

    return NextResponse.json({
      success: true,
      frequency,
      queued,
      sent,
      failed: queueFailed + sendFailed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Newsletter manual trigger failed:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}