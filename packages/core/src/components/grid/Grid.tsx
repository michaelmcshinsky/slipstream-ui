import * as React from 'react';
import { cn } from '../../utils/cn';

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const;

// Literal class maps — Tailwind's scanner only keeps classes it can see in
// source, so every col-span/columns combination must appear verbatim here.
const BASE_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};
const SM_COLS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
};
const MD_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};
const LG_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};
const COL_SPAN: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
};
const SM_COL_SPAN: Record<number, string> = {
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
  5: 'sm:col-span-5',
  6: 'sm:col-span-6',
};
const MD_COL_SPAN: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
};
const LG_COL_SPAN: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
};

export type GridProps = React.HTMLAttributes<HTMLElement> & {
  /** Base column count (1-6). */
  cols?: number;
  /** Columns from the sm breakpoint up (1-6). */
  smCols?: number;
  /** Columns from the md breakpoint up (1-6). */
  mdCols?: number;
  /** Columns from the lg breakpoint up (1-6). */
  lgCols?: number;
  /**
   * Auto-fit mode: repeat(auto-fit, minmax(<minCol>, 1fr)) — cards wrap
   * responsively without per-breakpoint column math. Overrides cols*.
   */
  minCol?: string;
  /** Token gap between cells. */
  gap?: keyof typeof gapClasses;
  /** Semantic element (default 'div'). */
  as?: 'div' | 'span' | 'section' | 'ul';
};

/**
 * Layout grid container with typed column counts (literal Tailwind classes,
 * so utilities survive CSS purging) and an auto-fit min-column mode for
 * card grids. Pair with GridItem for per-cell spans.
 */
const Grid = React.forwardRef<HTMLElement, GridProps>(
  ({ cols, smCols, mdCols, lgCols, minCol, gap = 'md', as = 'div', className, style, ...props }, ref) => {
    const Tag = as as 'div' | 'span' | 'section' | 'ul';
    return (
      <Tag
        ref={ref as never}
        className={cn(
          'grid min-w-0',
          !minCol && cols && BASE_COLS[cols],
          !minCol && smCols && SM_COLS[smCols],
          !minCol && mdCols && MD_COLS[mdCols],
          !minCol && lgCols && LG_COLS[lgCols],
          gapClasses[gap],
          className
        )}
        style={minCol ? { gridTemplateColumns: `repeat(auto-fit, minmax(${minCol}, 1fr))`, ...style } : style}
        {...props}
      />
    );
  }
);
Grid.displayName = 'Grid';

export type GridItemProps = React.HTMLAttributes<HTMLElement> & {
  /** Column span at the base breakpoint (1-6). */
  span?: number;
  /** Column span from the sm breakpoint up (1-6). */
  smSpan?: number;
  /** Column span from the md breakpoint up (1-6). */
  mdSpan?: number;
  /** Column span from the lg breakpoint up (1-6). */
  lgSpan?: number;
  /** Semantic element (default 'div'; 'li' pairs with as="ul" on Grid). */
  as?: 'div' | 'span' | 'li';
};

/** Per-cell column spans for a Grid container. */
const GridItem = React.forwardRef<HTMLElement, GridItemProps>(
  ({ span, smSpan, mdSpan, lgSpan, as = 'div', className, ...props }, ref) => {
    const Tag = as as 'div' | 'span' | 'li';
    return (
      <Tag
        ref={ref as never}
        className={cn(
          span && COL_SPAN[span],
          smSpan && SM_COL_SPAN[smSpan],
          mdSpan && MD_COL_SPAN[mdSpan],
          lgSpan && LG_COL_SPAN[lgSpan],
          className
        )}
        {...props}
      />
    );
  }
);
GridItem.displayName = 'GridItem';

export { Grid, GridItem };
