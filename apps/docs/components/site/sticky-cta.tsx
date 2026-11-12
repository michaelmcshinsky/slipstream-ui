'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@slipstream-ui/i18n/react';
import { readConsent } from '@/lib/site';
import { track } from '@/lib/analytics';

/**
 * Sticky mobile call to action. Appears on small screens only, after the
 * cookie choice has been made (so it never overlaps the consent banner).
 */
export function StickyCta() {
  const { t } = useI18n();
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
      track('install_copy', { command: 'core', location: 'sticky_cta' });
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
          className="min-h-11 min-w-0 flex-1 truncate rounded-md border border-border bg-muted/50 px-3 py-2 text-left font-mono text-xs"
          aria-label={t('site.stickyCta.copyAria', { command })}
        >
          {copied ? t('site.stickyCta.copied') : command}
        </button>
        <Link
          href="/docs/installation"
          className="inline-flex h-11 shrink-0 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {t('site.stickyCta.install')}
        </Link>
      </div>
    </div>
  );
}
