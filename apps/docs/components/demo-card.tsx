'use client';

import { useState } from 'react';
import { CodeBlock } from '@slipstream-ui/ai';
import { cn } from '@slipstream-ui/core';

export interface DemoCardProps {
  /** Rendered live preview. */
  preview: React.ReactNode;
  /** Source code shown in the Code tab. */
  code: string;
  title?: string;
  /** Prism language identifier for the code tab. */
  language?: string;
  className?: string;
  /** Start on the code tab instead of the preview. */
  defaultTab?: 'preview' | 'code';
}

/**
 * Tabbed Preview/Code card used by every component page
 * (elements.ai-sdk.dev / shadcn pattern). The code tab reuses the library's
 * own highlighted CodeBlock component.
 */
export function DemoCard({ preview, code, title, language = 'tsx', className, defaultTab = 'preview' }: DemoCardProps) {
  const [tab, setTab] = useState<'preview' | 'code'>(defaultTab);

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border', className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
        <div role="tablist" aria-label={`${title ?? 'Demo'} view`} className="flex gap-1">
          {(['preview', 'code'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                tab === value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {value}
            </button>
          ))}
          {title && (
            <span className="ml-2 self-center text-xs text-muted-foreground">{title}</span>
          )}
        </div>
      </div>
      {tab === 'preview' ? (
        <div className="flex min-h-24 items-center justify-center p-6">{preview}</div>
      ) : (
        <CodeBlock code={code} language={language} className="rounded-none border-0" />
      )}
    </div>
  );
}
