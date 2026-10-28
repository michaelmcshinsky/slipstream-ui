'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommandPalette } from './command-palette';
import { SlipstreamIcon } from './slipstream-icon';

const REPO_URL = 'https://github.com/slipstream-ui';

/**
 * Sticky top navigation shared by the marketing site and docs.
 * Includes the ⌘K search trigger and dark-mode toggle.
 */
export function Navbar() {
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

  function toggleDark() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('slipstream-theme', next ? 'dark' : 'light');
    setDark(next);
  }

  return (
    <>
      {/* The palette must live outside <header>: backdrop-blur creates a
          containing block that would trap the fixed overlay inside the bar. */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <SlipstreamIcon className="h-6 w-6 text-primary" />
              Slipstream<span className="text-primary">UI</span>
            </Link>
            <div className="hidden items-center gap-5 text-sm md:flex">
              <Link href="/docs" className="text-muted-foreground transition-colors hover:text-foreground">Docs</Link>
              <Link href="/docs/components" className="text-muted-foreground transition-colors hover:text-foreground">Components</Link>
              <Link href="/docs/templates" className="text-muted-foreground transition-colors hover:text-foreground">Templates</Link>
              <Link href="/changelog" className="text-muted-foreground transition-colors hover:text-foreground">Changelog</Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex h-9 items-center gap-2 rounded-md border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Search documentation (Ctrl+K)"
            >
              <span aria-hidden="true">⌕</span>
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden rounded border border-border bg-background px-1.5 font-mono text-[10px] sm:inline">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={toggleDark}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm hover:bg-muted"
              aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="GitHub repository"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              <span className="hidden lg:inline">GitHub</span>
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
