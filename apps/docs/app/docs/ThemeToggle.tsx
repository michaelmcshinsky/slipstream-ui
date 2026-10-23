'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('slipstream-theme', next ? 'dark' : 'light');
    setDark(next);
  }
  return <button type="button" onClick={toggle} className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted" aria-label="Toggle color theme">{dark ? '☀ Light' : '☾ Dark'}</button>;
}
