import * as React from 'react';
import { cn } from '../../utils/cn';

export type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  /** Breadcrumbs/eyebrow above the title. */
  breadcrumbs?: React.ReactNode;
  /** Right-aligned actions (buttons, menus). */
  actions?: React.ReactNode;
  /** Small slot under the title row (tabs, filters). */
  children?: React.ReactNode;
};

/**
 * Standard page heading block: optional breadcrumbs, title, description and
 * a right-aligned action cluster. Pages stop inventing their own spacing
 * and heading hierarchy.
 */
export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { title, description, breadcrumbs, actions, className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
      {breadcrumbs && <div className="text-sm text-muted-foreground">{breadcrumbs}</div>}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
});
