import * as React from 'react';
import { cn } from '../../utils/cn';

export type BottomNavItem = {
  /** Destination URL for the tab. */
  href: string;
  /** Visible tab label. */
  label: string;
  /** Icon shown above the label; always rendered aria-hidden. */
  icon?: React.ReactNode;
  /** Marks the current tab and sets aria-current="page". */
  active?: boolean;
  /** Small count or dot shown in the tab's top corner. */
  badge?: React.ReactNode;
  /** Renders the tab as non-interactive. */
  disabled?: boolean;
};

export type BottomNavProps = React.HTMLAttributes<HTMLElement> & {
  /** Tabs in order. Keep to 3-5 so every target stays thumb-reachable. */
  items: BottomNavItem[];
  /** Router link component (Next Link, react-router Link). */
  linkComponent?: React.ElementType;
  /** Prop used to pass the destination to `linkComponent`. */
  linkHrefProp?: 'href' | 'to';
  /** Landmark label. Default "Primary". */
  label?: string;
  /** Pin the bar to the bottom edge with safe-area padding (default true). */
  fixed?: boolean;
  /** Hide the bar from the md breakpoint up (default true). */
  mobileOnly?: boolean;
};

const tabClass =
  'relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-2 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';

/**
 * Mobile bottom tab bar for the 3-5 primary destinations of an app shell.
 * A nav landmark with aria-current="page" on the active tab, 44px minimum
 * targets, an optional count badge and safe-area padding so the bar clears
 * the iOS home indicator.
 */
export function BottomNav({
  items,
  linkComponent,
  linkHrefProp = 'href',
  label = 'Primary',
  fixed = true,
  mobileOnly = true,
  className,
  ...props
}: BottomNavProps) {
  const LinkEl = linkComponent ?? 'a';
  const destination = (href: string) => (linkHrefProp === 'to' ? { to: href } : { href });

  return (
    <nav
      aria-label={label}
      className={cn(
        'w-full border-t border-border bg-background pb-[env(safe-area-inset-bottom)]',
        fixed && 'fixed inset-x-0 bottom-0 z-40',
        mobileOnly && 'md:hidden',
        className
      )}
      {...props}
    >
      <ul
        className="mx-auto grid w-full max-w-lg"
        style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const content = (
            <>
              {item.icon && (
                <span aria-hidden="true" className="[&_svg]:size-5">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {item.badge != null && (
                <span className="absolute right-1/4 top-1 rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-4 text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </>
          );

          return (
            <li key={item.href}>
              {item.disabled ? (
                <span
                  aria-disabled="true"
                  className={cn(tabClass, 'text-muted-foreground opacity-50')}
                >
                  {content}
                </span>
              ) : (
                <LinkEl
                  {...destination(item.href)}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn(
                    tabClass,
                    item.active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {content}
                </LinkEl>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
