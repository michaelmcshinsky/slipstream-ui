'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Current page number (1-based). */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the new page number. */
  onPageChange?: (page: number) => void;
  /** How many page buttons to show around the current page (default 1). */
  siblings?: number;
}

/**
 * Numeric pagination with prev/next and ellipsis. Renders as a nav
 * landmark with aria-current="page" on the active button. Keyboard
 * users tab through buttons; each is a real <button> with a label.
 */
const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ page, pageCount, onPageChange, siblings = 1, className, ...props }, ref) => {
    // Build the page number list with ellipsis markers.
    const pages: (number | 'ellipsis')[] = [];
    const start = Math.max(2, page - siblings);
    const end = Math.min(pageCount - 1, page + siblings);

    pages.push(1);
    if (start > 2) pages.push('ellipsis');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < pageCount - 1) pages.push('ellipsis');
    if (pageCount > 1) pages.push(pageCount);

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn('flex items-center justify-center gap-1', className)}
        {...props}
      >
        <button
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={cn(
            'inline-flex h-8 items-center rounded-md border border-border px-2.5 text-sm transition-colors',
            'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          ‹
        </button>
        {pages.map((entry, index) =>
          entry === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange?.(entry)}
              aria-current={entry === page ? 'page' : undefined}
              aria-label={`Page ${entry}`}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                entry === page
                  ? 'border-primary bg-primary text-primary-foreground font-medium'
                  : 'border-border hover:bg-muted'
              )}
            >
              {entry}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className={cn(
            'inline-flex h-8 items-center rounded-md border border-border px-2.5 text-sm transition-colors',
            'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          ›
        </button>
      </nav>
    );
  }
);
Pagination.displayName = 'Pagination';

export { Pagination };
