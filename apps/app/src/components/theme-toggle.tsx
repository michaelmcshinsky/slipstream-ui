'use client';

import { useEffect, useState } from 'react';

/** Toggles the color scheme via <meta name="color-scheme"> and persists the choice. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    setDark(meta?.content === 'dark');
  }, []);

  function toggle() {
    const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
    if (!meta) return;
    const current = meta.content;
    const isDark = current === 'dark';
    const next = isDark ? 'light' : 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemScheme = prefersDark ? 'dark' : 'light';

    // If next matches system, remove override (revert to system)
    const value = next === systemScheme ? 'light dark' : next;
    meta.content = value;
    if (value === 'light dark') {
      localStorage.removeItem('slipstream-theme');
    } else {
      localStorage.setItem('slipstream-theme', value);
    }
    setDark(next === 'dark');
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm transition-colors hover:bg-muted"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
    </button>
  );
}
