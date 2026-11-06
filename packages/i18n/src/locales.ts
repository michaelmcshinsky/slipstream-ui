export const SUPPORTED_LOCALES = ['en', 'ar', 'es', 'ko', 'ja', 'ru', 'zh'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  es: 'Español',
  ko: '한국어',
  ja: '日本語',
  ru: 'Русский',
  zh: '中文',
};

export const DIRECTION: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
  es: 'ltr',
  ko: 'ltr',
  ja: 'ltr',
  ru: 'ltr',
  zh: 'ltr',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Resolves a BCP-47 tag (`ar-EG`, `es-MX`) to a supported base locale. */
export function resolveLocale(value?: string | null): Locale {
  if (!value) return DEFAULT_LOCALE;
  const base = value.toLowerCase().split('-')[0];
  return isLocale(base) ? base : DEFAULT_LOCALE;
}

/** Picks the highest-q supported language from an Accept-Language header. */
export function resolveLocaleFromAcceptLanguage(header?: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const candidates = header
    .split(',')
    .map((part) => {
      const [tag, quality] = part.trim().split(';q=');
      return { tag, quality: quality === undefined ? 1 : Number.parseFloat(quality) };
    })
    .filter((entry) => entry.tag && Number.isFinite(entry.quality))
    .sort((a, b) => b.quality - a.quality);

  for (const candidate of candidates) {
    const base = candidate.tag.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function directionFor(locale: Locale): 'ltr' | 'rtl' {
  return DIRECTION[locale];
}
