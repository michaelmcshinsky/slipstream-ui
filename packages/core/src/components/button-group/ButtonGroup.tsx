import * as React from 'react';
import { cn } from '../../utils/cn';

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Stacked segments share vertical edges (default: side-by-side). */
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Joins buttons into one segmented control.
 *
 * The group owns the outline: a single border, one outer radius (children
 * are clipped by overflow-hidden), and 1px separators drawn between
 * segments. Children lose their own borders and radii, so mixed variants
 * (default/outline/secondary/ghost) still read as one instrument — a
 * borderless variant no longer leaves the seam misaligned the way
 * negative-margin border collapsing did.
 *
 * Focus rings render inset so they are never clipped at the edges.
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="button-group"
      role="group"
      className={cn(
        'inline-flex overflow-hidden rounded-md border border-border bg-background',
        '[&>*]:rounded-none [&>*]:border-0',
        '[&>*:focus-visible]:ring-inset [&>*:focus-visible]:ring-offset-0',
        // divide-* compiles to `.group > * ~ * { border-left/top }` — higher
        // specificity than the lead-strip above, so seams stay exact.
        orientation === 'horizontal'
          ? 'divide-x divide-border'
          : 'flex-col divide-y divide-border',
        className
      )}
      {...props}
    />
  )
);
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
