'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type PaginationIcons = {
  /** Glyph/slot for the jump-to-first button. */
  first?: React.ReactNode;
  /** Glyph/slot for the previous-page button. */
  previous?: React.ReactNode;
  /** Glyph/slot for the next-page button. */
  next?: React.ReactNode;
  /** Glyph/slot for the jump-to-last button. */
  last?: React.ReactNode;
};

export type PaginationProps = React.HTMLAttributes<HTMLElement> & {
  /** Current page number (1-based). Alias: currentPage. */
  page?: number;
  /** Total number of pages. Alias: totalPages (or derived from total/pageSize). */
  pageCount?: number;
  /** Alias for page (migration-friendly). */
  currentPage?: number;
  /** Alias for pageCount. */
  totalPages?: number;
  /** Rows per page — with `total`, enables the item-count summary. */
  pageSize?: number;
  /** Total item count — with `pageSize`, enables the summary and derives pageCount. */
  total?: number;
  /** Noun used in the summary ("Showing 26–50 of 312 classes"). Default "items". */
  itemLabel?: string;
  /** Force the summary on/off; defaults to on when total and pageSize are set. */
  showSummary?: boolean;
  /** Called with the new page number. */
  onPageChange?: (page: number) => void;
  /** How many page buttons to show around the current page (default 1). */
  siblings?: number;
  /** Show « / » jump-to-first/last buttons (default false). */
  showBoundaries?: boolean;
  /** Force-show the first-page button; defaults to showBoundaries. */
  showFirst?: boolean;
  /** Force-show the last-page button; defaults to showBoundaries. */
  showLast?: boolean;
  /** Replace the default ‹ › « » glyphs. */
  icons?: PaginationIcons;
};

const controlClass =
  'inline-flex h-8 items-center rounded-md border border-border px-2.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

/**
 * Numeric pagination with prev/next and optional boundary jumps. Renders
 * as a nav landmark with aria-current="page" on the active button. Accepts
 * either page/pageCount or the currentPage/totalPages aliases, and can
 * derive the page count (plus a "Showing X–Y of Z" summary) from
 * total/pageSize.
 */
const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page: pageProp,
      pageCount: pageCountProp,
      currentPage,
      totalPages,
      pageSize,
      total,
      itemLabel = 'items',
      showSummary,
      onPageChange,
      siblings = 1,
      showBoundaries = false,
      showFirst,
      showLast,
      icons,
      className,
      ...props
    },
    ref
  ) => {
    const page = pageProp ?? currentPage ?? 1;
    const derivedPageCount =
      total !== undefined && pageSize !== undefined && pageSize > 0 ? Math.ceil(total / pageSize) : undefined;
    const pageCount = Math.max(1, pageCountProp ?? totalPages ?? derivedPageCount ?? 1);

    // Build the page number list with ellipsis markers.
    const pages: (number | 'ellipsis')[] = [];
    const start = Math.max(2, page - siblings);
    const end = Math.min(pageCount - 1, page + siblings);

    pages.push(1);
    if (start > 2) pages.push('ellipsis');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < pageCount - 1) pages.push('ellipsis');
    if (pageCount > 1) pages.push(pageCount);

    const withFirst = showFirst ?? showBoundaries;
    const withLast = showLast ?? showBoundaries;

    const summaryEnabled = showSummary ?? (total !== undefined && pageSize !== undefined);
    const rangeStart = pageSize !== undefined ? (page - 1) * pageSize + 1 : undefined;
    const rangeEnd =
      pageSize !== undefined && total !== undefined ? Math.min(total, page * pageSize) : undefined;

    const nav = (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn('flex items-center justify-center gap-1', summaryEnabled ? undefined : className)}
        {...props}
      >
        {withFirst && (
          <button
            type="button"
            onClick={() => onPageChange?.(1)}
            disabled={page <= 1}
            aria-label="First page"
            className={controlClass}
          >
            {icons?.first ?? '«'}
          </button>
        )}
        <button
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={controlClass}
        >
          {icons?.previous ?? '‹'}
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
          className={controlClass}
        >
          {icons?.next ?? '›'}
        </button>
        {withLast && (
          <button
            type="button"
            onClick={() => onPageChange?.(pageCount)}
            disabled={page >= pageCount}
            aria-label="Last page"
            className={controlClass}
          >
            {icons?.last ?? '»'}
          </button>
        )}
      </nav>
    );

    if (!summaryEnabled) return nav;

    return (
      <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
        <p className="text-sm text-muted-foreground">
          {rangeStart !== undefined && rangeEnd !== undefined && total !== undefined
            ? `Showing ${rangeStart}–${rangeEnd} of ${total} ${itemLabel}`
            : `Page ${page} of ${pageCount}`}
        </p>
        {nav}
      </div>
    );
  }
);
Pagination.displayName = 'Pagination';

export { Pagination };
