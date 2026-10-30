import * as React from 'react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  /** Display label. */
  label: string;
  /** Destination href; omit for the current page (renders as plain text). */
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Ordered list of breadcrumb items; the last item is the current page. */
  items: BreadcrumbItem[];
  /** Separator character between items (default '/'). */
  separator?: React.ReactNode;
}

/**
 * Navigation breadcrumb trail. The last item is rendered as the current
 * page with aria-current="page". Earlier items are links. Screen readers
 * announce the navigation landmark and current location.
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = '/', className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1.5 text-sm text-muted-foreground', className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center space-x-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center space-x-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="text-muted-foreground/50">
                  {separator}
                </span>
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'font-medium text-foreground' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  )
);
Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
