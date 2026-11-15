import type { Locale } from '@slipstream-ui/i18n';
import { introduction } from './introduction';
import type { DocsPageCopy, DocsPageId } from './types';

/**
 * Locale-keyed docs prose. English is the source; every supported locale
 * carries a full translation so a reader never gets a half-translated body.
 * Add a page by extending `DocsPageId` and adding its catalog here.
 */
const PAGES: Record<DocsPageId, Record<Locale, DocsPageCopy>> = {
  introduction,
};

export function getDocsPageCopy(page: DocsPageId, locale: Locale): DocsPageCopy {
  return PAGES[page][locale] ?? introduction.en;
}

/**
 * Docs routes whose body is translated for every locale. Everything else is
 * English-only and shows the translation notice.
 */
export const TRANSLATED_DOC_PATHS: readonly string[] = ['/docs'];

export type { DocsPageCopy, DocsPageId, ProseBlock, ProsePart } from './types';
