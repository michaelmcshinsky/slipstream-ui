'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, Badge, Button, Input, Spinner } from '@slipstream-ui/core';
import {
  defaultTheme,
  darkTheme,
  violetTheme,
  violetDarkTheme,
  zincTheme,
  zincDarkTheme,
} from '@slipstream-ui/themes';
import type { Theme } from '@slipstream-ui/themes';

type Preset = { name: string; light: Theme; dark: Theme };

const PRESETS: Preset[] = [
  { name: 'Default', light: defaultTheme, dark: darkTheme },
  { name: 'Violet', light: violetTheme, dark: violetDarkTheme },
  { name: 'Zinc', light: zincTheme, dark: zincDarkTheme },
];

/** The CSS custom properties a preset sets, so "Reset" can clear exactly those. */
function appliedVars(theme: Theme): string[] {
  const colorVars = Object.keys(theme.colors).map((k) => `--${k}`);
  return [...colorVars, '--radius', '--radius-lg', '--radius-md', '--radius-sm'];
}

function applyThemeToDom(theme: Theme) {
  Object.entries(theme.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value ?? '');
  });
  const radius = theme.radius;
  if (radius) {
    document.documentElement.style.setProperty('--radius', theme.borderRadius ?? '');
    document.documentElement.style.setProperty('--radius-lg', radius.lg);
    document.documentElement.style.setProperty('--radius-md', radius.md);
    document.documentElement.style.setProperty('--radius-sm', radius.sm);
  }
}

/**
 * Live theme showcase: switch between the shipped presets and watch real
 * components re-theme instantly via CSS variables. Each preset has a light
 * and dark variant; the correct one is applied based on the `.dark` class.
 */
export function ThemeShowcase() {
  const [active, setActive] = useState<string>('Default');
  const [isDark, setIsDark] = useState(false);

  // Sync with the `.dark` class on <html>, set by the navbar toggle / pre-paint script.
  useEffect(() => {
    const el = document.documentElement;
    setIsDark(el.classList.contains('dark'));
    const observer = new MutationObserver(() => setIsDark(el.classList.contains('dark')));
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Re-apply the paired variant whenever dark mode or the active preset changes.
  useEffect(() => {
    const preset = PRESETS.find((p) => p.name === active);
    if (preset) {
      applyThemeToDom(isDark ? preset.dark : preset.light);
    }
  }, [active, isDark]);

  function resetTheme() {
    const preset = PRESETS.find((p) => p.name === active);
    if (preset) {
      appliedVars(preset.light).forEach((v) => document.documentElement.style.removeProperty(v));
    }
    setActive('');
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Try the shipped themes</h3>
        <div role="tablist" aria-label="Theme preset" className="flex gap-1 rounded-lg border border-border p-1">
          {PRESETS.map(({ name }) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active === name}
              onClick={() => setActive(name)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                active === name ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {name}
            </button>
          ))}
          <button
            type="button"
            role="tab"
            aria-selected={active === ''}
            onClick={resetTheme}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              active === '' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button>Get started</Button>
        <Button variant="outline">Docs</Button>
        <Badge>Streaming</Badge>
        <Badge variant="secondary">v0.1.0</Badge>
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Input placeholder="Type a message…" className="max-w-52" aria-label="Theme demo input" />
        <Spinner size="sm" />
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        One <code className="rounded bg-muted px-1 font-mono">createTheme()</code> call emits every CSS variable —
        components re-theme instantly, no rebuild. Each preset ships a dark variant that follows the site&apos;s{' '}
        <code className="rounded bg-muted px-1 font-mono">.dark</code> class.
      </p>
    </div>
  );
}
