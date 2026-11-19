/**
 * Newsletter generator tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsletterGenerator, createNewsletterGenerator } from '../generators/newsletter';
import type { UserWithPreferences, NewsletterContentItem } from '../types';

// Mock dependencies
vi.mock('@slipstream-ui/db', () => ({
  prisma: {
    newsletterSubscription: {
      findMany: vi.fn(),
    },
    newsletterDelivery: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
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
});