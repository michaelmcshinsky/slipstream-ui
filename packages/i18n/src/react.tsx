'use client';

import * as React from 'react';
import { formatDate, formatDateTime, formatNumber, formatRelativeTime } from './format';
import { directionFor, type Locale } from './locales';
import { getMessages, getPseudoMessages, type Messages } from './messages';
import { translate, translatePlural, type MessageKey, type MessageParams, type PluralBase } from './translate';

export type I18nContextValue = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  /** True when the pseudo-locale catalog is active. */
  pseudo: boolean;
  messages: Messages;
  t: (key: MessageKey, params?: MessageParams) => string;
  tPlural: (base: PluralBase, count: number, params?: MessageParams) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  formatDateTime: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (value: Date | number, now?: number) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export type I18nProviderProps = {
  locale: Locale;
  messages?: Messages;
  /** Use the pseudo-locale catalog for layout stress testing. */
  pseudo?: boolean;
  children: React.ReactNode;
};

export function I18nProvider({ locale, messages, pseudo = false, children }: I18nProviderProps): React.ReactElement {
  const catalog = React.useMemo(
    () => messages ?? (pseudo ? getPseudoMessages() : getMessages(locale)),
    [locale, messages, pseudo],
  );
  const dir = directionFor(locale);

  React.useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
  }, [locale, dir]);

  const value = React.useMemo<I18nContextValue>(
    () => ({
      locale,
      dir,
      pseudo,
      messages: catalog,
      t: (key, params) => translate(catalog, key, params),
      tPlural: (base, count, params) => translatePlural(catalog, locale, base, count, params),
      formatNumber: (value, options) => formatNumber(locale, value, options),
      formatDate: (date, options) => formatDate(locale, date, options),
      formatDateTime: (date, options) => formatDateTime(locale, date, options),
      formatRelativeTime: (date, now) => formatRelativeTime(locale, date, now),
    }),
    [catalog, dir, locale, pseudo],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = React.useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>.');
  return value;
}

export type { MessageKey, MessageParams, PluralBase };
