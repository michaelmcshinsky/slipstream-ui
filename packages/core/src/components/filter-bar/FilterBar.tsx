'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';
import { Input } from '../input/Input';

export type FilterBarProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Controlled search text. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Search placeholder; the search box is hidden when omitted. */
  searchPlaceholder?: string;
  /** Rendered after the search box — selects, toggles, date pickers. */
  children?: React.ReactNode;
  /** Shows a reset button when provided (pass the active filter count for the label). */
  onReset?: () => void;
  activeCount?: number;
  /** Opens a filter panel or mobile filter drawer. */
  onOpenFilters?: () => void;
  /** Filter button label. Default "Filters". */
  filtersLabel?: string;
  /** Result count shown before the trailing slot. */
  resultsCount?: number;
  /** Noun for the result count. Default "results". */
  resultsLabel?: string;
  /** Rendered at the far right (bulk actions, column settings). */
  trailing?: React.ReactNode;
};

/**
 * Horizontal filter strip for list pages: search field, filter controls and
 * a reset affordance. Scrolls horizontally on narrow screens instead of
 * wrapping into a tall stack.
 */
export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  {
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search…',
    onReset,
    activeCount = 0,
    onOpenFilters,
    filtersLabel = 'Filters',
    resultsCount,
    resultsLabel = 'results',
    trailing,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      role="search"
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2',
        className
      )}
      {...props}
    >
      {onSearchChange !== undefined && (
        <Input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-9 w-full min-w-40 flex-1 sm:w-auto"
        />
      )}
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      {onOpenFilters && (
        <Button type="button" variant="outline" size="sm" onClick={onOpenFilters}>
          {filtersLabel}
          {activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
      )}
      {onReset && (
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset{activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
      )}
      {resultsCount !== undefined && (
        <span className="ml-auto text-sm text-muted-foreground">
          {resultsCount} {resultsLabel}
        </span>
      )}
      {trailing && <div className={cn('flex items-center gap-2', resultsCount === undefined && 'ml-auto')}>{trailing}</div>}
    </div>
  );
});
