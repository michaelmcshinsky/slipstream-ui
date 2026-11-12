'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { LocaleSwitcher, useI18n } from '@slipstream-ui/i18n/react';
import { track } from '@/lib/analytics';

const REPO_URL = 'https://github.com/michaelmcshinsky/slipstream-ui';

// Search ships its own index; load it on first open instead of on every page.
const CommandPalette = dynamic(() => import('./command-palette').then((mod) => mod.CommandPalette), {
  ssr: false,
});

/**
 * Sticky top navigation shared by the marketing site and docs.
 * Includes the ⌘K search trigger and dark-mode toggle.
 */
export function Navbar() {
  const { t } = useI18n();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Sync with the class applied by the pre-paint theme script in the root layout.
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Follow live OS theme changes while the user hasn't chosen an explicit preference.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function onChange(e: MediaQueryListEvent) {
      if (localStorage.getItem('slipstream-theme')) return;
      document.documentElement.classList.toggle('dark', e.matches);
      setDark(e.matches);
    }
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // The palette is mounted on demand, so the shortcut lives here rather than
  // inside it. Escape still closes from within.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => {
          if (!open) track('search_open', { source: 'keyboard' });
          return !open;
        });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function toggleDark() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('slipstream-theme', next ? 'dark' : 'light');
    setDark(next);
  }

  return (
    <>
      {/* Outside <header>: backdrop-blur would trap the fixed overlay. Mounted
          on demand so the search index stays out of the initial bundle. */}
      {paletteOpen && <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Full-bleed header: no container cap so navigation spans the viewport. */}
        <nav className="flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center" aria-label="Slipstream UI home">
              {/* eslint-disable-next-line @next/next/no-img-element -- local brand lockup, unoptimized by design */}
              <img
                src="/slipstream-lockup.png"
                alt="Slipstream UI"
                width={164} height={44}
                className="h-11 w-auto dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- white wordmark for dark surfaces */}
              <img
                src="/slipstream-lockup-dark.png"
                alt=""
                aria-hidden="true"
                width={164} height={44}
                className="hidden h-11 w-auto dark:block"
              />
            </Link>
            <div className="hidden items-center gap-5 text-sm md:flex">
              <Link href="/docs" className="inline-flex h-6 items-center text-muted-foreground transition-colors hover:text-foreground">{t('shell.docs')}</Link>
              <Link href="/docs/components" className="inline-flex h-6 items-center text-muted-foreground transition-colors hover:text-foreground">{t('shell.components')}</Link>
              <Link href="/docs/templates" className="inline-flex h-6 items-center text-muted-foreground transition-colors hover:text-foreground">{t('shell.templates')}</Link>
              <Link href="/changelog" className="inline-flex h-6 items-center text-muted-foreground transition-colors hover:text-foreground">{t('shell.changelog')}</Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LocaleSwitcher className="hidden items-center sm:flex" />
            <button
              type="button"
              onClick={() => {
                track('search_open', { source: 'button' });
                setPaletteOpen(true);
              }}
              className="flex h-11 items-center gap-2 rounded-md border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:h-9"
              aria-label={t('shell.searchAria')}
            >
              <span aria-hidden="true">⌕</span>
              <span className="hidden sm:inline">{t('shell.search')}</span>
              <kbd className="hidden rounded border border-border bg-background px-1.5 font-mono text-[10px] sm:inline">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={toggleDark}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-sm hover:bg-muted sm:h-9 sm:w-9"
              aria-label={dark ? t('shell.switchLight') : t('shell.switchDark')}
            >
              <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('github_click', { location: 'navbar' })}
              className="flex h-11 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-9"
              aria-label={t('shell.github')}
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              <span className="hidden lg:inline">{t('shell.github')}</span>
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
