/**
 * Newsletter generation logic
 * Creates daily and weekly newsletters from content sources
 */

import { prisma } from '@slipstream-ui/db';
import type {
  NewsletterGenerationOptions,
  GeneratedNewsletter,
  UserWithPreferences,
  NewsletterContentType,
  NewsletterSubscription,
} from '../types';
import { ContentSourceRegistry, createDefaultRegistry } from '../lib/content-sources';
import { generateHtmlEmail, generateTextEmail, generateSubject, generatePreheader } from '../templates/email';
import { newsletterUnsubscribeUrl } from '../lib/unsubscribe-token';
import { parseContentTypes } from '../lib/preferences';

/**
 * Default content types for each frequency
 */
const DEFAULT_DAILY_TYPES: NewsletterContentType[] = ['audit_log', 'github'];
const DEFAULT_WEEKLY_TYPES: NewsletterContentType[] = ['audit_log', 'release', 'github', 'custom'];

/**
 * Newsletter generator class
 */
export class NewsletterGenerator {
  private registry: ContentSourceRegistry;
  private siteUrl: string;

  constructor(registry?: ContentSourceRegistry, siteUrl = 'https://slipstreamui.com') {
    this.registry = registry ?? createDefaultRegistry(
      process.env.GITHUB_TOKEN,
      process.env.GITHUB_OWNER,
      process.env.GITHUB_REPO
    );
    this.siteUrl = siteUrl;
  }

  /**
   * Generate newsletter for a specific user with their preferences
   */
  async generateForUser(
    user: UserWithPreferences,
    frequency: 'daily' | 'weekly'
  ): Promise<GeneratedNewsletter | null> {
    const prefs = user.preferences;
    if (!prefs) return null;

    // Check if user wants this frequency
    if (frequency === 'daily' && !prefs.dailyEnabled) return null;
    if (frequency === 'weekly' && !prefs.weeklyEnabled) return null;

    // Check if user has active subscription for this frequency
    const subscription = user.subscriptions.find(
      (s) => s.type === frequency && s.status === 'active'
    );
    if (!subscription) return null;

    // Determine content types based on user preferences
    const contentTypes = prefs.contentTypes.length > 0
      ? prefs.contentTypes
      : frequency === 'daily'
        ? DEFAULT_DAILY_TYPES
        : DEFAULT_WEEKLY_TYPES;

    return this.generate({
      frequency,
      userId: user.id,
      contentTypes,
      timezone: prefs.timezone,
    });
  }

  /**
   * Generate newsletter for all users (batch generation).
   *
   * Content fetches are the expensive part (DB queries, GitHub API calls)
   * and are identical for every user on the same content-type selection, so
   * users are grouped by their effective content types and each group shares
   * a single fetchAllContent call; only the per-user render (unsubscribe
   * URL, preferences) differs.
   */
  async generateForAllUsers(frequency: 'daily' | 'weekly'): Promise<Array<{ user: UserWithPreferences; newsletter: GeneratedNewsletter }>> {
    const users = await this.getUsersWithActiveSubscription(frequency);
    const groups = new Map<string, { contentTypes: NewsletterContentType[]; users: UserWithPreferences[] }>();

    for (const user of users) {
      const prefs = user.preferences;
      if (!prefs) continue;
      if (frequency === 'daily' && !prefs.dailyEnabled) continue;
      if (frequency === 'weekly' && !prefs.weeklyEnabled) continue;
      if (!user.subscriptions.some((s) => s.type === frequency && s.status === 'active')) continue;

      const contentTypes = prefs.contentTypes.length > 0
        ? prefs.contentTypes
        : frequency === 'daily'
          ? DEFAULT_DAILY_TYPES
          : DEFAULT_WEEKLY_TYPES;
      const key = [...contentTypes].sort().join(',');
      const group = groups.get(key) ?? { contentTypes, users: [] };
      group.users.push(user);
      groups.set(key, group);
    }

    const results: Array<{ user: UserWithPreferences; newsletter: GeneratedNewsletter }> = [];
    for (const group of groups.values()) {
      const items = await this.registry.fetchAllContent({ frequency, contentTypes: group.contentTypes });
      if (items.length === 0) continue;
      for (const user of group.users) {
        results.push({
          user,
          newsletter: this.renderNewsletter(items, {
            frequency,
            userId: user.id,
            timezone: user.preferences?.timezone,
          }),
        });
      }
    }
    return results;
  }

  /**
   * Generate newsletter content (core generation logic)
   */
  async generate(options: NewsletterGenerationOptions): Promise<GeneratedNewsletter | null> {
    const { frequency, contentTypes } = options;

    // Fetch content from all enabled sources
    const items = await this.registry.fetchAllContent({
      ...options,
      contentTypes: contentTypes ?? (frequency === 'daily' ? DEFAULT_DAILY_TYPES : DEFAULT_WEEKLY_TYPES),
    });

    // Filter out items if no content
    if (items.length === 0) {
      return null;
    }

    return this.renderNewsletter(items, options);
  }

  /**
   * Render a newsletter from already-fetched content items. Split from
   * generate() so batch generation can share one content fetch across users.
   */
  private renderNewsletter(
    items: Awaited<ReturnType<ContentSourceRegistry['fetchAllContent']>>,
    options: NewsletterGenerationOptions
  ): GeneratedNewsletter {
    const { frequency } = options;
    const date = new Date();
    let timeZone = 'UTC';
    if (options.timezone) {
      try {
        new Intl.DateTimeFormat('en-US', { timeZone: options.timezone });
        timeZone = options.timezone;
      } catch {
        // Invalid stored timezone falls back to UTC.
      }
    }
    const dateStr = date.toLocaleDateString('en-US', {
      timeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const subject = generateSubject(frequency, date, items.length);
    const preheader = generatePreheader(frequency, items.length);

    const templateData = {
      preheader,
      title: `Slipstream UI ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Digest`,
      items,
      frequency,
      date: dateStr,
      unsubscribeUrl: options.userId
        ? newsletterUnsubscribeUrl(this.siteUrl, options.userId, frequency)
        : `${this.siteUrl}/newsletter/unsubscribe`,
      preferencesUrl: `${this.siteUrl}/dashboard/settings/newsletter`,
      siteUrl: this.siteUrl,
    };

    const htmlContent = generateHtmlEmail(templateData);
    const textContent = generateTextEmail(templateData);

    return {
      subject,
      htmlContent,
      textContent,
      itemCount: items.length,
      contentTypes: [...new Set(items.map((i) => i.type))],
    };
  }

  /**
   * Get users with active subscription for a frequency
   */
  private async getUsersWithActiveSubscription(frequency: 'daily' | 'weekly'): Promise<UserWithPreferences[]> {
    const subscriptions = await prisma.newsletterSubscription.findMany({
      where: {
        type: frequency,
        status: 'active',
      },
      include: {
        user: {
          include: {
            newsletterPreferences: true,
          },
        },
      },
    });

    return subscriptions
      .map((sub) => ({
        id: sub.user.id,
        email: sub.user.email,
        name: sub.user.name,
        preferences: sub.user.newsletterPreferences
          ? {
              dailyEnabled: sub.user.newsletterPreferences.dailyEnabled,
              weeklyEnabled: sub.user.newsletterPreferences.weeklyEnabled,
              contentTypes: parseContentTypes(sub.user.newsletterPreferences.contentTypes),
              frequency: sub.user.newsletterPreferences.frequency as 'daily' | 'weekly' | 'both',
              timezone: sub.user.newsletterPreferences.timezone,
            }
          : null,
        // Prisma types the enum-ish columns as string; the package narrows them.
        subscriptions: [sub as unknown as NewsletterSubscription],
      }))
      .filter((u) => u.preferences !== null);
  }

  /**
   * Preview newsletter without sending (for testing)
   */
  async preview(frequency: 'daily' | 'weekly', contentTypes?: NewsletterContentType[]): Promise<GeneratedNewsletter | null> {
    return this.generate({
      frequency,
      contentTypes,
    });
  }
}

/**
 * Create newsletter generator with default configuration
 */
export function createNewsletterGenerator(siteUrl?: string): NewsletterGenerator {
  return new NewsletterGenerator(undefined, siteUrl);
}

function newsletterPeriodStart(frequency: 'daily' | 'weekly', now = new Date()): Date {
  const day = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (frequency === 'daily') return new Date(day);
  const weekday = (now.getUTCDay() + 6) % 7; // Monday = 0
  return new Date(day - weekday * 24 * 60 * 60 * 1000);
}

/**
 * Generate and queue newsletter deliveries for all eligible users
 */
export async function queueNewsletterDeliveries(
  generator: NewsletterGenerator,
  frequency: 'daily' | 'weekly'
): Promise<{ queued: number; failed: number }> {
  const results = await generator.generateForAllUsers(frequency);
  let queued = 0;
  let failed = 0;

  for (const { user, newsletter } of results) {
    try {
      // Find the user's subscription for this frequency
      const subscription = user.subscriptions.find((s) => s.type === frequency && s.status === 'active');
      if (!subscription) continue;

      // Idempotent per period: a scheduler retry or double-invocation must not
      // queue a second copy of the same digest for the same subscription.
      const periodStart = newsletterPeriodStart(frequency);
      const existing = await prisma.newsletterDelivery.findFirst({
        where: {
          userId: user.id,
          type: frequency,
          subscriptionId: subscription.id,
          status: { in: ['QUEUED', 'SENDING', 'SENT'] },
          createdAt: { gte: periodStart },
        },
        select: { id: true },
      });
      if (existing) continue;

      // Create delivery record
      await prisma.newsletterDelivery.create({
        data: {
          userId: user.id,
          subscriptionId: subscription.id,
          type: frequency,
          subject: newsletter.subject,
          htmlContent: newsletter.htmlContent,
          textContent: newsletter.textContent,
          status: 'QUEUED',
        },
      });
      queued++;
    } catch (error) {
      console.error(`Failed to queue newsletter for user ${user.id}:`, error);
      failed++;
    }
  }

  return { queued, failed };
}

/**
 * Process queued newsletter deliveries
 */
export async function processQueuedDeliveries(
  batchSize = 50,
  send?: (email: {
    to: string;
    kind: 'newsletter';
    subject: string;
    text: string;
    html?: string;
    headers?: Record<string, string>;
  }) => Promise<unknown>,
  /** App origin for List-Unsubscribe URLs; defaults to APP_URL. */
  siteUrl?: string,
): Promise<{ sent: number; failed: number; skipped: number }> {
  // Claim QUEUED rows (and SENDING rows abandoned by a crashed worker) so two
  // concurrent runs cannot send the same delivery twice. A SENDING row is
  // considered stale after 15 minutes.
  const staleBefore = new Date(Date.now() - 15 * 60 * 1000);
  const queued = await prisma.newsletterDelivery.findMany({
    where: {
      OR: [
        { status: 'QUEUED' },
        { status: 'SENDING', createdAt: { lt: staleBefore } },
      ],
    },
    take: batchSize,
    orderBy: { createdAt: 'asc' },
    include: { user: true, subscription: true },
  });

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const delivery of queued) {
    try {
      if (!send) {
        throw new Error('processQueuedDeliveries requires a send function (e.g. deliverEmail)');
      }
      // Atomically claim the row; a concurrent worker that already claimed
      // it sees count 0 and moves on.
      const claim = await prisma.newsletterDelivery.updateMany({
        where: { id: delivery.id, status: { in: ['QUEUED', 'SENDING'] } },
        data: { status: 'SENDING' },
      });
      if (claim.count === 0) {
        skipped++;
        continue;
      }
      // Consent can change after queueing: never send to a subscription that
      // is no longer active for this delivery type.
      if (!delivery.subscription || delivery.subscription.status !== 'active' || delivery.subscription.type !== delivery.type) {
        await prisma.newsletterDelivery.update({
          where: { id: delivery.id },
          data: { status: 'CANCELLED', error: 'recipient unsubscribed before send' },
        });
        skipped++;
        continue;
      }
      const appUrl = (siteUrl ?? process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://slipstreamui.com').replace(/\/+$/, '');
      const unsubscribeUrl = newsletterUnsubscribeUrl(appUrl, delivery.userId, delivery.type as 'daily' | 'weekly');

      await send({
        to: delivery.user.email,
        kind: 'newsletter',
        subject: delivery.subject,
        text: delivery.textContent,
        html: delivery.htmlContent,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      });

      await prisma.newsletterDelivery.update({
        where: { id: delivery.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
      sent++;
    } catch (error) {
      await prisma.newsletterDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : String(error),
        },
      });
      failed++;
    }
  }

  return { sent, failed, skipped };
}