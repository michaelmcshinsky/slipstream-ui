import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  /** Accessible label for the dividing line (e.g. "section break"). */
  label?: string;
}

/**
 * Visual divider between content blocks. Decorative by default
 * (`role="none"`); pass `label` to expose a semantic separator that
 * screen readers can announce.
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation, label, ...props }, ref) => (
    <div
      ref={ref}
      role={label ? 'separator' : 'none'}
      aria-label={label}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';

export { Separator, separatorVariants };
