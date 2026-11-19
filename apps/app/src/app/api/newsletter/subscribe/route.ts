/**
 * Newsletter subscribe API
 * POST: Subscribe current user to a newsletter frequency
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { subscribeToNewsletter } from '@slipstream-ui/newsletter';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type } = body;

    if (!type || !['daily', 'weekly'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be "daily" or "weekly"' }, { status: 400 });
    }

    await subscribeToNewsletter(user.id, type);

    return NextResponse.json({ success: true, type });
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}