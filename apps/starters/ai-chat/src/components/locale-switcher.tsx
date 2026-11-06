'use client';

import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@slipstream-ui/i18n';
import { useI18n } from '@slipstream-ui/i18n/react';

const LOCALE_COOKIE = 'slipstream-locale';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function LocaleSwitcher() {
  const { locale, t } = useI18n();

  const change = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    window.location.reload();
  };

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="sr-only">{t('app.language')}</span>
      <select
        aria-label={t('app.language')}
        className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
        value={locale}
        onChange={(event) => change(event.target.value as Locale)}
      >
        {SUPPORTED_LOCALES.map((value) => (
          <option key={value} value={value}>
            {LOCALE_LABELS[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
