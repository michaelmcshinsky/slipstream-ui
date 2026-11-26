'use client';

import { usePathname } from 'next/navigation';

const REPO = 'https://github.com/michaelmcshinsky/slipstream-ui';
const SITE = 'https://slipstreamui.com';

/**
 * Per-page maintenance links. The edit target is derived from the App Router
 * file for the route; a missing file simply opens GitHub's "create file" flow,
 * so no lookup table can go stale.
 */
export function DocsPageMeta() {
  const pathname = usePathname() || '/docs';
  const editPath = `apps/docs/app${pathname.replace(/\/$/, '')}/page.tsx`;
  const editHref = `${REPO}/edit/main/${editPath}`;
  const title = encodeURIComponent(`Accessibility issue on ${pathname}`);
  const body = encodeURIComponent(
    `Page: ${SITE}${pathname}\n\nWhat happened:\n\n\nWhat you expected:\n\n\nAssistive technology / browser:\n\n`
  );
  const a11yHref = `${REPO}/issues/new?labels=accessibility&title=${title}&body=${body}`;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
      <a href={editHref} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-foreground hover:underline"><span className="sr-only"> (opens in new tab)</span>
        Edit this page on GitHub
      </a>
      <a href={a11yHref} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-foreground hover:underline"><span className="sr-only"> (opens in new tab)</span>
        Report an accessibility issue
      </a>
    </div>
  );
}
