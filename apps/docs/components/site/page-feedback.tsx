'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

const REPO_URL = 'https://github.com/michaelmcshinsky/slipstream-ui';

/**
 * "Was this page helpful?" — feedback routes to a pre-filled GitHub issue, so
 * no backend is required. Resets when the reader navigates to another page.
 */
export function PageFeedback() {
  const pathname = usePathname();
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [pathname]);

  const issueHref =
    `${REPO_URL}/issues/new` +
    `?title=${encodeURIComponent(`Docs feedback: ${pathname}`)}` +
    `&body=${encodeURIComponent(
      `Page: https://slipstreamui.com${pathname}\n\nWhat was missing or wrong?\n`
    )}`;

  if (answer === 'yes') {
    return (
      <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground" role="status">
        Thanks — glad it helped.
      </p>
    );
  }

  if (answer === 'no') {
    return (
      <div className="mt-10 border-t border-border pt-6 text-sm" role="status">
        <p className="text-muted-foreground">
          Sorry about that —{' '}
          <a href={issueHref} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            open a pre-filled issue
          </a>{' '}
          and tell us what was missing or wrong.
        </p>
        <button
          type="button"
          onClick={() => setAnswer(null)}
          className="mt-2 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6 text-sm">
      <span className="text-muted-foreground">Was this page helpful?</span>
      <button
        type="button"
        onClick={() => {
          track('feedback', { helpful: 'yes' });
          setAnswer('yes');
        }}
        className="rounded-md border border-border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => {
          track('feedback', { helpful: 'no' });
          setAnswer('no');
        }}
        className="rounded-md border border-border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
      >
        No
      </button>
    </div>
  );
}
