/**
 * Newsletter generator tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NewsletterGenerator, createNewsletterGenerator, queueNewsletterDeliveries, processQueuedDeliveries, newsletterPeriodKey, sendWindowAllows } from '../generators/newsletter';
import { prisma } from '@slipstream-ui/db';
import type { GeneratedNewsletter, UserWithPreferences, NewsletterContentItem } from '../types';

// Mock dependencies
vi.mock('@slipstream-ui/db', () => ({
  prisma: {
    newsletterSubscription: {
      findMany: vi.fn(),
    },
    newsletterDelivery: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock('../lib/content-sources', () => ({
  ContentSourceRegistry: vi.fn().mockImplementation(() => ({
    fetchAllContent: vi.fn(),
    getAllSources: vi.fn(),
  })),
  createDefaultRegistry: vi.fn(),
}));


// Unsubscribe links are HMAC-signed; tests need a deterministic secret.
process.env.NEWSLETTER_UNSUBSCRIBE_SECRET = 'test-unsubscribe-secret';

describe('NewsletterGenerator', () => {
  const mockUser: UserWithPreferences = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    preferences: {
      dailyEnabled: true,
      weeklyEnabled: true,
      contentTypes: ['audit_log', 'release', 'github', 'custom'],
      frequency: 'both',
      timezone: 'America/Denver',
    },
    subscriptions: [
      { id: 'sub-1', userId: 'user-1', type: 'daily', status: 'active', createdAt: new Date(), updatedAt: new Date() },
      { id: 'sub-2', userId: 'user-1', type: 'weekly', status: 'active', createdAt: new Date(), updatedAt: new Date() },
    ],
  };

  const mockItems: NewsletterContentItem[] = [
    {
      id: 'item-1',
      type: 'audit_log',
      title: 'User Login',
      summary: 'test@example.com logged in',
      url: 'https://example.com/audit/1',
      metadata: {},
      publishedAt: new Date(),
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateForUser', () => {
    it('returns null when user has no preferences', async () => {
      const userWithoutPrefs: UserWithPreferences = {
        ...mockUser,
        preferences: null,
      };

      const generator = new NewsletterGenerator();
      const result = await generator.generateForUser(userWithoutPrefs, 'daily');
      expect(result).toBeNull();
    });

    it('returns null when frequency is disabled', async () => {
      const userNoDaily: UserWithPreferences = {
        ...mockUser,
        preferences: { ...mockUser.preferences!, dailyEnabled: false },
      };

      const generator = new NewsletterGenerator();
      const result = await generator.generateForUser(userNoDaily, 'daily');
      expect(result).toBeNull();
    });

    it('returns null when no active subscription', async () => {
      const userNoSub: UserWithPreferences = {
        ...mockUser,
        subscriptions: [],
      };

      const generator = new NewsletterGenerator();
      const result = await generator.generateForUser(userNoSub, 'daily');
      expect(result).toBeNull();
    });

    it('generates newsletter when all conditions met', async () => {
      const registry = {
        fetchAllContent: vi.fn().mockResolvedValue(mockItems),
      };

      const generator = new NewsletterGenerator(registry as unknown as ConstructorParameters<typeof NewsletterGenerator>[0]);
      const result = await generator.generateForUser(mockUser, 'daily');

      expect(result).not.toBeNull();
      expect(result!.subject).toContain('Daily Slipstream UI Digest');
      expect(result!.htmlContent).toContain('User Login');
      expect(result!.textContent).toContain('User Login');
      expect(result!.itemCount).toBe(1);
    });

    it('uses user content type preferences', async () => {
      const registry = {
        fetchAllContent: vi.fn().mockResolvedValue(mockItems),
      };

      const userWithCustomTypes: UserWithPreferences = {
        ...mockUser,
        preferences: { ...mockUser.preferences!, contentTypes: ['audit_log'] },
      };

      const generator = new NewsletterGenerator(registry as unknown as ConstructorParameters<typeof NewsletterGenerator>[0]);
      await generator.generateForUser(userWithCustomTypes, 'daily');

      expect(registry.fetchAllContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contentTypes: ['audit_log'],
        })
      );
    });
  });

  describe('generate', () => {
    it('returns null when no content items', async () => {
      const registry = {
        fetchAllContent: vi.fn().mockResolvedValue([]),
      };

      const generator = new NewsletterGenerator(registry as unknown as ConstructorParameters<typeof NewsletterGenerator>[0]);
      const result = await generator.generate({ frequency: 'daily' });

      expect(result).toBeNull();
    });

    it('generates newsletter with content', async () => {
      const registry = {
        fetchAllContent: vi.fn().mockResolvedValue(mockItems),
      };

      const generator = new NewsletterGenerator(registry as unknown as ConstructorParameters<typeof NewsletterGenerator>[0]);
      const result = await generator.generate({ frequency: 'daily' });

      expect(result).not.toBeNull();
      expect(result!.itemCount).toBe(1);
      expect(result!.contentTypes).toEqual(['audit_log']);
    });

    it('uses default content types for daily', async () => {
      const registry = {
        fetchAllContent: vi.fn().mockResolvedValue(mockItems),
      };

      const generator = new NewsletterGenerator(registry as unknown as ConstructorParameters<typeof NewsletterGenerator>[0]);
      await generator.generate({ frequency: 'daily' });

      expect(registry.fetchAllContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contentTypes: ['audit_log', 'github'],
        })
      );
    });

    it('uses default content types for weekly', async () => {
      const registry = {
        fetchAllContent: vi.fn().mockResolvedValue(mockItems),
      };

      const generator = new NewsletterGenerator(registry as unknown as ConstructorParameters<typeof NewsletterGenerator>[0]);
      await generator.generate({ frequency: 'weekly' });

      expect(registry.fetchAllContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contentTypes: ['audit_log', 'release', 'github', 'custom'],
        })
      );
    });

    it('uses custom content types when provided', async () => {
      const registry = {
        fetchAllContent: vi.fn().mockResolvedValue(mockItems),
      };

      const generator = new NewsletterGenerator(registry as unknown as ConstructorParameters<typeof NewsletterGenerator>[0]);
      await generator.generate({
        frequency: 'daily',
        contentTypes: ['release', 'custom'],
      });

      expect(registry.fetchAllContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contentTypes: ['release', 'custom'],
        })
      );
    });
  });

  describe('generateForAllUsers', () => {
    it('fetches shared content once per content-type group', async () => {
      const registry = { fetchAllContent: vi.fn().mockResolvedValue(mockItems) };
      const generator = new NewsletterGenerator(registry as unknown as ConstructorParameters<typeof NewsletterGenerator>[0]);
      const preferences = {
        dailyEnabled: true,
        weeklyEnabled: true,
        contentTypes: JSON.stringify(['audit_log']),
        frequency: 'both',
        timezone: 'UTC',
      };
      const subscriptionRow = (userId: string) => ({
        id: `sub-${userId}`,
        userId,
        type: 'daily',
        status: 'active',
        user: { id: userId, email: `${userId}@example.com`, name: null, newsletterPreferences: preferences },
      });
      vi.mocked(prisma.newsletterSubscription.findMany).mockResolvedValue([
        subscriptionRow('u1'),
        subscriptionRow('u2'),
      ] as never);

      const results = await generator.generateForAllUsers('daily');

      expect(results).toHaveLength(2);
      expect(registry.fetchAllContent).toHaveBeenCalledTimes(1);
      // Each user still gets their own unsubscribe URL.
      expect(results[0].newsletter.htmlContent).toContain('u1');
      expect(results[1].newsletter.htmlContent).toContain('u2');
    });
  });

  describe('createNewsletterGenerator', () => {
    it('creates generator with default registry', () => {
      const generator = createNewsletterGenerator();
      expect(generator).toBeInstanceOf(NewsletterGenerator);
    });

    it('creates generator with custom site URL', () => {
      const generator = createNewsletterGenerator('https://custom.example.com');
      expect(generator).toBeInstanceOf(NewsletterGenerator);
    });
  });

  describe('queueNewsletterDeliveries', () => {
    const newsletter = {
      subject: 'Digest',
      htmlContent: '<p>h</p>',
      textContent: 't',
      itemCount: 1,
      contentTypes: ['audit_log'],
    } as GeneratedNewsletter;

    function generatorReturning() {
      return {
        generateForAllUsers: vi.fn().mockResolvedValue([{ user: mockUser, newsletter }]),
      } as unknown as NewsletterGenerator;
    }

    it('queues a delivery when none exists for the period', async () => {
      vi.mocked(prisma.newsletterDelivery.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.newsletterDelivery.create).mockResolvedValue({ id: 'delivery-1' } as never);
      const result = await queueNewsletterDeliveries(generatorReturning(), 'daily');
      expect(result).toEqual({ queued: 1, failed: 0 });
      expect(prisma.newsletterDelivery.create).toHaveBeenCalledTimes(1);
    });

    it('skips users already queued or sent this period', async () => {
      vi.mocked(prisma.newsletterDelivery.findFirst).mockResolvedValue({ id: 'existing' } as never);
      const result = await queueNewsletterDeliveries(generatorReturning(), 'daily');
      expect(result).toEqual({ queued: 0, failed: 0 });
      expect(prisma.newsletterDelivery.create).not.toHaveBeenCalled();
    });
  });

  describe('processQueuedDeliveries', () => {
    const queuedDelivery = {
      id: 'delivery-1',
      userId: 'user-1',
      type: 'daily',
      subject: 'Digest',
      textContent: 't',
      htmlContent: 'h',
      user: { email: 'test@example.com' },
      subscription: { status: 'active', type: 'daily' },
    };

    beforeEach(() => {
      vi.mocked(prisma.newsletterDelivery.updateMany).mockResolvedValue({ count: 1 });
    });

    it('claims the row before sending and marks it SENT', async () => {
      vi.mocked(prisma.newsletterDelivery.findMany).mockResolvedValue([queuedDelivery] as never);
      vi.mocked(prisma.newsletterDelivery.update).mockResolvedValue({} as never);
      const send = vi.fn().mockResolvedValue(undefined);
      const result = await processQueuedDeliveries(10, send as never);
      expect(send).toHaveBeenCalledTimes(1);
      expect(prisma.newsletterDelivery.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'delivery-1',
          OR: [
            { status: 'QUEUED' },
            { status: 'SENDING', OR: [{ claimedAt: null }, { claimedAt: { lt: expect.any(Date) } }] },
          ],
        },
        data: { status: 'SENDING', claimedAt: expect.any(Date), attempts: { increment: 1 } },
      });
      expect(result).toEqual({ sent: 1, failed: 0, skipped: 0 });
      expect(prisma.newsletterDelivery.update).toHaveBeenCalledWith({
        where: { id: 'delivery-1' },
        data: { status: 'SENT', sentAt: expect.any(Date) },
      });
    });

    it('skips deliveries already claimed by another worker', async () => {
      vi.mocked(prisma.newsletterDelivery.findMany).mockResolvedValue([queuedDelivery] as never);
      vi.mocked(prisma.newsletterDelivery.updateMany).mockResolvedValue({ count: 0 });
      const send = vi.fn();
      const result = await processQueuedDeliveries(10, send as never);
      expect(send).not.toHaveBeenCalled();
      expect(result).toEqual({ sent: 0, failed: 0, skipped: 1 });
    });

    it('cancels queued mail when the subscription is no longer active', async () => {
      vi.mocked(prisma.newsletterDelivery.findMany).mockResolvedValue([
        { ...queuedDelivery, subscription: { status: 'unsubscribed', type: 'daily' } },
      ] as never);
      const send = vi.fn();
      const result = await processQueuedDeliveries(10, send as never);
      expect(send).not.toHaveBeenCalled();
      expect(result).toEqual({ sent: 0, failed: 0, skipped: 1 });
      expect(prisma.newsletterDelivery.update).toHaveBeenCalledWith({
        where: { id: 'delivery-1' },
        data: { status: 'CANCELLED', error: 'recipient unsubscribed before send' },
      });
    });

    it('requeues a failed send while under the attempt cap', async () => {
      vi.mocked(prisma.newsletterDelivery.findMany).mockResolvedValue([queuedDelivery] as never);
      vi.mocked(prisma.newsletterDelivery.update)
        .mockResolvedValueOnce({ attempts: 1 } as never)
        .mockResolvedValue({} as never);
      const send = vi.fn().mockRejectedValue(new Error('smtp down'));
      const result = await processQueuedDeliveries(10, send as never);
      expect(result).toEqual({ sent: 0, failed: 1, skipped: 0 });
      expect(prisma.newsletterDelivery.update).toHaveBeenLastCalledWith({
        where: { id: 'delivery-1' },
        data: { status: 'QUEUED', claimedAt: null },
      });
    });

    it('dead-letters as FAILED once the attempt cap is reached', async () => {
      vi.mocked(prisma.newsletterDelivery.findMany).mockResolvedValue([queuedDelivery] as never);
      vi.mocked(prisma.newsletterDelivery.update)
        .mockResolvedValueOnce({ attempts: 3 } as never)
        .mockResolvedValue({} as never);
      const send = vi.fn().mockRejectedValue(new Error('smtp down'));
      const result = await processQueuedDeliveries(10, send as never);
      expect(result).toEqual({ sent: 0, failed: 1, skipped: 0 });
      expect(prisma.newsletterDelivery.update).toHaveBeenLastCalledWith({
        where: { id: 'delivery-1' },
        data: { status: 'FAILED', claimedAt: null },
      });
    });
  });
});

describe('newsletterPeriodKey', () => {
  it('buckets daily sends by UTC date', () => {
    expect(newsletterPeriodKey('daily', new Date('2026-11-22T15:04:05Z'))).toBe('daily:2026-11-22');
  });

  it('buckets weekly sends by ISO week starting Monday', () => {
    // 2026-11-22 is a Sunday; its period started Monday 2026-11-16 (ISO week 47).
    expect(newsletterPeriodKey('weekly', new Date('2026-11-22T15:04:05Z'))).toBe('weekly:2026-W47');
    // Monday of the same week gives the same key.
    expect(newsletterPeriodKey('weekly', new Date('2026-11-16T00:00:00Z'))).toBe('weekly:2026-W47');
  });
});

describe('sendWindowAllows', () => {
  afterEach(() => vi.unstubAllEnvs());
  const at = (iso: string) => new Date(iso);

  it('allows everything by default (0-23)', () => {
    vi.stubEnv('NEWSLETTER_SEND_WINDOW', '0-23');
    expect(sendWindowAllows('America/Denver', at('2026-11-22T03:00:00Z'))).toBe(true);
  });

  it('filters by the recipient-local hour', () => {
    vi.stubEnv('NEWSLETTER_SEND_WINDOW', '8-21');
    // 15:00 UTC = 08:00 in America/Denver (MST, UTC-7 in November).
    expect(sendWindowAllows('America/Denver', at('2026-11-22T15:00:00Z'))).toBe(true);
    // 04:00 UTC = 21:00 previous day local — outside the window.
    expect(sendWindowAllows('America/Denver', at('2026-11-22T04:00:00Z'))).toBe(false);
  });

  it('honors the user timezone over UTC', () => {
    vi.stubEnv('NEWSLETTER_SEND_WINDOW', '8-21');
    // 02:00 UTC is 20:00 in Denver (inside) but 02:00 in UTC (outside).
    expect(sendWindowAllows('America/Denver', at('2026-11-22T02:00:00Z'))).toBe(true);
    expect(sendWindowAllows('UTC', at('2026-11-22T02:00:00Z'))).toBe(false);
  });

  it('falls back to UTC for an invalid stored timezone', () => {
    vi.stubEnv('NEWSLETTER_SEND_WINDOW', '8-21');
    expect(sendWindowAllows('Not/AZone', at('2026-11-22T12:00:00Z'))).toBe(true);
  });
});

