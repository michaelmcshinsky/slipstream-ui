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
  /** Brand slot - logo/lockup or wordmark. Wrapped in a link to "/". */
  brand: React.ReactNode;
  /** Primary navigation items. */
  items: SiteNavItem[];
  /** Current route for active styling (aria-current="page"). */
  activeHref?: string;
  /**
   * Active matching: 'prefix' highlights /docs when on /docs/installation
   * (default - marketing), 'exact' only the identical href (app chrome).
   */
  match?: 'prefix' | 'exact';
  /** Right-aligned actions (theme toggle, GitHub, CTA). */
  actions?: React.ReactNode;
  /** Actions rendered inside the mobile drawer; defaults to `actions`. */
  mobileActions?: React.ReactNode;
  /** Custom link element for routers (Next Link, react-router Link). */
  linkComponent?: React.ElementType;
  /**
   * Prop used to pass the destination to `linkComponent`.
   * `href` (default) covers anchors and Next.js Link; `to` covers
   * react-router and other routers that use a `to` prop.
   */
  linkHrefProp?: 'href' | 'to';
  /** Accessible name for the brand link (default "Home"). */
  brandLabel?: string;
  /** Accessible name for the desktop navigation landmark (default "Main"). */
  navLabel?: string;
  /** Accessible name for the mobile navigation landmark (default "Mobile"). */
  mobileNavLabel?: string;
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
 * Router-agnostic through `linkComponent` + `linkHrefProp`.
 */
export function SiteHeader({
  brand,
  items,
  activeHref,
  match = 'prefix',
  actions,
  mobileActions,
  linkComponent,
  linkHrefProp = 'href',
  brandLabel = 'Home',
  navLabel = 'Main',
  mobileNavLabel = 'Mobile',
  sticky = true,
  mobileLabel = 'Menu',
  className,
  ...props
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const generatedId = React.useId();
  const menuId = `${generatedId}-menu`;
  const Link = linkComponent ?? 'a';

  const destination = (href: string) =>
    linkHrefProp === 'to' ? { to: href } : { href };

  const navLink = (item: SiteNavItem, extra?: string) => {
    const active = isActive(item.href, activeHref, match);
    return (
      <Link
        key={item.href}
        {...destination(item.href)}
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
        <nav
          aria-label={navLabel}
          className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          <div className="flex min-w-0 items-center gap-6">
            <Link
              {...destination('/')}
              aria-label={brandLabel}
              className="flex shrink-0 items-center"
            >
              {brand}
            </Link>
            <div className="hidden items-center gap-5 md:flex">{items.map((item) => navLink(item))}</div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls={menuId}
              aria-haspopup="dialog"
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>
      <Drawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        title={mobileLabel}
        side="right"
        size="sm"
        animate
      >
        <nav id={menuId} aria-label={mobileNavLabel} className="flex flex-col gap-1">
          {items.map((item) => navLink(item, 'mobile'))}
        </nav>
        {(mobileActions ?? actions) && (
          <div className="mt-4 border-t border-border pt-4">{mobileActions ?? actions}</div>
        )}
      </Drawer>
    </>
  );
}
