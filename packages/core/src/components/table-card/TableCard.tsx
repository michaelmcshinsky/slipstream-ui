import * as React from 'react';
import { cn } from '../../utils/cn';

export type TableCardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  /** Right-aligned header actions (create, export, column settings). */
  actions?: React.ReactNode;
  /** Row between the header and the table (filters, bulk actions). */
  toolbar?: React.ReactNode;
  /** Table/DataTable content. */
  children: React.ReactNode;
  /** Rendered under the table (pagination, summary). */
  footer?: React.ReactNode;
  /** Remove the inner padding so table edges reach the card border. */
  flush?: boolean;
};

/**
 * Table shell: title/description + actions, an optional toolbar, an
 * edge-to-edge table body and a footer row. Standardizes the chrome every
 * list page grows around a Table or DataTable.
 */
export const TableCard = React.forwardRef<HTMLDivElement, TableCardProps>(function TableCard(
  { title, description, actions, toolbar, children, footer, flush = true, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('overflow-hidden rounded-xl border border-border bg-card text-card-foreground', className)}
      {...props}
    >
      {(title || description || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {toolbar && <div className="border-b border-border px-4 py-2">{toolbar}</div>}
      <div className={cn(flush ? 'overflow-x-auto' : 'p-4')}>{children}</div>
      {footer && <div className="border-t border-border px-4 py-3">{footer}</div>}
    </div>
  );
});
