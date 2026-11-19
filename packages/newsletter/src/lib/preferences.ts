/**
 * Newsletter preferences management
 * Handles user preferences for daily/weekly newsletters and content types
 */

import { prisma } from '@slipstream-ui/db';
import type { NewsletterPreferences, NewsletterContentType, NewsletterFrequency } from '../types';

export const DEFAULT_PREFERENCES: NewsletterPreferences = {
  dailyEnabled: false,
  weeklyEnabled: true,
  contentTypes: ['audit_log', 'release', 'github', 'custom'],
  frequency: 'weekly',
  timezone: 'America/Denver',
};

export const VALID_CONTENT_TYPES: NewsletterContentType[] = ['audit_log', 'release', 'github', 'custom'];
export const VALID_FREQUENCIES: NewsletterFrequency[] = ['daily', 'weekly', 'both'];

/**
 * Get user's newsletter preferences
 */
export async function getNewsletterPreferences(userId: string): Promise<NewsletterPreferences> {
  const prefs = await prisma.newsletterPreference.findUnique({
    where: { userId },
  });

  if (!prefs) {
    return DEFAULT_PREFERENCES;
  }

  return {
    dailyEnabled: prefs.dailyEnabled,
    weeklyEnabled: prefs.weeklyEnabled,
    contentTypes: JSON.parse(prefs.contentTypes) as NewsletterContentType[],
    frequency: prefs.frequency as NewsletterFrequency,
    timezone: prefs.timezone,
  };
}

/**
 * Update user's newsletter preferences
 */
export async function updateNewsletterPreferences(
  userId: string,
  updates: Partial<NewsletterPreferences>
): Promise<NewsletterPreferences> {
  // Validate content types
  if (updates.contentTypes) {
    const invalid = updates.contentTypes.filter((t) => !VALID_CONTENT_TYPES.includes(t));
    if (invalid.length > 0) {
      throw new Error(`Invalid content types: ${invalid.join(', ')}`);
    }
  }

  // Validate frequency
  if (updates.frequency && !VALID_FREQUENCIES.includes(updates.frequency)) {
    throw new Error(`Invalid frequency: ${updates.frequency}`);
  }

  // Validate timezone (basic check)
  if (updates.timezone) {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: updates.timezone });
    } catch {
      throw new Error(`Invalid timezone: ${updates.timezone}`);
    }
  }

  const prefs = await prisma.newsletterPreference.upsert({
    where: { userId },
    update: {
      ...(updates.dailyEnabled !== undefined && { dailyEnabled: updates.dailyEnabled }),
      ...(updates.weeklyEnabled !== undefined && { weeklyEnabled: updates.weeklyEnabled }),
      ...(updates.contentTypes !== undefined && { contentTypes: JSON.stringify(updates.contentTypes) }),
      ...(updates.frequency !== undefined && { frequency: updates.frequency }),
      ...(updates.timezone !== undefined && { timezone: updates.timezone }),
    },
    create: {
      userId,
      dailyEnabled: updates.dailyEnabled ?? DEFAULT_PREFERENCES.dailyEnabled,
      weeklyEnabled: updates.weeklyEnabled ?? DEFAULT_PREFERENCES.weeklyEnabled,
      contentTypes: JSON.stringify(updates.contentTypes ?? DEFAULT_PREFERENCES.contentTypes),
      frequency: updates.frequency ?? DEFAULT_PREFERENCES.frequency,
      timezone: updates.timezone ?? DEFAULT_PREFERENCES.timezone,
    },
  });

  return {
    dailyEnabled: prefs.dailyEnabled,
    weeklyEnabled: prefs.weeklyEnabled,
    contentTypes: JSON.parse(prefs.contentTypes) as NewsletterContentType[],
    frequency: prefs.frequency as NewsletterFrequency,
    timezone: prefs.timezone,
  };
}

/**
 * Subscribe user to a newsletter frequency
 */
export async function subscribeToNewsletter(userId: string, type: 'daily' | 'weekly'): Promise<void> {
  await prisma.newsletterSubscription.upsert({
    where: {
      userId_type: { userId, type },
    },
    update: {
      status: 'active',
      unsubscribedAt: null,
    },
    create: {
      userId,
      type,
      status: 'active',
    },
  });

  // Also update preferences to enable this frequency
  if (type === 'daily') {
    await updateNewsletterPreferences(userId, { dailyEnabled: true });
  } else {
    await updateNewsletterPreferences(userId, { weeklyEnabled: true });
  }
}

/**
 * Unsubscribe user from a newsletter frequency
 */
export async function unsubscribeFromNewsletter(userId: string, type: 'daily' | 'weekly'): Promise<void> {
  // Upsert so unsubscribing is idempotent even when no subscription row exists.
  await prisma.newsletterSubscription.upsert({
    where: {
      userId_type: { userId, type },
    },
    create: {
      userId,
      type,
      status: 'unsubscribed',
      unsubscribedAt: new Date(),
    },
    update: {
      status: 'unsubscribed',
      unsubscribedAt: new Date(),
    },
  });

  // Also update preferences to disable this frequency
  if (type === 'daily') {
    await updateNewsletterPreferences(userId, { dailyEnabled: false });
  } else {
    await updateNewsletterPreferences(userId, { weeklyEnabled: false });
  }
}

/**
 * Get user's newsletter subscriptions
 */
export async function getNewsletterSubscriptions(userId: string) {
  return prisma.newsletterSubscription.findMany({
    where: { userId },
    orderBy: { type: 'asc' },
  });
}

/**
 * Check if user is subscribed to a frequency
 */
export async function isSubscribed(userId: string, type: 'daily' | 'weekly'): Promise<boolean> {
  const sub = await prisma.newsletterSubscription.findUnique({
    where: { userId_type: { userId, type } },
  });
  return sub?.status === 'active';
}

/**
 * Get available content types with descriptions
 */
export function getAvailableContentTypes(): Array<{ type: NewsletterContentType; label: string; description: string }> {
  return [
    {
      type: 'audit_log',
      label: 'Platform Activity',
      description: 'User logins, team changes, deployments, and other platform activity',
    },
    {
      type: 'release',
      label: 'Releases & Changelog',
      description: 'New versions, feature releases, and breaking changes',
    },
    {
      type: 'github',
      label: 'GitHub Activity',
      description: 'Commits, pull requests, and releases from the repository',
    },
    {
      type: 'custom',
      label: 'Announcements',
      description: 'Blog posts, product announcements, and documentation updates',
    },
  ];
}

/**
 * Get available frequencies with descriptions
 */
export function getAvailableFrequencies(): Array<{ value: NewsletterFrequency; label: string; description: string }> {
  return [
    {
      value: 'daily',
      label: 'Daily',
      description: 'Receive updates every morning with the last 24 hours of activity',
    },
    {
      value: 'weekly',
      label: 'Weekly',
      description: 'Receive a weekly digest every Monday with the last 7 days of updates',
    },
    {
      value: 'both',
      label: 'Daily + Weekly',
      description: 'Receive both daily updates and weekly summaries',
    },
  ];
}