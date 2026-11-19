/**
 * Newsletter preferences API
 * GET: Get current user's newsletter preferences
 * PATCH: Update newsletter preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import {
  getNewsletterPreferences,
  updateNewsletterPreferences,
  getAvailableContentTypes,
  getAvailableFrequencies,
} from '@slipstream-ui/newsletter';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await getNewsletterPreferences(user.id);
    const contentTypes = getAvailableContentTypes();
    const frequencies = getAvailableFrequencies();

    return NextResponse.json({
      preferences,
      contentTypes,
      frequencies,
    });
  } catch (error) {
    console.error('Failed to get newsletter preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dailyEnabled, weeklyEnabled, contentTypes, frequency, timezone } = body;

    const preferences = await updateNewsletterPreferences(user.id, {
      dailyEnabled,
      weeklyEnabled,
      contentTypes,
      frequency,
      timezone,
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Failed to update newsletter preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}