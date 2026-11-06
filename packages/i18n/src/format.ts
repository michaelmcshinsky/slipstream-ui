import type { Locale } from './locales';

export function formatNumber(
  locale: Locale,
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatDate(
  locale: Locale,
  value: Date | number | string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function formatDateTime(
  locale: Locale,
  value: Date | number | string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function formatRelativeTime(
  locale: Locale,
  value: Date | number,
  now: number = Date.now(),
): string {
  const target = value instanceof Date ? value.getTime() : value;
  const diffSeconds = Math.round((target - now) / 1000);
  const absolute = Math.abs(diffSeconds);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (absolute < 60) return formatter.format(diffSeconds, 'second');
  if (absolute < 3600) return formatter.format(Math.round(diffSeconds / 60), 'minute');
  if (absolute < 86_400) return formatter.format(Math.round(diffSeconds / 3600), 'hour');
  if (absolute < 604_800) return formatter.format(Math.round(diffSeconds / 86_400), 'day');
  if (absolute < 2_592_000) return formatter.format(Math.round(diffSeconds / 604_800), 'week');
  if (absolute < 31_536_000) return formatter.format(Math.round(diffSeconds / 2_592_000), 'month');
  return formatter.format(Math.round(diffSeconds / 31_536_000), 'year');
}
