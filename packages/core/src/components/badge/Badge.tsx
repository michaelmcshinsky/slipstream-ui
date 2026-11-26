import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        // Aliases used by shadcn/Bootstrap-style codebases.
        primary: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        // Neutral pill for metadata (counts, categories) and a tinted
        // brand accent that stays readable on the page surface.
        neutral: 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
        accent: 'border-transparent bg-accent text-accent-foreground hover:bg-accent/80',
        danger: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success: 'border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning: 'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
        info: 'border-transparent bg-info text-info-foreground hover:bg-info/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Quiet outline tones for status metadata (directory chips, filter
        // tags): tinted border and ink text, subtle tint on hover. Follows the
        // Alert/Button outline language.
        'outline-success': 'border-success/50 bg-background text-success-ink hover:bg-success/10',
        'outline-warning': 'border-warning/50 bg-background text-warning-ink hover:bg-warning/10',
        'outline-info': 'border-info/50 bg-background text-info-ink hover:bg-info/10',
        'outline-danger': 'border-destructive/50 bg-background text-destructive hover:bg-destructive/10',
      },
      size: {
        sm: 'px-2 py-0 text-[11px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    /** Render the child element (e.g. a router Link) with badge styling. */
    asChild?: boolean;
    /**
     * Leading status dot, colored to match the variant. Decorative only —
     * pair it with text that carries the meaning.
     */
    dot?: boolean;
  };

/** Dot fill per variant: foreground ink on solid fills, tone color on outlines. */
const dotVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-primary-foreground',
  primary: 'bg-primary-foreground',
  neutral: 'bg-muted-foreground',
  accent: 'bg-accent-foreground',
  danger: 'bg-destructive-foreground',
  destructive: 'bg-destructive-foreground',
  success: 'bg-success-foreground',
  warning: 'bg-warning-foreground',
  info: 'bg-info-foreground',
  secondary: 'bg-secondary-foreground',
  outline: 'bg-foreground',
  'outline-success': 'bg-success',
  'outline-warning': 'bg-warning',
  'outline-info': 'bg-info',
  'outline-danger': 'bg-destructive',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, asChild = false, dot = false, children, ...props }, ref) => {
    const classNames = cn(badgeVariants({ variant, size }), dot && 'gap-1.5', className);
    const dotEl = dot ? (
      <span
        aria-hidden="true"
        className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotVariants[variant ?? 'default'])}
      />
    ) : null;

    if (asChild) {
      // Slot accepts one slottable child; Slottable keeps the dot as a
      // sibling rendered inside the slotted element.
      return (
        <Slot ref={ref} className={classNames} {...props}>
          {dotEl}
          <Slottable>{children}</Slottable>
        </Slot>
      );
    }

    return (
      <span ref={ref} className={classNames} {...props}>
        {dotEl}
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
