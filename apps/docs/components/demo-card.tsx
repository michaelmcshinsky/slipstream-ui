'use client';

import { useState } from 'react';
import { CodeBlock } from '@slipstream-ui/ai';
import { cn } from '@slipstream-ui/core';

export interface DemoCardProps {
  /** Rendered live preview. */
  preview: React.ReactNode;
  /** Source code shown in the Code tab. */
  code: string;
  /** Usage examples shown in the Usage tab (import + JSX). */
  usage?: string;
  /** TypeScript type definitions shown in the Types tab. */
  types?: string;
  title?: string;
  /** Prism language identifier for the code tabs. */
  language?: string;
  className?: string;
  /** Start on the code tab instead of the preview. */
  defaultTab?: DemoTab;
}

type DemoTab = 'preview' | 'code' | 'usage' | 'types';

/**
 * Tabbed Preview/Code/Usage/Types card used by every component docs page.
 * The code tabs reuse the library's own highlighted CodeBlock component.
 */
export function DemoCard({
  preview,
  code,
  usage,
  types,
  title,
  language = 'tsx',
  className,
  defaultTab = 'preview',
}: DemoCardProps) {
  const [tab, setTab] = useState<DemoTab>(defaultTab);

  // Build the tab list dynamically so tabs without content don't appear.
  const tabs: { value: DemoTab; label: string }[] = [
    { value: 'preview', label: 'Preview' },
    { value: 'code', label: 'Code' },
  ];
  if (usage) tabs.push({ value: 'usage', label: 'Usage' });
  if (types) tabs.push({ value: 'types', label: 'Types' });

  // Keep the active tab valid if content changes.
  const activeTab = tabs.some((t) => t.value === tab) ? tab : 'preview';

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border', className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
        <div role="tablist" aria-label={`${title ?? 'Demo'} view`} className="flex gap-1">
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={activeTab === value}
              onClick={() => setTab(value)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
          {title && (
            <span className="ml-2 self-center text-xs text-muted-foreground">{title}</span>
          )}
        </div>
      </div>
      {activeTab === 'preview' ? (
        // Scroll instead of clip: the card is overflow-hidden, so a wide
        // preview must be able to scroll horizontally on small screens.
        // w-max + min-w-full keeps previews centered when they fit.
        <div className="overflow-x-auto p-6">
          <div className="flex min-h-24 w-max min-w-full items-center justify-center">{preview}</div>
        </div>
      ) : (
        <CodeBlock
          code={
            activeTab === 'code' ? code : activeTab === 'usage' ? usage! : types!
          }
          language={activeTab === 'types' ? 'typescript' : language}
          className="rounded-none border-0"
        />
      )}
    </div>
  );
}
