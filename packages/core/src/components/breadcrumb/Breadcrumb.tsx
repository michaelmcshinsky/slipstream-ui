import * as React from 'react';
import { cn } from '../../utils/cn';

export type BreadcrumbItem = {
  /** Display label. */
  label: string;
  /** Destination href; omit for the current page (renders as plain text). */
  href?: string;
};

export type BreadcrumbProps = React.HTMLAttributes<HTMLElement> & {
  /** Ordered list of breadcrumb items; the last item is the current page. */
  items: BreadcrumbItem[];
  /** Separator character between items (default '/'). */
  separator?: React.ReactNode;
  /**
   * Receives every link click with the item and its index. When provided,
   * default navigation is prevented so you can route programmatically
   * (e.g. via a router, state machine, or analytics wrapper).
   */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  /** Custom link element for routers (Next Link, react-router Link). */
  linkComponent?: React.ElementType;
  /**
   * Prop used to pass the destination to `linkComponent`. `href` covers
   * anchors and Next.js Link; `to` covers react-router and similar routers.
   */
  linkHrefProp?: 'href' | 'to';
  /** Truncate the current page label and expose the full text as a title. */
  truncateCurrent?: boolean;
};

/**
 * Navigation breadcrumb trail. The last item is rendered as the current
 * page with aria-current="page". Earlier items are links. Screen readers
 * announce the navigation landmark and current location.
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = '/', onItemClick, linkComponent, linkHrefProp = 'href', truncateCurrent = false, className, ...props }, ref) => {
    const LinkEl = linkComponent ?? 'a';
    return (
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
            <li key={`${item.label}-${index}`} className={cn('flex items-center space-x-1.5', truncateCurrent && isLast && 'min-w-0')}>
              {index > 0 && (
                <span aria-hidden="true" className="text-muted-foreground/50">
                  {separator}
                </span>
              )}
              {item.href && !isLast ? (
                <LinkEl
                  {...(linkHrefProp === 'to' ? { to: item.href } : { href: item.href })}
                  className="transition-colors hover:text-foreground"
                  onClick={
                    onItemClick
                      ? (event: React.MouseEvent<HTMLAnchorElement>) => {
                          event.preventDefault();
                          onItemClick(item, index);
                        }
                      : undefined
                  }
                >
                  {item.label}
                </LinkEl>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  title={truncateCurrent && isLast ? item.label : undefined}
                  className={cn(isLast && 'font-medium text-foreground', truncateCurrent && isLast && 'truncate')}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
