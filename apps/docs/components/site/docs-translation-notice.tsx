'use client';

import { usePathname } from 'next/navigation';
import { LOCALE_LABELS } from '@slipstream-ui/i18n';
import { useI18n } from '@slipstream-ui/i18n/react';
import { TRANSLATED_DOC_PATHS } from '@/lib/docs-copy';
import { SITE } from '@/lib/site';

/**
 * Docs bodies are still English-only on most routes. Rather than shipping a
 * half-translated page silently, non-English readers get an explicit note plus
 * a one-click way to help translate the page they are reading. Routes listed
 * in `TRANSLATED_DOC_PATHS` carry a full translation and skip the note.
 */
export function DocsTranslationNotice() {
  const { locale, t } = useI18n();
  const pathname = usePathname();

  if (locale === 'en') return null;
  if (TRANSLATED_DOC_PATHS.includes(pathname)) return null;

  const label = LOCALE_LABELS[locale];
  const issueHref =
    `${SITE.repo}/issues/new` +
    `?title=${encodeURIComponent(t('site.translation.issueTitle', { locale: label }))}` +
    `&body=${encodeURIComponent(
      t('site.translation.issueBody', {
        locale: label,
        url: `${SITE.url}${pathname}`,
      })
    )}`;

  return (
    <aside className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
      <p className="font-medium">{t('site.translation.title')}</p>
      <p className="mt-1 text-muted-foreground">{t('site.translation.body')}</p>
      <a
        href={issueHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline"
      ><span className="sr-only"> (opens in new tab)</span>
        {t('site.translation.help')}
        <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}
