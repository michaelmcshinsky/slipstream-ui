'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readConsent } from '@/lib/site';

/**
 * Sticky mobile call to action. Appears on small screens only, after the
 * cookie choice has been made (so it never overlaps the consent banner).
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(readConsent() !== null);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  if (!visible) return null;

  const command = 'npm i @slipstream-ui/core';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className="min-w-0 flex-1 truncate rounded-md border border-border bg-muted/50 px-3 py-2 text-left font-mono text-xs"
          aria-label={`Copy install command: ${command}`}
        >
          {copied ? 'Copied!' : command}
        </button>
        <Link
          href="/docs/installation"
          className="inline-flex h-9 shrink-0 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Install
        </Link>
      </div>
    </div>
  );
}
