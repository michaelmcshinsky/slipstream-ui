import type { Locale } from '@slipstream-ui/i18n';
import { en } from './en';
import { ar } from './ar';
import { es } from './es';
import { ja } from './ja';
import { ko } from './ko';
import { ru } from './ru';
import { zh } from './zh';
import type { MarketingCopy, ShowcaseCopy } from './types';

export const MARKETING_COPY: Record<Locale, MarketingCopy> = { en, ar, es, ja, ko, ru, zh };

export function getMarketingCopy(locale: Locale): MarketingCopy {
  return MARKETING_COPY[locale] ?? en;
}

/**
 * Showcase copy is optional per locale while translations land; non-English
 * locales fall back to English rather than hiding the page.
 */
export function getShowcaseCopy(locale: Locale): ShowcaseCopy | undefined {
  return MARKETING_COPY[locale]?.showcase ?? en.showcase;
}

export type {
  AboutCopy,
  AccessibilityCopy,
  ContactCopy,
  DemoCopy,
  HomeCopy,
  LabCopy,
  LegalPageCopy,
  MarketingCopy,
  MarketingSection,
  PrivacyCopy,
  RichBlock,
  ShowcaseCopy,
  TermsCopy,
} from './types';
