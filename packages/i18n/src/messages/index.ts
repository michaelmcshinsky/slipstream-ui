import { ar } from './ar';
import { en, type Messages } from './en';
import { es } from './es';
import { ja } from './ja';
import { ko } from './ko';
import { ru } from './ru';
import { zh } from './zh';
import { pseudoMessages } from './pseudo';
import type { Locale } from '../locales';

/** Pseudo-locale id used for layout stress testing. */
export const PSEUDO_LOCALE = 'en-XA' as const;

export const catalogs: Record<Locale, Messages> = { en, ar, es, ko, ja, ru, zh };

export function getMessages(locale: Locale): Messages {
  return catalogs[locale] ?? en;
}

export function getPseudoMessages(): Messages {
  return pseudoMessages;
}

export { pseudoMessages };
export type { Messages };
