'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type FilterChip = {
  /** Stable key for the filter. */
  key: string;
  /** Filter name (e.g. "Industry"). */
  label: string;
  /** Selected value (e.g. "Technology"). */
  value?: string;
  /** Removes this filter. */
  onRemove?: () => void;
};

export type FilterChipsProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Active filters to render. */
  filters: FilterChip[];
  /** Shows a clear-all action when provided. */
  onClearAll?: () => void;
  /** Label for the clear-all action. Default "Clear all". */
  clearLabel?: string;
  /** Shown when there are no active filters. Nothing renders when omitted. */
  emptyLabel?: string;
};

/**
 * Active-filter summary for list and dashboard pages. Each chip pairs a
 * filter name with its current value and exposes a remove action; an optional
 * clear-all action resets the set. Use it under FilterBar or FilterPanel so
 * applied filters stay visible after the controls scroll away.
 */
export const FilterChips = React.forwardRef<HTMLDivElement, FilterChipsProps>(function FilterChips(
  {
    filters,
    onClearAll,
    clearLabel = 'Clear all',
    emptyLabel,
    className,
    'aria-label': ariaLabel = 'Active filters',
    ...props
  },
  ref
) {
  if (filters.length === 0) {
    return emptyLabel ? (
      <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props}>
        {emptyLabel}
      </div>
    ) : null;
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={cn('flex flex-wrap items-center gap-2', className)}
      {...props}
    >
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-muted/60 py-1 pl-3 pr-1 text-sm"
        >
          <span className="truncate">
            <span className="text-muted-foreground">{filter.label}:</span>{' '}
            <span className="font-medium">{filter.value ?? 'Any'}</span>
          </span>
          {filter.onRemove && (
            <button
              type="button"
              onClick={filter.onRemove}
              aria-label={`Remove ${filter.label}${filter.value ? `: ${filter.value}` : ''}`}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          )}
        </span>
      ))}
      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-sm px-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
});
