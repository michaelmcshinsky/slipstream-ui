import { cookies } from 'next/headers';
import {
  getMessages,
  resolveLocale,
  translate,
  type Locale,
  type MessageKey,
  type MessageParams,
} from '@slipstream-ui/i18n';
import { SITE } from '@/lib/site';
import { VERSION } from '@/lib/version';
import { COMPONENT_COUNT } from '@/lib/component-count';

export const LOCALE_COOKIE = 'slipstream-locale';

/** Reads the locale cookie on the server (marketing pages are server components). */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function getServerI18n(): Promise<{
  locale: Locale;
  t: (key: MessageKey, params?: MessageParams) => string;
}> {
  const locale = await getServerLocale();
  const messages = getMessages(locale);
  return { locale, t: (key, params) => translate(messages, key, params) };
}

/** Values available to marketing copy placeholders such as `{repo}`. */
export function marketingVars(): Record<string, string | number> {
  return {
    repo: SITE.repo,
    githubProfile: SITE.social.github,
    email: SITE.contact.email,
    version: VERSION,
    componentCount: COMPONENT_COUNT,
  };
}
