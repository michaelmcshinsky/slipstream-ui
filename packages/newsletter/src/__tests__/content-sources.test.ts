/**
 * Newsletter content sources tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuditLogContentSource, ReleaseContentSource, CustomContentSource, createDefaultRegistry } from '../lib/content-sources';
import type { NewsletterGenerationOptions } from '../types';

// Mock Prisma
vi.mock('@slipstream-ui/db', () => ({
  prisma: {
    auditLog: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '@slipstream-ui/db';

describe('Content Sources', () => {
  const mockAuditLogs = [
    {
      id: 'log-1',
      action: 'user.login',
      targetType: 'User',
      targetId: 'user-1',
      metadata: JSON.stringify({ ip: '192.168.1.1' }),
      createdAt: new Date('2024-01-15T10:00:00Z'),
      actorId: 'user-1',
    },
    {
      id: 'log-2',
      action: 'team.created',
      targetType: 'Team',
      targetId: 'team-1',
      metadata: null,
      createdAt: new Date('2024-01-15T11:00:00Z'),
      actorId: 'user-1',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuditLogContentSource', () => {
    const source = new AuditLogContentSource();

    it('returns correct content type', () => {
      expect(source.getContentType()).toBe('audit_log');
    });

    it('fetches and formats audit logs', async () => {
      vi.mocked(prisma.auditLog.findMany).mockResolvedValue(mockAuditLogs);

      const options: NewsletterGenerationOptions = {
        frequency: 'daily',
        since: new Date('2024-01-15T00:00:00Z'),
        until: new Date('2024-01-15T23:59:59Z'),
      };

      const items = await source.fetchContent(options);

      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({
        id: 'log-1',
        type: 'audit_log',
        title: 'User Login',
        summary: expect.stringContaining('user.login'),
      });
      expect(items[0].metadata).toEqual({
        action: 'user.login',
        targetType: 'User',
        targetId: 'user-1',
        actorId: 'user-1',
        metadata: { ip: '192.168.1.1' },
      });
      expect(items[1].title).toBe('Team Created');
    });

    it('filters by date range', async () => {
      vi.mocked(prisma.auditLog.findMany).mockResolvedValue(mockAuditLogs);

      const options: NewsletterGenerationOptions = {
        frequency: 'daily',
        since: new Date('2024-01-15T00:00:00Z'),
        until: new Date('2024-01-15T23:59:59Z'),
      };

      await source.fetchContent(options);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: {
              gte: options.since,
              lte: options.until,
            },
          }),
        })
      );
    });

    it('only includes relevant actions', async () => {
      vi.mocked(prisma.auditLog.findMany).mockResolvedValue(mockAuditLogs);

      await source.fetchContent({ frequency: 'daily' });

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: { in: expect.arrayContaining(['user.login', 'team.invite.accepted', 'team.created']) },
          }),
        })
      );
    });

    it('returns empty array when no logs', async () => {
      vi.mocked(prisma.auditLog.findMany).mockResolvedValue([]);

      const items = await source.fetchContent({ frequency: 'daily' });
      expect(items).toHaveLength(0);
    });
  });

  describe('ReleaseContentSource', () => {
    const source = new ReleaseContentSource();

    it('returns correct content type', () => {
      expect(source.getContentType()).toBe('release');
    });

    it('returns empty array (placeholder implementation)', async () => {
      const items = await source.fetchContent({ frequency: 'weekly' });
      expect(items).toHaveLength(0);
    });
  });

  describe('CustomContentSource', () => {
    const source = new CustomContentSource();

    it('returns correct content type', () => {
      expect(source.getContentType()).toBe('custom');
    });

    it('returns empty array (placeholder implementation)', async () => {
      const items = await source.fetchContent({ frequency: 'weekly' });
      expect(items).toHaveLength(0);
    });
  });

  describe('createDefaultRegistry', () => {
    it('creates registry with default sources when GitHub is not configured', () => {
      const registry = createDefaultRegistry();
      const sources = registry.getAllSources();

      expect(sources).toHaveLength(3);
      expect(sources.map((s) => s.getContentType())).toEqual(['audit_log', 'release', 'custom']);
    });

    it('includes GitHub source when token provided', () => {
      const registry = createDefaultRegistry('token', 'owner', 'repo');
      const sources = registry.getAllSources();

      expect(sources).toHaveLength(4);
      expect(sources.map((s) => s.getContentType())).toContain('github');
    });

    it('excludes GitHub source when token not provided', () => {
      const registry = createDefaultRegistry();
      const githubSource = registry.getSource('github');
      expect(githubSource).toBeUndefined();
    });
  });
});