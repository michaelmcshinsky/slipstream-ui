'use client';

import { useState } from 'react';
import { cn } from '@slipstream-ui/core';

export interface DemoCardProps {
  /** Rendered live preview. */
  preview: React.ReactNode;
  /** Source code shown in the Code tab. */
  code: string;
  title?: string;
  className?: string;
  /** Start on the code tab instead of the preview. */
  defaultTab?: 'preview' | 'code';
}

/**
 * Tabbed Preview/Code card used by every component page
 * (elements.ai-sdk.dev / shadcn pattern).
 */
export function DemoCard({ preview, code, title, className, defaultTab = 'preview' }: DemoCardProps) {
  const [tab, setTab] = useState<'preview' | 'code'>(defaultTab);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; feedback still shows via consumer handlers.
    }
  }

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
        {tab === 'code' && (
          <button
            type="button"
            onClick={copyCode}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      {tab === 'preview' ? (
        <div className="flex min-h-24 items-center justify-center p-6">{preview}</div>
      ) : (
        <pre className="max-h-96 overflow-auto bg-muted/30 p-4 text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
