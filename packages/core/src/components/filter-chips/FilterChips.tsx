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
  /** Chip scale. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a clear-all action when provided. */
  onClearAll?: () => void;
  /** Label for the clear-all action. Default "Clear all". */
  clearLabel?: string;
  /** Shown when there are no active filters. Nothing renders when omitted. */
  emptyLabel?: string;
};

/** Literal size maps so the scanner keeps every chip utility. */
const CHIP_SIZES = {
  sm: {
    chip: 'gap-1 py-0.5 pl-2.5 pr-0.5 text-xs',
    remove: 'p-0.5',
    icon: 'h-3 w-3',
    clear: 'text-xs',
  },
  md: {
    chip: 'gap-1.5 py-1 pl-3 pr-1 text-sm',
    remove: 'p-1',
    icon: 'h-3.5 w-3.5',
    clear: 'text-sm',
  },
  lg: {
    chip: 'gap-2 py-1.5 pl-3.5 pr-1.5 text-base',
    remove: 'p-1.5',
    icon: 'h-4 w-4',
    clear: 'text-base',
  },
} as const;

/**
 * Active-filter summary for list and dashboard pages. Each chip pairs a
 * filter name with its current value and exposes a remove action; an optional
 * clear-all action resets the set. Use it under FilterBar or FilterPanel so
 * applied filters stay visible after the controls scroll away.
 */
export const FilterChips = React.forwardRef<HTMLDivElement, FilterChipsProps>(function FilterChips(
  {
    filters,
    size = 'md',
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

  const scale = CHIP_SIZES[size];

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
          className={cn(
            'inline-flex max-w-full items-center rounded-full border border-border bg-muted/60',
            scale.chip
          )}
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
              className={cn(
                'rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                scale.remove
              )}
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className={scale.icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
          className={cn(
            'rounded-sm px-1 font-medium text-primary-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            scale.clear
          )}
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
});
