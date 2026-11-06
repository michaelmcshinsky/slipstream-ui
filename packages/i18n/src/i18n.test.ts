import { describe, expect, it } from 'vitest';
import { resolveLocale, resolveLocaleFromAcceptLanguage, directionFor } from './locales';
import { getMessages } from './messages';
import { translate, translatePlural } from './translate';
import { formatNumber, formatRelativeTime } from './format';

describe('locale resolution', () => {
  it('resolves base locales from BCP-47 tags and falls back to English', () => {
    expect(resolveLocale('ar-EG')).toBe('ar');
    expect(resolveLocale('es-MX')).toBe('es');
    expect(resolveLocale('ko-KR')).toBe('ko');
    expect(resolveLocale('ja-JP')).toBe('ja');
    expect(resolveLocale('ru-RU')).toBe('ru');
    expect(resolveLocale('zh-CN')).toBe('zh');
    expect(resolveLocale('fr-FR')).toBe('en');
    expect(resolveLocale(undefined)).toBe('en');
  });

  it('respects Accept-Language quality values', () => {
    expect(resolveLocaleFromAcceptLanguage('fr;q=0.9, es;q=0.8, en;q=0.7')).toBe('es');
    expect(resolveLocaleFromAcceptLanguage('ar;q=0.4, es;q=0.9')).toBe('es');
    expect(resolveLocaleFromAcceptLanguage('de-DE, fr;q=0.8')).toBe('en');
  });

  it('maps Arabic to RTL and others to LTR', () => {
    expect(directionFor('ar')).toBe('rtl');
    expect(directionFor('en')).toBe('ltr');
    expect(directionFor('es')).toBe('ltr');
  });
});

describe('translations', () => {
  it('interpolates parameters', () => {
    const messages = getMessages('en');
    expect(translate(messages, 'reasoning.stepLabel', { index: 2 })).toBe('Step 2');
  });

  it('returns the key when a message is missing', () => {
    expect(translate({}, 'app.title')).toBe('app.title');
  });

  it('selects plural forms with Intl.PluralRules', () => {
    const messages = getMessages('en');
    expect(translatePlural(messages, 'en', 'reasoning.step', 1)).toBe('1 step');
    expect(translatePlural(messages, 'en', 'reasoning.step', 3)).toBe('3 steps');
    const arabic = getMessages('ar');
    expect(translatePlural(arabic, 'ar', 'reasoning.step', 2)).toBe('خطوات 2');
  });

  it('ships every key in every locale', () => {
    const en = getMessages('en');
    for (const locale of ['ar', 'es', 'ko', 'ja', 'ru', 'zh'] as const) {
      expect(Object.keys(getMessages(locale))).toEqual(Object.keys(en));
    }
  });

  it('translates the app title', () => {
    expect(translate(getMessages('ar'), 'app.title')).toContain('الذكاء');
    expect(translate(getMessages('es'), 'app.title')).toContain('chat');
  });
});

describe('formatting', () => {
  it('formats numbers per locale', () => {
    expect(formatNumber('en', 1234.5)).toBe('1,234.5');
    expect(formatNumber('es', 1234.5)).toBe('1234,5');
  });

  it('formats relative time per locale', () => {
    const now = Date.UTC(2026, 10, 5, 12, 0, 0);
    expect(formatRelativeTime('en', now - 60_000, now)).toBe('1 minute ago');
    expect(formatRelativeTime('ar', now - 60_000, now)).toContain('دقيقة');
  });
});
