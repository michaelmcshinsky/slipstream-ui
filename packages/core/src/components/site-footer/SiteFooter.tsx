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
};

/**
 * Marketing footer: brand + tagline column, link columns, and a legal bar.
 * Router-agnostic through `linkComponent`; external links get safe rel.
 */
export function SiteFooter({
  brand,
  tagline,
  columns,
  legal,
  linkComponent,
  className,
  ...props
}: SiteFooterProps) {
  const Link = linkComponent ?? 'a';

  return (
    <footer className={cn('border-t border-border bg-muted/30', className)} {...props}>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="min-w-0">
          {brand}
          {tagline && <p className="mt-3 max-w-56 text-sm text-muted-foreground">{tagline}</p>}
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {column.title}
            </h3>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
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
