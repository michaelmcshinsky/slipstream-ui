import type { Locale } from '@slipstream-ui/i18n';

/** Inline prose: plain text, code, emphasis or an internal link. */
export type ProsePart =
  | string
  | { code: string }
  | { strong: string }
  | { em: string }
  | { link: { href: string; text: string } };

export type ProseBlock =
  | { kind: 'h2'; text: string }
  | { kind: 'p'; parts: ProsePart[] }
  | { kind: 'ol'; items: ProsePart[][] }
  | { kind: 'ul'; items: ProsePart[][] }
  | { kind: 'code'; language: string; code: string }
  | { kind: 'chips'; items: { href: string; text: string }[] }
  | { kind: 'callouts'; items: { title: string; body: string }[] }
  | {
      kind: 'cards';
      items: { href: string; title: string; body: string; index?: string }[];
    };

/**
 * One translatable docs page body. Code blocks and API identifiers stay in
 * English inside every locale; `{count}`-style placeholders are filled by the
 * renderer from generated values such as the component count.
 */
export type DocsPageCopy = {
  /** Version banner above the title (Introduction only). */
  banner?: ProsePart[];
  whatsNew?: string;
  title: string;
  lead: ProsePart[];
  blocks: ProseBlock[];
};

export type DocsPageId = 'introduction' | 'gettingStarted';

export type DocsCopyByLocale = Record<Locale, DocsPageCopy>;
