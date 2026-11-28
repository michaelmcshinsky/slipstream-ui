'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { linkDestination, type LinkLikeProps } from '../../utils/link';
import { Drawer } from '../drawer/Drawer';

/** A single destination in the header or inside a mega panel. */
export type SiteNavLink = {
  href: string;
  label: string;
  /** Render with target=_blank + rel=noopener. */
  external?: boolean;
  /** Optional second line shown in a desktop mega panel. */
  description?: string;
};

/** One column inside a mega panel: a heading and its links. */
export type SiteNavColumn = {
  heading?: string;
  items: SiteNavLink[];
};

export type SiteNavItem =
  | (SiteNavLink & { columns?: undefined })
  | {
      href?: string;
      label: string;
      external?: boolean;
      description?: string;
      /**
       * Nested navigation. Present items render as a disclosure trigger with
       * a desktop panel and a mobile <details> group instead of a link.
       */
      columns: SiteNavColumn[];
    };

export type SiteHeaderProps = React.HTMLAttributes<HTMLElement> & LinkLikeProps & {
  /** Brand slot - logo/lockup or wordmark. Wrapped in a link to "/". */
  brand: React.ReactNode;
  /**
   * Slim utility strip rendered above the brand row (locale switch, feed
   * link, submit link). Content is placed in a container matching the nav
   * metrics; lay out multiple items with justify-between or a flex row.
   */
  topBar?: React.ReactNode;
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
  /** Accessible name for the mobile menu trigger when closed (default "Open menu"). */
  mobileMenuOpenLabel?: string;
  /** Accessible name for the mobile menu trigger when open (default "Close menu"). */
  mobileMenuCloseLabel?: string;
  /** Accessible name for the mobile drawer close button (default "Close drawer"). */
  mobileDrawerCloseLabel?: string;
  /** Render the built-in mobile trigger and drawer (default true). Set false when the host owns mobile navigation. */
  showMobileTrigger?: boolean;
  /** Breakpoint where the horizontal navigation appears (default 'md'). */
  desktopBreakpoint?: 'md' | 'lg';
  /** Extra classes for the inner nav row (height, padding). */
  navClassName?: string;
};

function isActive(
  itemHref: string,
  activeHref: string | undefined,
  match: 'prefix' | 'exact'
): boolean {
  if (!activeHref) return false;
  if (itemHref === activeHref) return true;
  if (match === 'exact') return false;
  // Prefix match on path boundaries: /docs matches /docs/components, not /docsx.
  return (
    activeHref === itemHref ||
    activeHref.startsWith(itemHref.endsWith('/') ? itemHref : `${itemHref}/`)
  );
}

function Caret() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="h-2.5 w-2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
    </svg>
  );
}

/**
 * Marketing/site header: sticky bar with brand, horizontal navigation with
 * prefix-aware active states, optional nested mega panels, right-aligned
 * actions and a mobile drawer. Router-agnostic through `linkComponent` +
 * `linkHrefProp`.
 */
export function SiteHeader({
  brand,
  topBar,
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
  mobileMenuOpenLabel = 'Open menu',
  mobileMenuCloseLabel = 'Close menu',
  mobileDrawerCloseLabel = 'Close drawer',
  showMobileTrigger = true,
  desktopBreakpoint = 'md',
  navClassName,
  className,
  ...props
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const pendingFocus = React.useRef<string | null>(null);
  const generatedId = React.useId();
  const menuId = `${generatedId}-menu`;
  const Link = linkComponent ?? 'a';

  const destination = (href: string) => linkDestination(href, linkHrefProp);

  // Escape and an outside pointer close the desktop panel. Focus movement
  // inside the item is handled by onBlur so tabbing through stays open.
  React.useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('[data-site-nav-item]')) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [openMenu]);

  // ArrowDown opens the panel and asks for the first link to take focus, but
  // the panel is hidden until the state render lands, so focus one tick later.
  React.useEffect(() => {
    if (!openMenu || !pendingFocus.current) return;
    const panel = document.getElementById(pendingFocus.current);
    pendingFocus.current = null;
    panel?.querySelector<HTMLElement>('a[href]')?.focus();
  }, [openMenu]);

  const navLink = (item: SiteNavLink, extra?: 'mobile' | 'panel') => {
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
          extra === 'mobile' &&
            'block rounded-md px-3 py-2 text-base hover:bg-accent',
          extra === 'panel' && 'block rounded-md p-2 hover:bg-accent',
          !extra && 'text-sm hover:text-foreground',
          !extra && (active ? 'font-medium text-foreground' : 'text-muted-foreground')
        )}
      >
        {extra === 'panel' ? (
          <>
            <span className="block text-sm font-medium">{item.label}</span>
            {item.description && (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {item.description}
              </span>
            )}
          </>
        ) : (
          item.label
        )}
      </Link>
    );
  };

  const hasColumns = (item: SiteNavItem): item is SiteNavItem & { columns: SiteNavColumn[] } =>
    Array.isArray(item.columns) && item.columns.length > 0;

  /*
   * Panels are wider than their triggers, so a fixed left-0 anchor pushes
   * edge menus off-screen. On open we measure the panel and clamp its left
   * edge into the viewport; the inline style wins over the left-0 class.
   * Layout effect keeps the correction ahead of paint.
   */
  const alignPanel = React.useCallback((panel: HTMLElement) => {
    const item = panel.parentElement;
    if (!item) return;
    const itemRect = item.getBoundingClientRect();
    const width = panel.offsetWidth;
    const gutter = 8;
    const centered = itemRect.left + itemRect.width / 2 - width / 2;
    const left = Math.max(gutter, Math.min(centered, window.innerWidth - gutter - width));
    panel.style.left = `${left - itemRect.left}px`;
    panel.style.right = 'auto';
  }, []);

  const useIsoLayoutEffect =
    typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

  useIsoLayoutEffect(() => {
    if (!openMenu) return;
    const panelId = `${generatedId}-panel-${openMenu.replace(/\s+/g, '-').toLowerCase()}`;
    const panel = document.getElementById(panelId);
    if (panel) alignPanel(panel);
  }, [openMenu, generatedId, alignPanel]);

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
        {topBar && (
          <div className="border-b border-border/60 text-muted-foreground">
            <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6">
              {topBar}
            </div>
          </div>
        )}
        <nav
          aria-label={navLabel}
          className={cn(
            'mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6',
            navClassName
          )}
        >
          <div className="flex min-w-0 items-center gap-6">
            <Link
              {...destination('/')}
              aria-label={brandLabel}
              className="flex shrink-0 items-center"
            >
              {brand}
            </Link>
            <ul
              className={cn(
                'hidden items-center gap-5',
                desktopBreakpoint === 'lg' ? 'lg:flex' : 'md:flex'
              )}
            >
              {items.map((item) => {
                if (!hasColumns(item)) {
                  return <li key={item.href}>{navLink(item)}</li>;
                }
                const panelId = `${generatedId}-panel-${item.label.replace(/\s+/g, '-').toLowerCase()}`;
                const open = openMenu === item.label;
                return (
                  <li
                    key={item.label}
                    data-site-nav-item
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                    onBlur={(event) => {
                      const next = event.relatedTarget as Node | null;
                      if (!next || !event.currentTarget.contains(next)) {
                        setOpenMenu(null);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenMenu(item.label)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          setOpenMenu(null);
                          event.currentTarget.focus();
                        }
                        if (event.key === 'ArrowDown') {
                          event.preventDefault();
                          pendingFocus.current = panelId;
                          setOpenMenu(item.label);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-1 rounded-sm text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive(item.href ?? '', activeHref, match)
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.label}
                      <Caret />
                    </button>
                    {/*
                     * The pt-2 bridge keeps the pointer inside the <li> while
                     * it travels from the trigger into the panel - a margin
                     * gap would fire onMouseLeave and slam the menu shut.
                     */}
                    <div
                      id={panelId}
                      hidden={!open}
                      className="absolute left-0 top-full z-50 pt-2"
                    >
                      <div
                        className={cn(
                          'grid gap-6 rounded-lg border border-border bg-popover p-5 shadow-lg',
                          item.columns.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
                          item.columns.length > 1
                            ? 'w-[38rem] max-w-[calc(100vw-2rem)]'
                            : 'w-[22rem] max-w-[calc(100vw-2rem)]'
                        )}
                      >
                        {item.columns.map((column, index) => (
                          <div key={column.heading ?? index} className="min-w-40">
                            {column.heading && (
                              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {column.heading}
                              </p>
                            )}
                            <ul className="flex flex-col gap-0.5">
                              {column.items.map((link) => (
                                <li key={`${column.heading ?? index}-${link.href}-${link.label}`}>
                                  {navLink(link, 'panel')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {showMobileTrigger && (
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label={mobileOpen ? mobileMenuCloseLabel : mobileMenuOpenLabel}
                aria-expanded={mobileOpen}
                aria-controls={menuId}
                aria-haspopup="dialog"
                className={cn(
                  'rounded-md border border-border p-2 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  desktopBreakpoint === 'lg' ? 'lg:hidden' : 'md:hidden'
                )}
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
            )}
          </div>
        </nav>
      </header>
      {showMobileTrigger && (
        <Drawer
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          title={mobileLabel}
          closeLabel={mobileDrawerCloseLabel}
          side="right"
          size="sm"
          animate
        >
          <nav id={menuId} aria-label={mobileNavLabel} className="flex flex-col gap-1">
            {items.map((item) =>
              hasColumns(item) ? (
                <details key={item.label} className="rounded-md">
                  <summary className="cursor-pointer rounded-md px-3 py-2 text-base font-medium hover:bg-accent">
                    {item.label}
                  </summary>
                  <div className="mt-1 flex flex-col gap-2 pb-2">
                    {item.columns.map((column, index) => (
                      <div key={column.heading ?? index} className="px-3">
                        {column.heading && (
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {column.heading}
                          </p>
                        )}
                        <ul className="flex flex-col gap-1">
                          {column.items.map((link) => (
                            <li key={`${column.heading ?? index}-${link.href}-${link.label}`}>
                              {navLink(link, 'mobile')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              ) : (
                navLink(item, 'mobile')
              )
            )}
          </nav>
          {(mobileActions ?? actions) && (
            <div className="mt-4 border-t border-border pt-4">{mobileActions ?? actions}</div>
          )}
        </Drawer>
      )}
    </>
  );
}
