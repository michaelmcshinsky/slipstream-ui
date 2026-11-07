import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        // Semantic status variants — foregrounds are the paired AA tokens
        // (white on dark green, ink on amber/cyan) in both themes.
        success: 'bg-success text-success-foreground hover:bg-success/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        info: 'bg-info text-info-foreground hover:bg-info/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        // Colored outlines: semantic border + AA ink label on the page
        // surface, with a faint tint on hover - mirrors the Alert recipe.
        'outline-destructive':
          'border border-destructive/50 bg-background text-destructive hover:border-destructive hover:bg-destructive/10',
        'outline-success':
          'border border-success/50 bg-background text-success hover:border-success hover:bg-success/10',
        'outline-warning':
          'border border-warning/50 bg-background text-warning-ink hover:border-warning hover:bg-warning/10',
        'outline-info':
          'border border-info/50 bg-background text-info-ink hover:border-info hover:bg-info/10',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // High-contrast fills for hero and other always-dark surfaces. These
        // do not read the theme surface, so they stay legible in both modes.
        // Fixed ink, not --primary: in dark mode --primary lightens and would
        // sit at low contrast on the white surface.
        contrast: 'bg-white text-slate-900 shadow-sm hover:bg-slate-100',
        onDark:
          'border border-white/45 bg-transparent text-white hover:border-white/70 hover:bg-white/10',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  /** Shows a spinner, disables the button and sets aria-busy while an action runs. */
  loading?: boolean;
  /** Screen-reader text while loading (default "Loading"). */
  loadingLabel?: string;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingLabel = 'Loading', disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {loading && <span className="sr-only">{loadingLabel}</span>}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
