'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Drawer } from '../drawer/Drawer';

export type SidebarItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  /** Trailing slot — count, status dot, shortcut. */
  badge?: React.ReactNode;
  /** Force the active state (otherwise activeHref is compared). */
  active?: boolean;
};

export type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

export type SidebarProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  sections: SidebarSection[];
  /** Brand/mark rendered at the top. */
  heading?: React.ReactNode;
  /** Rendered at the bottom (user menu, upgrade CTA). */
  footer?: React.ReactNode;
  /** Current route — items with a matching href get aria-current="page". */
  activeHref?: string;
  /** Custom link element for routers (react-router `Link`, Next `Link`). */
  linkComponent?: React.ElementType;
  /** Accessible name of the nav landmark. Default 'Primary'. */
  label?: string;
};

/**
 * Sectioned navigation rail. Purely presentational: you pass the active
 * route and a router link component, so it stays stateless and works with
 * any routing library.
 */
export function Sidebar({
  sections,
  heading,
  footer,
  activeHref,
  linkComponent,
  label = 'Primary',
  className,
  ...props
}: SidebarProps) {
  const Link = linkComponent ?? 'a';

  return (
    <div className={cn('flex h-full min-h-0 flex-col gap-6 p-4', className)} {...props}>
      {heading && <div className="px-2">{heading}</div>}
      <nav aria-label={label} className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
        {sections.map((section, index) => (
          <div key={section.title ?? `section-${index}`}>
            {section.title && (
              <p className="mb-1.5 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.active ?? (activeHref !== undefined && item.href === activeHref);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        active
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      {item.icon && <span className="shrink-0 [&_svg]:size-4">{item.icon}</span>}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.badge && <span className="shrink-0 text-xs">{item.badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footer && <div className="border-t border-border pt-4">{footer}</div>}
    </div>
  );
}

export type AppShellProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Desktop rail; also rendered inside a mobile drawer. */
  sidebar?: React.ReactNode;
  /** Sticky top bar content. */
  header?: React.ReactNode;
  /** Hide the built-in mobile menu button (e.g. when the header owns one). */
  hideMobileMenu?: boolean;
  /** Tailwind width class for the desktop rail. Default 'w-64'. */
  sidebarWidth?: string;
};

/**
 * Application frame: fixed-height sidebar, sticky header, scrolling main.
 * On small screens the sidebar becomes a left Drawer opened by a burger
 * button, so pages never need their own responsive nav wiring.
 */
export function AppShell({
  sidebar,
  header,
  hideMobileMenu = false,
  sidebarWidth = 'w-64',
  className,
  children,
  ...props
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className={cn('flex min-h-screen bg-background text-foreground', className)} {...props}>
      {sidebar && (
        <aside className={cn('hidden shrink-0 border-r border-border md:block', sidebarWidth)}>
          {sidebar}
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {(header || (sidebar && !hideMobileMenu)) && (
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {sidebar && !hideMobileMenu && (
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted md:hidden"
              >
                <span aria-hidden="true">☰</span>
              </button>
            )}
            <div className="min-w-0 flex-1">{header}</div>
          </header>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      {sidebar && (
        <Drawer
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          title="Navigation"
          side="left"
          size="sm"
          animate
        >
          {sidebar}
        </Drawer>
      )}
    </div>
  );
}
