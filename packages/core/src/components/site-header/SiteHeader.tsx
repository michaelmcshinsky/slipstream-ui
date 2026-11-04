'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Drawer } from '../drawer/Drawer';

export type SiteNavItem = {
  href: string;
  label: string;
  /** Render with target=_blank + rel=noopener. */
  external?: boolean;
};

export type SiteHeaderProps = React.HTMLAttributes<HTMLElement> & {
  /** Brand slot — logo/lockup or wordmark. Wrapped in a link to "/". */
  brand: React.ReactNode;
  /** Primary navigation items. */
  items: SiteNavItem[];
  /** Current route for active styling (aria-current="page"). */
  activeHref?: string;
  /**
   * Active matching: 'prefix' highlights /docs when on /docs/installation
   * (default — marketing), 'exact' only the identical href (app chrome).
   */
  match?: 'prefix' | 'exact';
  /** Right-aligned actions (theme toggle, GitHub, CTA). */
  actions?: React.ReactNode;
  /** Custom link element for routers (Next Link, react-router Link). */
  linkComponent?: React.ElementType;
  /** Pin to the top (default true). */
  sticky?: boolean;
  /** Title of the mobile navigation drawer. Default 'Menu'. */
  mobileLabel?: string;
};

function isActive(itemHref: string, activeHref: string | undefined, match: 'prefix' | 'exact'): boolean {
  if (!activeHref) return false;
  if (itemHref === activeHref) return true;
  if (match === 'exact') return false;
  // Prefix match on path boundaries: /docs matches /docs/components, not /docsx.
  return activeHref === itemHref || activeHref.startsWith(itemHref.endsWith('/') ? itemHref : `${itemHref}/`);
}

/**
 * Marketing/site header: sticky bar with brand, horizontal navigation with
 * prefix-aware active states, right-aligned actions and a mobile drawer.
 * Router-agnostic through `linkComponent`.
 */
export function SiteHeader({
  brand,
  items,
  activeHref,
  match = 'prefix',
  actions,
  linkComponent,
  sticky = true,
  mobileLabel = 'Menu',
  className,
  ...props
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const Link = linkComponent ?? 'a';

  const navLink = (item: SiteNavItem, extra?: string) => {
    const active = isActive(item.href, activeHref, match);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={extra === 'mobile' ? () => setMobileOpen(false) : undefined}
        className={cn(
          'rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          extra === 'mobile'
            ? 'block rounded-md px-3 py-2 text-base hover:bg-accent'
            : 'text-sm hover:text-foreground',
          active ? 'font-medium text-foreground' : 'text-muted-foreground'
        )}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header
        className={cn(
          'w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          sticky && 'sticky top-0 z-40',
          className
        )}
        {...props}
      >
        <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" aria-label="Home" className="flex shrink-0 items-center">
              {brand}
            </Link>
            <div className="hidden items-center gap-5 md:flex">{items.map((item) => navLink(item))}</div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted md:hidden"
            >
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </nav>
      </header>
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen} title={mobileLabel} side="right" size="sm" animate>
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {items.map((item) => navLink(item, 'mobile'))}
        </nav>
        {actions && <div className="mt-4 border-t border-border pt-4">{actions}</div>}
      </Drawer>
    </>
  );
}
