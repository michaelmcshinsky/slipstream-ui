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
  /** Card width preset (default 'md'). Ignored when the split variant falls back. */
  size?: 'sm' | 'md' | 'lg';
  /** Layout preset. Default 'centered'. */
  variant?: 'centered' | 'split';
  /**
   * Optional panel rendered beside the card in the split variant. Ignored in
   * the centered variant; omitting it makes the split variant fall back.
   */
  aside?: React.ReactNode;
};

const sizeClasses: Record<NonNullable<AuthLayoutProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

/**
 * Auth surface: brand mark, title/description, the form card and a footer
 * slot. The default centered variant is the single-column sign-in screen; the
 * split variant adds a branded aside beside the card on desktop and below it
 * on mobile. DOM order stays form, then aside, so keyboard and screen-reader
 * order remain correct.
 */
export const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(function AuthLayout(
  {
    title,
    description,
    brand,
    footer,
    children,
    size = 'md',
    variant = 'centered',
    aside,
    className,
    ...props
  },
  ref
) {
  const split = variant === 'split' && aside != null;

  const form = (
    <div
      className={cn(
        'flex w-full flex-col',
        split ? sizeClasses[size] : 'items-center'
      )}
    >
      {brand && <div className="mb-6">{brand}</div>}
      <div
        className={cn(
          'w-full rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8',
          !split && sizeClasses[size]
        )}
      >
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );

  if (split) {
    return (
      <div
        ref={ref}
        className={cn('min-h-screen bg-muted/30 px-4 py-12 lg:px-8', className)}
        {...props}
      >
        <div className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {form}
          <aside className="w-full">{aside}</aside>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12',
        className
      )}
      {...props}
    >
      {form}
    </div>
  );
});
