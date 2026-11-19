/**
 * Content sources for newsletter generation
 * Each source fetches content from different data sources
 */

import { prisma } from '@slipstream-ui/db';
import type {
  NewsletterContentItem,
  NewsletterContentType,
  NewsletterGenerationOptions,
  ContentSource,
} from '../types';

/**
 * Audit Log content source - fetches recent audit log entries
 */
export class AuditLogContentSource implements ContentSource {
  getContentType(): NewsletterContentType {
    return 'audit_log';
  }

  async fetchContent(options: NewsletterGenerationOptions): Promise<NewsletterContentItem[]> {
    const since = options.since ?? new Date(Date.now() - (options.frequency === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000));
    const until = options.until ?? new Date();

    const logs = await prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: since,
          lte: until,
        },
        // Only include actions that are interesting for newsletters
        action: {
          in: [
            'user.login',
            'team.invite.accept',
            'admin.user.suspend',
            'team.created',
            'subscription.updated',
            'license.activated',
            'api_key.created',
            'project.deployed',
          ],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return logs.map((log) => ({
      id: log.id,
      type: 'audit_log' as NewsletterContentType,
      title: this.formatActionTitle(log.action),
      summary: this.formatActionSummary(log),
      url: log.targetId ? `/admin/audit/${log.id}` : undefined,
      metadata: {
        action: log.action,
        targetType: log.targetType,
        targetId: log.targetId,
        actorId: log.actorId,
        metadata: log.metadata ? JSON.parse(log.metadata) : undefined,
      },
      publishedAt: log.createdAt,
      createdAt: log.createdAt,
    }));
  }

  private formatActionTitle(action: string): string {
    const actionMap: Record<string, string> = {
      'user.login': 'User Login',
      'team.invite.accept': 'Team Invitation Accepted',
      'admin.user.suspend': 'User Suspended',
      'team.created': 'Team Created',
      'subscription.updated': 'Subscription Updated',
      'license.activated': 'License Activated',
      'api_key.created': 'API Key Created',
      'project.deployed': 'Project Deployed',
    };
    return actionMap[action] || action.replace(/\./g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  private formatActionSummary(log: { action: string; targetType?: string | null; targetId?: string | null; metadata?: string | null }): string {
    const parts = [log.action];
    if (log.targetType) parts.push(log.targetType);
    if (log.targetId) parts.push(log.targetId);
    return parts.join(' · ');
  }
}

/**
 * Release/Changelog content source
 */
export class ReleaseContentSource implements ContentSource {
  getContentType(): NewsletterContentType {
    return 'release';
  }

  async fetchContent(options: NewsletterGenerationOptions): Promise<NewsletterContentItem[]> {
    const since = options.since ?? new Date(Date.now() - (options.frequency === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000));
    const until = options.until ?? new Date();

    // Check for release.json and changelog files
    const releases: NewsletterContentItem[] = [];

    // In a real implementation, this would fetch from a releases table or GitHub releases
    // For now, we'll create a placeholder that can be extended
    // TODO: Connect to actual releases/changelog data source

    return releases;
  }
}

/**
 * GitHub content source - fetches commits, PRs, releases
 */
export class GitHubContentSource implements ContentSource {
  private readonly owner: string;
  private readonly repo: string;
  private readonly token?: string;

  constructor(owner: string, repo: string, token?: string) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
  }

  getContentType(): NewsletterContentType {
    return 'github';
  }

  async fetchContent(options: NewsletterGenerationOptions): Promise<NewsletterContentItem[]> {
    const since = options.since ?? new Date(Date.now() - (options.frequency === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000));
    const until = options.until ?? new Date();

    if (!this.token) {
      console.warn('GitHub token not configured, skipping GitHub content');
      return [];
    }

    try {
      const [commits, releases, pullRequests] = await Promise.all([
        this.fetchCommits(since, until),
        this.fetchReleases(since, until),
        this.fetchPullRequests(since, until),
      ]);

      return [...commits, ...releases, ...pullRequests].sort(
        (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
      );
    } catch (error) {
      console.error('Failed to fetch GitHub content:', error);
      return [];
    }
  }

  private async fetchCommits(since: Date, until: Date): Promise<NewsletterContentItem[]> {
    const response = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/commits?since=${since.toISOString()}&until=${until.toISOString()}&per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((commit: any) => ({
      id: `github-commit-${commit.sha}`,
      type: 'github' as NewsletterContentType,
      title: commit.commit.message.split('\n')[0],
      summary: `Commit by ${commit.commit.author.name}`,
      url: commit.html_url,
      metadata: {
        sha: commit.sha,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
      },
      publishedAt: new Date(commit.commit.author.date),
      createdAt: new Date(commit.commit.author.date),
    }));
  }

  private async fetchReleases(since: Date, until: Date): Promise<NewsletterContentItem[]> {
    const response = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/releases?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data
      .filter((release: any) => new Date(release.published_at) >= since && new Date(release.published_at) <= until)
      .map((release: any) => ({
        id: `github-release-${release.id}`,
        type: 'github' as NewsletterContentType,
        title: release.name || release.tag_name,
        summary: release.body?.slice(0, 200) || 'New release published',
        url: release.html_url,
        metadata: {
          tag: release.tag_name,
          prerelease: release.prerelease,
          draft: release.draft,
        },
        publishedAt: new Date(release.published_at),
        createdAt: new Date(release.published_at),
      }));
  }

  private async fetchPullRequests(since: Date, until: Date): Promise<NewsletterContentItem[]> {
    const response = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/pulls?state=closed&sort=updated&direction=desc&per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data
      .filter((pr: any) => pr.merged_at && new Date(pr.merged_at) >= since && new Date(pr.merged_at) <= until)
      .map((pr: any) => ({
        id: `github-pr-${pr.id}`,
        type: 'github' as NewsletterContentType,
        title: pr.title,
        summary: `PR #${pr.number} merged by ${pr.user.login}`,
        url: pr.html_url,
        metadata: {
          number: pr.number,
          author: pr.user.login,
          merged: true,
        },
        publishedAt: new Date(pr.merged_at!),
        createdAt: new Date(pr.merged_at!),
      }));
  }
}

/**
 * Custom content source - for blog posts, announcements, docs updates
 */
export class CustomContentSource implements ContentSource {
  getContentType(): NewsletterContentType {
    return 'custom';
  }

  async fetchContent(options: NewsletterGenerationOptions): Promise<NewsletterContentItem[]> {
    // This would typically fetch from a CMS, database table, or file system
    // For now, return empty - implement based on your content management system
    return [];
  }
}

/**
 * Registry of all content sources
 */
export class ContentSourceRegistry {
  private sources: Map<NewsletterContentType, ContentSource> = new Map();

  register(source: ContentSource): void {
    this.sources.set(source.getContentType(), source);
  }

  getSource(type: NewsletterContentType): ContentSource | undefined {
    return this.sources.get(type);
  }

  getAllSources(): ContentSource[] {
    return Array.from(this.sources.values());
  }

  async fetchAllContent(options: NewsletterGenerationOptions): Promise<NewsletterContentItem[]> {
    const enabledTypes = options.contentTypes ?? ['audit_log', 'release', 'github', 'custom'];
    const results = await Promise.all(
      enabledTypes
        .map((type) => this.sources.get(type))
        .filter((source): source is ContentSource => source !== undefined)
        .map((source) => source.fetchContent(options))
    );

    return results.flat().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
}

/**
 * Create default registry with all sources
 */
export function createDefaultRegistry(githubToken?: string, githubOwner?: string, githubRepo?: string): ContentSourceRegistry {
  const registry = new ContentSourceRegistry();
  registry.register(new AuditLogContentSource());
  registry.register(new ReleaseContentSource());
  if (githubToken && githubOwner && githubRepo) {
    registry.register(new GitHubContentSource(githubOwner, githubRepo, githubToken));
  }
  registry.register(new CustomContentSource());
  return registry;
}