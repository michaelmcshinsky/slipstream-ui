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
  /** Nested items — renders a collapsible group with aria-expanded. */
  children?: SidebarItem[];
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
  /** Show the collapse/expand control (icon-only rail when collapsed). */
  collapsible?: boolean;
  /** Initial collapsed state when uncontrolled. */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Groups open initially (in addition to groups containing the active route). */
  defaultExpanded?: string[];
};

function containsActive(item: SidebarItem, activeHref: string | undefined): boolean {
  if (!activeHref) return false;
  if (item.href === activeHref) return true;
  // Prefix match on path boundaries so /app/body stays active on
  // /app/body/strength, without matching /app/bodyx.
  if (activeHref.startsWith(item.href.endsWith('/') ? item.href : `${item.href}/`)) return true;
  return (item.children ?? []).some((child) => containsActive(child, activeHref));
}

const itemClass =
  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
const activeClass = 'bg-primary/10 font-medium text-primary';
const idleClass = 'text-muted-foreground hover:bg-accent hover:text-accent-foreground';

/**
 * Sectioned navigation rail — now with nested groups and a collapsible
 * icon-only mode. Purely presentational: you pass the active route and a
 * router link component, so it stays stateless about routing.
 */
export function Sidebar({
  sections,
  heading,
  footer,
  activeHref,
  linkComponent,
  label = 'Primary',
  collapsible = false,
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  defaultExpanded = [],
  className,
  ...props
}: SidebarProps) {
  const Link = linkComponent ?? 'a';
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? internalCollapsed;
  const [openGroups, setOpenGroups] = React.useState<string[]>(defaultExpanded);

  const isOpen = (item: SidebarItem) =>
    collapsed ? false : openGroups.includes(item.href) || containsActive(item, activeHref);

  const toggleGroup = (href: string) => {
    setOpenGroups((current) =>
      current.includes(href) ? current.filter((entry) => entry !== href) : [...current, href]
    );
  };

  const toggleCollapsed = () => {
    const next = !collapsed;
    if (collapsedProp === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const renderItems = (items: SidebarItem[], depth = 0): React.ReactNode => (
    <ul className={cn('space-y-0.5', depth > 0 && 'ml-3.5 border-l border-border pl-2.5')}>
      {items.map((item) => {
        const active = item.active ?? containsActive(item, activeHref);
        const hasChildren = Boolean(item.children?.length);
        const expanded = hasChildren && isOpen(item);
        const panelId = `sidebar-group-${item.href.replace(/[^a-z0-9-]/gi, '-')}`;

        if (hasChildren) {
          return (
            <li key={item.href}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={expanded ? panelId : undefined}
                onClick={() => toggleGroup(item.href)}
                title={collapsed ? item.label : undefined}
                className={cn(itemClass, active ? activeClass : idleClass, collapsed && 'justify-center px-0')}
              >
                {item.icon && <span className="shrink-0 [&_svg]:size-4">{item.icon}</span>}
                <span className={cn('min-w-0 flex-1 truncate text-left', collapsed && 'sr-only')}>{item.label}</span>
                {!collapsed && (
                  <span aria-hidden="true" className={cn('shrink-0 text-xs transition-transform', expanded && 'rotate-90')}>
                    ›
                  </span>
                )}
              </button>
              {expanded && <div id={panelId}>{renderItems(item.children!, depth + 1)}</div>}
            </li>
          );
        }

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(itemClass, active ? activeClass : idleClass, collapsed && 'justify-center px-0')}
            >
              {item.icon && <span className="shrink-0 [&_svg]:size-4">{item.icon}</span>}
              <span className={cn('min-w-0 flex-1 truncate', collapsed && 'sr-only')}>{item.label}</span>
              {!collapsed && item.badge && <span className="shrink-0 text-xs">{item.badge}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      data-collapsed={collapsed || undefined}
      className={cn('flex h-full min-h-0 flex-col gap-5 p-3', className)}
      {...props}
    >
      {heading && <div className={cn('px-1', collapsed && 'sr-only')}>{heading}</div>}
      <nav aria-label={label} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {sections.map((section, index) => (
          <div key={section.title ?? `section-${index}`}>
            {section.title && (
              <p className={cn('mb-1.5 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground', collapsed && 'sr-only')}>
                {section.title}
              </p>
            )}
            {renderItems(section.items)}
          </div>
        ))}
      </nav>
      {collapsible && (
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          className={cn(itemClass, idleClass, 'justify-center')}
        >
          <span aria-hidden="true" className={cn('transition-transform', collapsed && 'rotate-180')}>
            «
          </span>
        </button>
      )}
      {footer && !collapsed && <div className="border-t border-border pt-3">{footer}</div>}
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
  /** Breakpoint at which the rail switches to the mobile drawer. Default 'md'. */
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
  /** Accessible label for the mobile menu button. Default 'Open navigation'. */
  openNavigationLabel?: string;
  /** Title of the mobile drawer. Default 'Navigation'. */
  navigationTitle?: string;
};

const hideAt: Record<NonNullable<AppShellProps['mobileBreakpoint']>, string> = {
  sm: 'hidden sm:block',
  md: 'hidden md:block',
  lg: 'hidden lg:block',
};

const showBelow: Record<NonNullable<AppShellProps['mobileBreakpoint']>, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
};

/**
 * Application frame: fixed-height sidebar, sticky header, scrolling main.
 * On small screens the sidebar becomes a left Drawer opened by a burger
 * button, so pages never need their own responsive nav wiring. A collapsed
 * Sidebar (data-collapsed) shrinks the desktop rail automatically.
 */
export function AppShell({
  sidebar,
  header,
  hideMobileMenu = false,
  sidebarWidth = 'w-64',
  mobileBreakpoint = 'md',
  openNavigationLabel = 'Open navigation',
  navigationTitle = 'Navigation',
  className,
  children,
  ...props
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className={cn('flex min-h-screen bg-background text-foreground', className)} {...props}>
      {sidebar && (
        <aside
          className={cn(
            'sticky top-0 h-screen shrink-0 border-r border-border has-[[data-collapsed]]:w-16',
            hideAt[mobileBreakpoint],
            sidebarWidth
          )}
        >
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
                aria-label={openNavigationLabel}
                className={cn('rounded-md border border-border p-2 text-muted-foreground hover:bg-muted', showBelow[mobileBreakpoint])}
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
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen} title={navigationTitle} side="left" size="sm" animate>
          {sidebar}
        </Drawer>
      )}
    </div>
  );
}
