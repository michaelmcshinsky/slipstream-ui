'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';

const REPO = 'michaelmcshinsky/slipstream-ui';
const CACHE_KEY = 'slipstream-repo-stats';
const CACHE_TTL_MS = 60 * 60 * 1000;

type RepoStats = {
  stars: number;
  forks: number;
};

function isRepoStats(value: unknown): value is { stargazers_count: number; forks_count: number } {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { stargazers_count?: unknown; forks_count?: unknown };
  return typeof candidate.stargazers_count === 'number' && typeof candidate.forks_count === 'number';
}

function readCache(): RepoStats | null {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const cached = parsed as { at?: unknown; stats?: unknown };
    if (typeof cached.at !== 'number' || Date.now() - cached.at > CACHE_TTL_MS) return null;
    return isRepoStats(cached.stats)
      ? { stars: cached.stats.stargazers_count, forks: cached.stats.forks_count }
      : null;
  } catch {
    return null;
  }
}

function writeCache(stats: RepoStats): void {
  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), stats }));
  } catch {
    /* storage blocked - the badge simply refetches next time */
  }
}

const numberFormat = new Intl.NumberFormat('en-US');

/**
 * Live repository proof point. Fetched client-side from the public GitHub API
 * (no token, no third party) and cached for an hour; renders nothing when the
 * API is unreachable or rate-limited rather than showing a stale number.
 */
export function GitHubStars() {
  const [stats, setStats] = useState<RepoStats | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setStats(cached);
      return;
    }

    let cancelled = false;
    fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        if (cancelled || !isRepoStats(data)) return;
        const next = { stars: data.stargazers_count, forks: data.forks_count };
        writeCache(next);
        setStats(next);
      })
      .catch(() => {
        /* rate limited / offline - omit the live numbers */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) return null;

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('github_click', { location: 'stars_badge' })}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Slipstream UI on GitHub: ${stats.stars} stars, ${stats.forks} forks`}
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      <span aria-hidden="true">
        {numberFormat.format(stats.stars)} stars · {numberFormat.format(stats.forks)} forks
      </span>
    </a>
  );
}
