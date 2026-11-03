import * as React from 'react';
import { cn } from '../../utils/cn';

export type AuthLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  /** Brand/mark above the card. */
  brand?: React.ReactNode;
  /** Links or legal copy under the card. */
  footer?: React.ReactNode;
  /** Rendered inside the card under the heading. */
  children?: React.ReactNode;
  /** Card width preset (default 'md'). */
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses: Record<NonNullable<AuthLayoutProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

/**
 * Centered auth surface: brand mark, title/description, the form card and a
 * footer slot. Keeps sign-in, sign-up, reset and verify screens visually
 * identical without each page re-deriving the layout.
 */
export const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(function AuthLayout(
  { title, description, brand, footer, children, size = 'md', className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12', className)}
      {...props}
    >
      {brand && <div className="mb-6">{brand}</div>}
      <div className={cn('w-full rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8', sizeClasses[size])}>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
});
