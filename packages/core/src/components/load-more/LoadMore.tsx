'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';

export type LoadMoreProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Whether another page is available. */
  hasMore: boolean;
  /** Request the next page. */
  onLoadMore: () => void;
  /** Loading state. */
  loading?: boolean;
  /** Button label. Default "Load more". */
  loadLabel?: string;
  /** Loading label. Default "Loading...". */
  loadingLabel?: string;
  /** End-of-list message. Default "You're all caught up." */
  endLabel?: string;
};

/**
 * Load-more control for paginated lists without page numbers. While loading it
 * disables the button and sets aria-busy; at the end it replaces the button
 * with a polite status message.
 */
export const LoadMore = React.forwardRef<HTMLDivElement, LoadMoreProps>(function LoadMore(
  {
    hasMore,
    onLoadMore,
    loading = false,
    loadLabel = 'Load more',
    loadingLabel = 'Loading...',
    endLabel = "You're all caught up.",
    className,
    ...props
  },
  ref
) {
  return (
    <div ref={ref} aria-live="polite" className={cn('flex w-full justify-center py-4', className)} {...props}>
      {hasMore ? (
        <Button type="button" variant="outline" onClick={onLoadMore} loading={loading}>
          {loading ? loadingLabel : loadLabel}
        </Button>
      ) : (
        <p role="status" className="text-sm text-muted-foreground">
          {endLabel}
        </p>
      )}
    </div>
  );
});
