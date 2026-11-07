import * as React from 'react';
import { cn } from '../../utils/cn';

export type SiteFooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type SiteFooterColumn = {
  title: string;
  links: SiteFooterLink[];
};

export type SiteFooterProps = React.HTMLAttributes<HTMLElement> & {
  /** Brand slot (logo/lockup). */
  brand?: React.ReactNode;
  /** Short line under the brand. */
  tagline?: string;
  columns: SiteFooterColumn[];
  /** Bottom bar (copyright, legal links). */
  legal?: React.ReactNode;
  /** Router link element. */
  linkComponent?: React.ElementType;
  /**
   * Prop used to pass the destination to `linkComponent`.
   * `href` (default) covers anchors and Next.js Link; `to` covers
   * react-router and other routers that use a `to` prop.
   */
  linkHrefProp?: 'href' | 'to';
  /** Current route, used to mark the matching link with aria-current="page". */
  activeHref?: string;
  /** Prefix matching highlights /docs when on /docs/installation (default). */
  match?: 'prefix' | 'exact';
};

function isActive(itemHref: string, activeHref: string | undefined, match: 'prefix' | 'exact'): boolean {
  if (!activeHref) return false;
  if (itemHref === activeHref) return true;
  if (match === 'exact') return false;
  return activeHref.startsWith(itemHref.endsWith('/') ? itemHref : `${itemHref}/`);
}

/**
 * Marketing footer: brand + tagline column, link columns, and a legal bar.
 * Router-agnostic through `linkComponent` + `linkHrefProp`; external links
 * get safe rel, and the current route is marked with aria-current.
 */
export function SiteFooter({
  brand,
  tagline,
  columns,
  legal,
  linkComponent,
  linkHrefProp = 'href',
  activeHref,
  match = 'prefix',
  className,
  ...props
}: SiteFooterProps) {
  const Link = linkComponent ?? 'a';
  const destination = (href: string) =>
    linkHrefProp === 'to' ? { to: href } : { href };

  return (
    <footer className={cn('border-t border-border bg-muted/30', className)} {...props}>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="min-w-0">
          {brand}
          {tagline && <p className="mt-3 max-w-56 text-sm text-muted-foreground">{tagline}</p>}
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {column.title}
            </h2>
            <ul className="m-0 list-none space-y-2 p-0 text-sm">
              {column.links.map((link) => {
                const active = isActive(link.href, activeHref, match);
                return (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <Link
                      {...destination(link.href)}
                      aria-current={active ? 'page' : undefined}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={cn(
                        'transition-colors hover:text-foreground',
                        active ? 'font-medium text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {legal && (
        <div className="border-t border-border">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
            {legal}
          </div>
        </div>
      )}
    </footer>
  );
}
