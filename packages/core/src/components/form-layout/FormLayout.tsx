import * as React from 'react';
import { cn } from '../../utils/cn';
import { resolveGap, type GapValue } from '../../utils/gap';

// Literal classes so Tailwind's scanner keeps them (runtime-built
// grid-cols-${n} would be purged — same rule as Grid).
const GRID_COLUMNS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

const GRID_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const;

/** Column count per breakpoint; `base` applies at every width. */
export type FormLayoutColumns =
  | 1
  | 2
  | 3
  | 4
  | { base?: 1 | 2 | 3 | 4; sm?: 1 | 2 | 3 | 4; md?: 1 | 2 | 3 | 4; lg?: 1 | 2 | 3 | 4; xl?: 1 | 2 | 3 | 4 };

function gridColumnClasses(columns: FormLayoutColumns): string {
  if (typeof columns === 'number') return GRID_COLUMNS[columns];
  return [
    columns.base !== undefined ? GRID_COLUMNS[columns.base] : '',
    ...GRID_BREAKPOINTS.map((bp) => {
      const count = columns[bp];
      return count !== undefined ? `${bp}:${GRID_COLUMNS[count]}` : '';
    }),
  ]
    .filter(Boolean)
    .join(' ');
}

export type FormLayoutProps = React.HTMLAttributes<HTMLElement> & {
  /** Grouping layout: even vertical stack (default), horizontal row, or responsive grid. */
  layout?: 'stack' | 'row' | 'grid';
  /**
   * Grid column count (1-4) at every width, or per breakpoint
   * (`{ base: 1, md: 2 }`) for responsive grids without className overrides.
   */
  columns?: FormLayoutColumns;
  /** Even spacing between children — token ('md') or exact pixels (16). */
  gap?: GapValue;
  /** Group label; renders a semantic <legend> when as="fieldset". */
  legend?: string;
  /** Extra classes for the legend (fieldset mode). */
  legendClassName?: string;
  /** Supporting line under the legend (fieldset mode). */
  description?: string;
  /** Extra classes for the description (fieldset mode). */
  descriptionClassName?: string;
  /** Render as a semantic fieldset (default 'div'). */
  as?: 'div' | 'fieldset';
};

/**
 * Groups form fields with even, tokenized spacing — the layout half of
 * form composition (FormField/Fieldset provide the per-control semantics).
 * stack keeps one field per row, row flows fields inline, grid spreads
 * them across columns (1-4, literal classes so they survive purging).
 */
const FormLayout = React.forwardRef<HTMLElement, FormLayoutProps>(
  (
    {
      layout = 'stack',
      columns = 2,
      gap,
      legend,
      legendClassName,
      description,
      descriptionClassName,
      as = 'div',
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const Tag = as as 'div' | 'fieldset';
    const gapResolved = resolveGap(gap ?? 'md');
    return (
      <Tag
        ref={ref as never}
        className={cn(
          'flex min-w-0',
          layout === 'stack' && 'flex-col',
          layout === 'row' && 'flex-row flex-wrap items-end',
          layout === 'grid' && `grid ${gridColumnClasses(columns)}`,
          gapResolved.className,
          className
        )}
        style={{ ...gapResolved.style, ...style }}
        {...props}
      >
        {legend && as === 'fieldset' && (
          <legend className={cn('col-span-full p-0 text-sm font-medium leading-none', legendClassName)}>{legend}</legend>
        )}
        {description && as === 'fieldset' && (
          <p className={cn('col-span-full text-xs text-muted-foreground', descriptionClassName)}>{description}</p>
        )}
        {children}
      </Tag>
    );
  }
);
FormLayout.displayName = 'FormLayout';

export { FormLayout };
