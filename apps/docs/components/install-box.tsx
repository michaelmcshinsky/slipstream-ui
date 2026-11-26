'use client';

import { useState } from 'react';
import { cn } from '@slipstream-ui/core';
import { useI18n } from '@slipstream-ui/i18n/react';
import { track } from '@/lib/analytics';

export type InstallBoxProps = {
  componentId: string;
  npmPackages?: string;
  className?: string;
};

/**
 * Tabbed installer box (AI Elements style): package install, CLI copy,
 * and shadcn-compatible registry command.
 */
export function InstallBox({ componentId, npmPackages = '@slipstream-ui/core @slipstream-ui/ai', className }: InstallBoxProps) {
  const tabs = [
    { id: 'cli', label: 'CLI', command: `npx @slipstream-ui/cli@latest add ${componentId}` },
    { id: 'shadcn', label: 'shadcn', command: `npx shadcn@latest add https://slipstreamui.com/registry/${componentId}.json` },
    { id: 'npm', label: 'pnpm', command: `pnpm add ${npmPackages}` },
  ] as const;

  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('cli');
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  const active = tabs.find((entry) => entry.id === tab)!;

  async function copy() {
    try {
      await navigator.clipboard.writeText(active.command);
      track('install_copy', { component: componentId, method: tab });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable.
    }
  }

  const tabId = (id: string) => `install-tab-${id}`;
  const panelId = (id: string) => `install-panel-${id}`;

  function onTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((entry) => entry.id === tab);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setTab(tabs[next]!.id);
    document.getElementById(tabId(tabs[next]!.id))?.focus();
  }

  return (
    <div className={cn('flex items-stretch overflow-hidden rounded-lg border border-border bg-muted/40 font-mono text-xs', className)}>
      <div role="tablist" aria-label={t('site.install.method')} className="flex border-r border-border" onKeyDown={onTabKeyDown}>
        {tabs.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            id={tabId(entry.id)}
            aria-selected={tab === entry.id}
            aria-controls={panelId(entry.id)}
            tabIndex={tab === entry.id ? 0 : -1}
            onClick={() => setTab(entry.id)}
            className={`inline-flex min-h-11 items-center px-3 py-2 transition-colors ${
              tab === entry.id ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>
      {/* min-w-0 lets the flex item shrink below its content so the
          nowrap command scrolls inside the row instead of overflowing it. */}
      <div role="tabpanel" id={panelId(tab)} aria-labelledby={tabId(tab)} className="min-w-0 flex-1 self-center overflow-x-auto px-3 py-2">
        <code className="whitespace-nowrap">{active.command}</code>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t('site.install.copied') : t('site.install.copyAria')}
        className="min-h-11 border-l border-border px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? '✓' : t('site.install.copy')}
      </button>
    </div>
  );
}
