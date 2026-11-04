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
      {onReset && (
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset{activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
      )}
      {trailing && <div className="ml-auto flex items-center gap-2">{trailing}</div>}
    </div>
  );
});
