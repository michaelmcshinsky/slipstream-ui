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
  /** Rows per page - with `total`, enables the item-count summary. */
  pageSize?: number;
  /** Total item count - with `pageSize`, enables the summary and derives pageCount. */
  total?: number;
  /** Noun used in the summary ("Showing 26-50 of 312 classes"). Default "items". */
  itemLabel?: string;
  /** Force the summary on/off; defaults to on when total and pageSize are set. */
  showSummary?: boolean;
  /** Called with the new page number (client-side pagination). */
  onPageChange?: (page: number) => void;
  /**
   * Page-number to href map. When provided, controls render as links
   * instead of buttons - use this for server-rendered pagination where
   * pages are real URLs. Serializable on purpose: a function cannot cross
   * the React Server Component boundary.
   */
  pageHrefs?: Record<number, string>;
  /** Custom link element for routers (Next Link, react-router Link). */
  linkComponent?: React.ElementType;
  /** Prop used to pass the destination to `linkComponent`. */
  linkHrefProp?: 'href' | 'to';
  /** How many page buttons to show around the current page (default 1). */
  siblings?: number;
  /** Show the jump-to-first/last buttons (default false). */
  showBoundaries?: boolean;
  /** Force-show the first-page button; defaults to showBoundaries. */
  showFirst?: boolean;
  /** Force-show the last-page button; defaults to showBoundaries. */
  showLast?: boolean;
  /** Replace the default < > glyphs. */
  icons?: PaginationIcons;
  /** Localized landmark and control labels. */
  labels?: {
    pagination?: string;
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
    page?: (page: number) => string;
  };
};

const controlClass =
  'inline-flex h-8 items-center rounded-md border border-border px-2.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
const controlDisabledClass = 'pointer-events-none opacity-50';
const pageClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
const pageActiveClass = 'border-primary bg-primary text-primary-foreground font-medium';
const pageIdleClass = 'border-border hover:bg-muted';

/**
 * Numeric pagination with prev/next and optional boundary jumps. Renders
 * as a nav landmark with aria-current="page" on the active page. Accepts
 * either page/pageCount or the currentPage/totalPages aliases, and can
 * derive the page count (plus a "Showing X-Y of Z" summary) from
 * total/pageSize.
 *
 * Two modes: pass `onPageChange` for client-side pagination, or
 * `pageHrefs` for server-rendered pagination where every page is a real
 * URL (the map is serializable, so it works from a Server Component).
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
      pageHrefs,
      linkComponent,
      linkHrefProp = 'href',
      siblings = 1,
      showBoundaries = false,
      showFirst,
      showLast,
      icons,
      labels,
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

    const linkMode = pageHrefs !== undefined;
    const LinkEl = linkComponent ?? 'a';
    const destination = (href: string) => (linkHrefProp === 'to' ? { to: href } : { href });
    const hrefFor = (target: number) => pageHrefs?.[target];

    /** One step control (first/prev/next/last) in either mode. */
    const step = (target: number, label: string, content: React.ReactNode, disabled: boolean) => {
      if (linkMode) {
        const href = hrefFor(target);
        if (disabled || href === undefined) {
          return (
            <span aria-label={label} aria-disabled="true" className={cn(controlClass, controlDisabledClass)}>
              {content}
            </span>
          );
        }
        return (
          <LinkEl {...destination(href)} aria-label={label} className={controlClass}>
            {content}
          </LinkEl>
        );
      }
      return (
        <button
          type="button"
          onClick={() => onPageChange?.(target)}
          disabled={disabled}
          aria-label={label}
          className={controlClass}
        >
          {content}
        </button>
      );
    };

    /** One numbered page control. */
    const pageItem = (entry: number) => {
      const isCurrent = entry === page;
      const label = labels?.page?.(entry) ?? `Page ${entry}`;
      const classes = cn(pageClass, isCurrent ? pageActiveClass : pageIdleClass);

      if (linkMode) {
        const href = hrefFor(entry);
        if (isCurrent || href === undefined) {
          return (
            <span key={entry} aria-current="page" aria-label={label} className={classes}>
              {entry}
            </span>
          );
        }
        return (
          <LinkEl key={entry} {...destination(href)} aria-label={label} className={classes}>
            {entry}
          </LinkEl>
        );
      }

      return (
        <button
          key={entry}
          type="button"
          onClick={() => onPageChange?.(entry)}
          aria-current={isCurrent ? 'page' : undefined}
          aria-label={label}
          className={classes}
        >
          {entry}
        </button>
      );
    };

    const nav = (
      <nav
        ref={ref}
        aria-label={labels?.pagination ?? 'Pagination'}
        className={cn('flex items-center justify-center gap-1', summaryEnabled ? undefined : className)}
        {...props}
      >
        {withFirst && step(1, labels?.first ?? 'First page', icons?.first ?? '«', page <= 1)}
        {step(page - 1, labels?.previous ?? 'Previous page', icons?.previous ?? '<', page <= 1)}
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
            pageItem(entry)
          )
        )}
        {step(page + 1, labels?.next ?? 'Next page', icons?.next ?? '>', page >= pageCount)}
        {withLast && step(pageCount, labels?.last ?? 'Last page', icons?.last ?? '»', page >= pageCount)}
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
