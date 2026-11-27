import * as React from 'react';
import { cn } from '../../utils/cn';

export type ListToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Number of matching results; renders "{count} {countLabel}". */
  count?: number;
  /** Noun for the result count. Default "results". */
  countLabel?: string;
  /** Page/range position text, e.g. "Page 2 of 5" or "Showing 21–40 of 137". */
  position?: React.ReactNode;
  /** Muted note at the end of the summary line, e.g. "Sorted by date, soonest first". */
  note?: React.ReactNode;
  /** Controls rendered at the far end: SegmentedControl view switch, sort Select. */
  children?: React.ReactNode;
  /** Distribution of the bar. Default 'between' (summary left, controls right). */
  align?: 'between' | 'start' | 'center' | 'end';
};

const alignClasses = {
  between: 'justify-between',
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
} as const;

/**
 * Slim result bar for filtered lists and directories: result count, optional
 * page position and a "sorted by" note on the left; a view switch (e.g.
 * SegmentedControl in link mode) and sort control on the right. Pair with
 * FilterBar for the input row above and Pagination below.
 */
export function ListToolbar({
  count,
  countLabel = 'results',
  position,
  note,
  align = 'between',
  className,
  children,
  ...props
}: ListToolbarProps) {
  const hasSummary = count !== undefined || position !== undefined || note !== undefined;
  return (
    <div
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 text-sm', alignClasses[align], className)}
      {...props}
    >
      {hasSummary && (
        <p className="flex flex-wrap items-baseline gap-x-2 text-muted-foreground" aria-live="polite">
          {count !== undefined && (
            <span className="font-medium text-foreground">
              {count} {countLabel}
            </span>
          )}
          {position && <span>{position}</span>}
          {note && <span className="text-xs">{note}</span>}
        </p>
      )}
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

ListToolbar.displayName = 'ListToolbar';
