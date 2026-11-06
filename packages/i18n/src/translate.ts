import type { Locale } from './locales';

type Join<Prefix extends string, Key extends string> = Prefix extends '' ? Key : `${Prefix}.${Key}`;

export type LeafPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? Join<Prefix, K>
    : T[K] extends object
      ? LeafPaths<T[K], Join<Prefix, K>>
      : never;
}[keyof T & string];

export type MessageKey = LeafPaths<import('./messages/en').Messages>;

export type PluralBase = 'reasoning.step';

export type MessageParams = Record<string, string | number>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getMessage(messages: unknown, key: string): string | undefined {
  let current: unknown = messages;
  for (const part of key.split('.')) {
    if (!isRecord(current)) return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function interpolate(template: string, params: MessageParams = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

export function translate(messages: unknown, key: MessageKey, params?: MessageParams): string {
  const value = getMessage(messages, key);
  return value === undefined ? key : interpolate(value, params);
}

export function pluralCategory(locale: Locale, count: number): Intl.LDMLPluralRule {
  return new Intl.PluralRules(locale).select(count);
}

export function translatePlural(
  messages: unknown,
  locale: Locale,
  base: PluralBase,
  count: number,
  params: MessageParams = {},
): string {
  const category = pluralCategory(locale, count);
  const candidates = [`${base}_${category}`, `${base}_other`, `${base}_one`];
  for (const key of candidates) {
    const value = getMessage(messages, key);
    if (value !== undefined) return interpolate(value, { ...params, count });
  }
  return base;
}
