import * as React from 'react';
import { cn } from '../../utils/cn';
import { resolveGap, type GapValue } from '../../utils/gap';

export type FlexProps = React.HTMLAttributes<HTMLElement> & {
  /** Main axis direction. */
  direction?: 'row' | 'column';
  /** Cross-axis alignment (align-items). */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main-axis distribution (justify-content). */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Allow items to wrap onto multiple lines. */
  wrap?: boolean;
  /** Token gap ('md') or exact pixels (16) between children. */
  gap?: GapValue;
  /** Semantic element (default 'div'; 'span' keeps inline flow). */
  as?: 'div' | 'span' | 'section' | 'article' | 'nav' | 'header' | 'footer';
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

/**
 * Layout flex container — a typed, discoverable wrapper around
 * `display: flex` with token gaps. Children are plain elements; use
 * FlexItem for per-child grow/shrink/basis overrides.
 */
const Flex = React.forwardRef<HTMLElement, FlexProps>(
  (
    { direction = 'row', align, justify, wrap, gap = 'md', as = 'div', className, style, ...props },
    ref
  ) => {
    const Tag = as as 'div' | 'span' | 'section' | 'article' | 'nav' | 'header' | 'footer';
    const gapResolved = resolveGap(gap);
    return (
      <Tag
        ref={ref as never}
        className={cn(
          'flex min-w-0',
          direction === 'column' ? 'flex-col' : 'flex-row',
          wrap && 'flex-wrap',
          align && alignClasses[align],
          justify && justifyClasses[justify],
          gapResolved.className,
          className
        )}
        style={{ ...gapResolved.style, ...style }}
        {...props}
      />
    );
  }
);
Flex.displayName = 'Flex';

export type FlexItemProps = React.HTMLAttributes<HTMLElement> & {
  /** flex-grow — number or CSS-ish string (e.g. '1', '2'). */
  grow?: boolean | string;
  /** flex-shrink — number or CSS-ish string (e.g. '0'). */
  shrink?: boolean | string;
  /** flex-basis (e.g. '0', '200px', 'auto'). */
  basis?: string;
  /** Cross-axis alignment for this item (align-self). */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Semantic element (default 'div'). */
  as?: 'div' | 'span' | 'li' | 'figure';
};

const selfAlignClasses = {
  start: 'self-start',
  center: 'self-center',
  end: 'self-end',
  stretch: 'self-stretch',
  baseline: 'self-baseline',
} as const;

/** Per-child flex controls for a Flex container. */
const FlexItem = React.forwardRef<HTMLElement, FlexItemProps>(
  ({ grow, shrink, basis, align, as = 'div', className, ...props }, ref) => {
    const Tag = as as 'div' | 'span' | 'li' | 'figure';
    // Numeric/arb flex values go through style — Tailwind cannot compile
    // runtime-built arbitrary classes (grow-[${grow}]) they would be purged.
    const style: React.CSSProperties = {
      ...(grow === true ? { flexGrow: 1 } : typeof grow === 'string' && grow ? { flexGrow: grow } : {}),
      ...(shrink === false ? { flexShrink: 0 } : typeof shrink === 'string' && shrink ? { flexShrink: Number(shrink) || shrink } : {}),
      ...(basis ? { flexBasis: basis } : {}),
    };
    return (
      <Tag
        ref={ref as never}
        className={cn(align && selfAlignClasses[align], className)}
        style={Object.keys(style).length > 0 ? style : undefined}
        {...props}
      />
    );
  }
);
FlexItem.displayName = 'FlexItem';

export { Flex, FlexItem };
