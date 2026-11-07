'use client';

import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { ThemeToggle } from '@slipstream-ui/core';

export default function ThemeTogglePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ComponentPage
      id="theme-toggle"
      title="ThemeToggle"
      description="The button and its accessible label. The consumer owns persistence and the actual class/attribute switch."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'theme', type: "'light' | 'dark'", description: 'Current theme.' },
        { name: 'onThemeChange', type: "(theme: 'light' | 'dark') => void", description: 'Fired with the next theme.' },
        { name: 'labels', type: '{ toLight?: string; toDark?: string }', description: 'Accessible labels for the next action.' },
        { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Control size.' },
      ]}
      accessibility={[
        'aria-label and title describe the next action.',
        'Native button with Enter/Space activation and a visible focus ring.',
        'Icons are aria-hidden; the label carries the meaning.',
      ]}
    >
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
    </ComponentPage>
  );
}
