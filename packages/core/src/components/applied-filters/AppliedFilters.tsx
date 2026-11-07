'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';
import { FilterChips, type FilterChip } from '../filter-chips/FilterChips';

export type AppliedFiltersProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Active filters to display. */
  filters: FilterChip[];
  /** Clear-all action. */
  onClearAll?: () => void;
  /** Opens the filter panel for editing. */
  onEdit?: () => void;
  /** Optional summary text; defaults to "N active". */
  label?: string;
  /** Shown when there are no filters. */
  emptyLabel?: string;
  /** Edit action label. Default "Edit filters". */
  editLabel?: string;
};

/**
 * Applied-filter summary for a dashboard or directory. Adds a live count and
 * an optional edit action around FilterChips, so the applied set stays visible
 * even when the filter panel is closed.
 */
export const AppliedFilters = React.forwardRef<HTMLDivElement, AppliedFiltersProps>(
  function AppliedFilters(
    {
      filters,
      onClearAll,
      onEdit,
      label,
      emptyLabel,
      editLabel = 'Edit filters',
      className,
      ...props
    },
    ref
  ) {
    const summary = label ?? `${filters.length} active`;

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
        aria-live="polite"
        className={cn('flex flex-wrap items-center gap-2', className)}
        {...props}
      >
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{summary}</span>
        <FilterChips filters={filters} onClearAll={onClearAll} />
        {onEdit && (
          <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
            {editLabel}
          </Button>
        )}
      </div>
    );
  }
);
