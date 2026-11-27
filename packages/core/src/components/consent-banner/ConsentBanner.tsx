'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';

export type ConsentBannerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Called when the visitor accepts (all purposes granted). */
  onAccept: () => void;
  /** Called when the visitor declines (all purposes denied). */
  onDecline: () => void;
  /** Optional "manage preferences" action for granular consent dialogs. */
  onManage?: () => void;
  /** Banner heading. Omit for a single-line notice. */
  title?: React.ReactNode;
  /** Body copy; put privacy-policy links here. */
  children?: React.ReactNode;
  /** Accessible name for the banner region. Default 'Cookie consent'. */
  label?: string;
  acceptLabel?: React.ReactNode;
  declineLabel?: React.ReactNode;
  manageLabel?: React.ReactNode;
};

/**
 * Styled cookie/consent banner: a fixed bottom bar with accept, decline and
 * an optional manage-preferences action. Presentational only — wire it to
 * `useConsent` (or your own store) and render it conditionally:
 *
 * ```tsx
 * const consent = useConsent({ purposes: ['analytics'] });
 * {!consent.decided && (
 *   <ConsentBanner
 *     onAccept={() => consent.setAll(true)}
 *     onDecline={() => consent.setAll(false)}
 *   >
 *     We use cookies for analytics.{' '}
 *     <a href="/privacy">Privacy policy</a>
 *   </ConsentBanner>
 * )}
 * ```
 */
export const ConsentBanner = React.forwardRef<HTMLDivElement, ConsentBannerProps>(
  function ConsentBanner(
    {
      onAccept,
      onDecline,
      onManage,
      title,
      children,
      label = 'Cookie consent',
      acceptLabel = 'Accept',
      declineLabel = 'Decline',
      manageLabel = 'Manage',
      className,
      ...props
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg sm:px-6',
          className
        )}
        {...props}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title && <p className="text-sm font-medium text-foreground">{title}</p>}
            {children && <div className="text-sm text-muted-foreground">{children}</div>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {onManage && (
              <Button type="button" variant="ghost" size="sm" onClick={onManage}>
                {manageLabel}
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={onDecline}>
              {declineLabel}
            </Button>
            <Button type="button" size="sm" onClick={onAccept}>
              {acceptLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
