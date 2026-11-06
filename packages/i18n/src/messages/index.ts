import { ar } from './ar';
import { en, type Messages } from './en';
import { es } from './es';
import type { Locale } from '../locales';

export const catalogs: Record<Locale, Messages> = { en, ar, es };

export function getMessages(locale: Locale): Messages {
  return catalogs[locale] ?? en;
}

export type { Messages };
