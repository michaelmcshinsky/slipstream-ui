'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DemoCard } from '@/components/demo-card';
import { ThemeToggle } from '@slipstream-ui/core';

export default function Demo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <>
      <DemoCard
        title="Controlled toggle"
        preview={
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onThemeChange={setTheme} />
            <span className="text-sm text-muted-foreground">Current theme: {theme}</span>
          </div>
        }
        code={`const [theme, setTheme] = useState<'light' | 'dark'>('light');

<ThemeToggle theme={theme} onThemeChange={setTheme} />`}
      />

      <DemoCard
        title="Custom labels"
        preview={
          <ThemeToggle
            theme={theme}
            onThemeChange={setTheme}
            labels={{ toDark: 'Dark mode', toLight: 'Light mode' }}
          />
        }
        code={`<ThemeToggle
  theme={theme}
  onThemeChange={setTheme}
  labels={{ toDark: 'Dark mode', toLight: 'Light mode' }}
/>`}
      />

      <p className="text-sm text-muted-foreground">
        ThemeToggle is presentational only — it does not persist the choice or switch the
        class/attribute itself. See{' '}
        <Link href="/docs/theming" className="text-primary underline underline-offset-2 hover:text-primary/80">
          Theming
        </Link>{' '}
        for the persistence and attribute-switch half.
      </p>
    </>
  );
}
