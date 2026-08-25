'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, Badge, Button, Input, Spinner } from '@slipstream-ui/core';
import { defaultTheme, violetTheme, zincTheme } from '@slipstream-ui/themes';

const THEMES = [
  { name: 'Default', theme: defaultTheme },
  { name: 'Violet', theme: violetTheme },
  { name: 'Zinc', theme: zincTheme },
] as const;

/**
 * Live theme showcase (daisyUI pattern): switch between the shipped presets
 * and watch real components re-theme instantly via CSS variables.
 */
export function ThemeShowcase() {
  const [active, setActive] = useState<string>('Default');

  function applyTheme(name: string) {
    const entry = THEMES.find((candidate) => candidate.name === name) ?? THEMES[0];
    // Apply structured tokens directly — no CSS string round-trip.
    Object.entries(entry.theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value ?? '');
    });
    const radius = entry.theme.radius;
    if (radius) {
      document.documentElement.style.setProperty('--radius', entry.theme.borderRadius ?? '');
      document.documentElement.style.setProperty('--radius-lg', radius.lg);
      document.documentElement.style.setProperty('--radius-md', radius.md);
      document.documentElement.style.setProperty('--radius-sm', radius.sm);
    }
    setActive(name);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Try the shipped themes</h3>
        <div role="tablist" aria-label="Theme preset" className="flex gap-1 rounded-lg border border-border p-1">
          {THEMES.map(({ name }) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active === name}
              onClick={() => applyTheme(name)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                active === name ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {name}
            </button>
          ))}
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
        components re-theme instantly, no rebuild.
      </p>
    </div>
  );
}
