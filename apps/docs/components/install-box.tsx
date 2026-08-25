'use client';

import { useState } from 'react';
import { cn } from '@slipstream-ui/core';

export interface InstallBoxProps {
  componentId: string;
  npmPackages?: string;
  className?: string;
}

/**
 * Tabbed installer box (AI Elements style): package install, CLI copy,
 * and shadcn-compatible registry command.
 */
export function InstallBox({ componentId, npmPackages = '@slipstream-ui/core @slipstream-ui/ai', className }: InstallBoxProps) {
  const tabs = [
    { id: 'cli', label: 'CLI', command: `npx slipstream-ui@latest add ${componentId}` },
    { id: 'shadcn', label: 'shadcn', command: `npx shadcn@latest add https://slipstreamui.com/registry/${componentId}.json` },
    { id: 'npm', label: 'pnpm', command: `pnpm add ${npmPackages}` },
  ] as const;

  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('cli');
  const [copied, setCopied] = useState(false);
  const active = tabs.find((entry) => entry.id === tab)!;

  async function copy() {
    try {
      await navigator.clipboard.writeText(active.command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable.
    }
  }

  return (
    <div className={cn('flex items-stretch overflow-hidden rounded-lg border border-border bg-muted/40 font-mono text-xs', className)}>
      <div role="tablist" aria-label="Install method" className="flex border-r border-border">
        {tabs.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            onClick={() => setTab(entry.id)}
            className={`px-3 py-2 transition-colors ${
              tab === entry.id ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <code className="flex-1 self-center overflow-x-auto px-3 py-2 whitespace-nowrap">{active.command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy install command'}
        className="border-l border-border px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  );
}
