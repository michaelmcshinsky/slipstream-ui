import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground motion-reduce:animate-none',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label announced to screen readers; set aria-hidden when purely decorative. */
  label?: string;
}

function Spinner({ className, size, label = 'Loading...', ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner, spinnerVariants };
