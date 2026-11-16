'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@slipstream-ui/i18n/react';
import { track } from '@/lib/analytics';

const REPO_URL = 'https://github.com/michaelmcshinsky/slipstream-ui';

/**
 * "Was this page helpful?" — feedback routes to a pre-filled GitHub issue, so
 * no backend is required. Resets when the reader navigates to another page.
 */
export function PageFeedback() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [pathname]);

  const issueBody = (reason?: string) =>
    encodeURIComponent(
      `Page: https://slipstreamui.com${pathname}\n` +
        (reason ? `Problem: ${reason}\n` : '') +
        `\nWhat I expected:\n\n\nWhat happened:\n\n\nFramework / package version (if relevant):\n\n`
    );
  const issueHref = `${REPO_URL}/issues/new?title=${encodeURIComponent(
    t('site.feedback.issueTitle', { path: pathname })
  )}&body=${issueBody()}`;

  const reasons = [
    { id: 'example', label: 'The example did not work' },
    { id: 'install', label: 'Installation failed' },
    { id: 'missing', label: 'Something is missing' },
  ] as const;

  if (answer === 'yes') {
    return (
      <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground" role="status">
        {t('site.feedback.thanks')}
      </p>
    );
  }

  if (answer === 'no') {
    return (
      <div className="mt-10 border-t border-border pt-6 text-sm" role="status">
        <p className="text-muted-foreground">
          {t('site.feedback.sorryLead')}{' '}
          <a href={issueHref} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            {t('site.feedback.issueLink')}
          </a>{' '}
          {t('site.feedback.sorryTail')}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {reasons.map((reason) => (
            <a
              key={reason.id}
              href={`${REPO_URL}/issues/new?title=${encodeURIComponent(
                t('site.feedback.issueTitle', { path: pathname })
              )}&body=${issueBody(reason.label)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('feedback_reason', { reason: reason.id, path: pathname })}
              className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {reason.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAnswer(null)}
          className="mt-2 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          {t('site.feedback.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6 text-sm">
      <span className="text-muted-foreground">{t('site.feedback.question')}</span>
      <button
        type="button"
        onClick={() => {
          track('feedback', { helpful: 'yes' });
          setAnswer('yes');
        }}
        className="rounded-md border border-border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
      >
        {t('site.feedback.yes')}
      </button>
      <button
        type="button"
        onClick={() => {
          track('feedback', { helpful: 'no' });
          setAnswer('no');
        }}
        className="rounded-md border border-border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
      >
        {t('site.feedback.no')}
      </button>
    </div>
  );
}
