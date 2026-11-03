import * as React from 'react';
import { cn } from '../../utils/cn';

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Icon or illustration shown above the title. */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Primary action (button/link). */
  action?: React.ReactNode;
  /** Secondary action shown beside the primary one. */
  secondaryAction?: React.ReactNode;
  /** Compact padding for use inside panels and table bodies. */
  size?: 'sm' | 'md';
};

/**
 * Placeholder for empty collections, zero-result searches and unconfigured
 * features. Keeps the title/description/action hierarchy consistent across
 * the product.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, secondaryAction, size = 'md', className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border text-center',
        size === 'md' ? 'gap-3 px-6 py-12' : 'gap-2 px-4 py-6',
        className
      )}
      {...props}
    >
      {icon && <div className="text-muted-foreground [&_svg]:size-8">{icon}</div>}
      <p className={cn('font-semibold', size === 'md' ? 'text-base' : 'text-sm')}>{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {children}
      {(action || secondaryAction) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
});
