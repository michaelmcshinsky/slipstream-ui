'use client';

import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from './locales';
import { useI18n } from './react';

const LOCALE_COOKIE = 'slipstream-locale';
const ONE_YEAR = 60 * 60 * 24 * 365;

export type LocaleSwitcherProps = {
  className?: string;
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { locale, t } = useI18n();

  const change = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    try {
      window.localStorage.setItem(LOCALE_COOKIE, next);
    } catch {
      // Storage can be blocked; the cookie still applies on the next server request.
    }
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    window.location.reload();
  };

  return (
    <label className={['relative inline-flex items-center', className].filter(Boolean).join(' ')}>
      <span className="sr-only">{t('shell.language')}</span>
      {/* appearance-none + an explicit chevron so the caret never sits flush
          against the control edge (native arrows ignore padding on Windows). */}
      <select
        aria-label={t('shell.language')}
        className="h-9 appearance-none rounded-md border border-border bg-background py-0 pl-2.5 pr-8 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={locale}
        onChange={(event) => change(event.target.value as Locale)}
      >
        {SUPPORTED_LOCALES.map((value) => (
          <option key={value} value={value}>
            {LOCALE_LABELS[value]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted-foreground"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </label>
  );
}
