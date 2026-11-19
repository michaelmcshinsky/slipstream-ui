/**
 * Newsletter unsubscribe API
 * POST: Unsubscribe current user from a newsletter frequency
 * GET:  Unsubscribe via signed token (for email links; shows a confirm page)
 * POST (token): One-click unsubscribe for mail clients (RFC 8058)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import {
  unsubscribeFromNewsletter,
  verifyNewsletterUnsubscribeToken,
  type NewsletterUnsubscribeType,
} from '@slipstream-ui/newsletter';

function htmlPage(title: string, body: string, status = 200): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:80px auto;padding:0 16px;color:#1f2937"><h1 style="font-size:20px">${title}</h1>${body}</body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

function isNewsletterType(value: string | null): value is NewsletterUnsubscribeType {
  return value === 'daily' || value === 'weekly';
}

export async function POST(request: NextRequest) {
  // Token flow first: mail clients POST here with no session (RFC 8058).
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token')) {
    return handleTokenPost(request);
  }

  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type } = body;

    if (!isNewsletterType(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be "daily" or "weekly"' }, { status: 400 });
    }

    await unsubscribeFromNewsletter(user.id, type);

    return NextResponse.json({ success: true, type });
  } catch (error) {
    console.error('Failed to unsubscribe from newsletter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/newsletter/unsubscribe?token=...&type=daily|weekly
 * Shows a confirmation page; the form POSTs back to the same URL.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (!token || !isNewsletterType(type) || !verifyNewsletterUnsubscribeToken(token, type)) {
      return htmlPage('Invalid unsubscribe link', '<p>This link is invalid or has expired.</p>', 400);
    }

    const action = `/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}&type=${type}`;
    return htmlPage(
      'Unsubscribe',
      `<p>Stop receiving the ${type} newsletter?</p><form method="POST" action="${action}"><button type="submit" style="padding:10px 20px;font-size:15px;cursor:pointer">Unsubscribe</button></form>`,
    );
  } catch (error) {
    console.error('Failed to render unsubscribe page:', error);
    return htmlPage('Error', '<p>An error occurred. Please try again or contact support.</p>', 500);
  }
}

/**
 * POST /api/newsletter/unsubscribe?token=...&type=daily|weekly
 * One-click opt-out for mail clients (RFC 8058 List-Unsubscribe-Post).
 * Also serves the confirm form above.
 */
async function handleTokenPost(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    const userId =
      token && isNewsletterType(type) ? verifyNewsletterUnsubscribeToken(token, type) : null;
    if (!userId || !isNewsletterType(type)) {
      return htmlPage('Invalid unsubscribe link', '<p>This link is invalid or has expired.</p>', 400);
    }

    await unsubscribeFromNewsletter(userId, type);

    return htmlPage(
      'Unsubscribed',
      `<p>You have been unsubscribed from the ${type} newsletter.</p><p><a href="/dashboard/settings/newsletter">Manage other subscriptions</a></p>`,
    );
  } catch (error) {
    console.error('Failed to unsubscribe via link:', error);
    return htmlPage('Error', '<p>An error occurred. Please try again or contact support.</p>', 500);
  }
}
