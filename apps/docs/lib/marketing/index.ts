import type { Locale } from '@slipstream-ui/i18n';
import { en } from './en';
import { ar } from './ar';
import { es } from './es';
import { ja } from './ja';
import { ko } from './ko';
import { ru } from './ru';
import { zh } from './zh';
import type { MarketingCopy } from './types';

export const MARKETING_COPY: Record<Locale, MarketingCopy> = { en, ar, es, ja, ko, ru, zh };

export function getMarketingCopy(locale: Locale): MarketingCopy {
  return MARKETING_COPY[locale] ?? en;
}

export type {
  AboutCopy,
  AccessibilityCopy,
  ContactCopy,
  HomeCopy,
  LegalPageCopy,
  MarketingCopy,
  MarketingSection,
  PrivacyCopy,
  RichBlock,
  TermsCopy,
} from './types';
