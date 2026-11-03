import * as React from 'react';
import { cn } from '../../utils/cn';

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Stacked segments share vertical edges (default: side-by-side). */
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Joins buttons into one segmented control: adjacent borders collapse
 * (negative spacing), middle corners square off, and only the outer
 * corners stay rounded — a single outline around the whole group.
 * Use border-bearing variants (default/outline/secondary); ghost
 * buttons have no border and would break the joined outline.
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="button-group"
      role="group"
      className={cn(
        'inline-flex',
        orientation === 'horizontal'
          ? '-space-x-px [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md'
          : '-space-y-px [&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md',
        '[&>*]:rounded-none [&>*]:focus-visible:relative [&>*]:focus-visible:z-10',
        className
      )}
      {...props}
    />
  )
);
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
