'use client';

import { useEffect, useState } from 'react';
import { applyTheme, persistTheme, THEME_STORAGE_KEY } from '@/lib/theme';

/** Toggles `.dark` on <html> and persists the choice (system-following when unset). */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      applyTheme(event.matches);
      setDark(event.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains('dark');
    applyTheme(next);
    persistTheme(next, window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(next);
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
