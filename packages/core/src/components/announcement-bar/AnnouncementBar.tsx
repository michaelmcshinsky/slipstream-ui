'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type AnnouncementBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Message shown in the bar. */
  message: React.ReactNode;
  /** Optional destination for the action. */
  href?: string;
  /** Action text, shown when href is provided. */
  actionLabel?: string;
  /** Show a close control. Default true. */
  dismissible?: boolean;
  /** Called after the user dismisses the bar. */
  onDismiss?: () => void;
  /** Surface treatment. Default 'muted'. */
  tone?: 'muted' | 'brand' | 'inverse';
  /** Pin the bar to the top of the viewport. */
  sticky?: boolean;
  /** Custom link element for routers. */
  linkComponent?: React.ElementType;
};

const toneClasses = {
  muted: 'bg-muted text-foreground',
  brand: 'bg-primary text-primary-foreground',
  inverse: 'bg-inverse text-inverse-foreground',
} as const;

/**
 * Dismissible announcement bar for launches, content hubs and network notices.
 * It owns only dismissal; persistence and targeting belong to the caller.
 */
export const AnnouncementBar = React.forwardRef<HTMLDivElement, AnnouncementBarProps>(
  function AnnouncementBar(
    {
      message,
      href,
      actionLabel,
      dismissible = true,
      onDismiss,
      tone = 'muted',
      sticky = false,
      linkComponent,
      className,
      ...props
    },
    ref
  ) {
    const [dismissed, setDismissed] = React.useState(false);
    const Link = linkComponent ?? 'a';

    if (dismissed) return null;

    const dismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Announcement"
        className={cn(
          'w-full border-b border-border/60',
          toneClasses[tone],
          sticky && 'sticky top-0 z-30',
          className
        )}
        {...props}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm sm:px-6">
          <p className="min-w-0 text-center">{message}</p>
          {href && actionLabel && (
            <Link
              href={href}
              className="shrink-0 font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
              {actionLabel}
            </Link>
          )}
          {dismissible && (
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss announcement"
              className="shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);
