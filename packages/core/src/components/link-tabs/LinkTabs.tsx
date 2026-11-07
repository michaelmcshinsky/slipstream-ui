'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

type LinkTabsVariant = 'default' | 'underline' | 'rounded';
type LinkTabsSize = 'sm' | 'md' | 'lg';

export type LinkTabsItem = {
  /** Visible tab label. */
  label: string;
  /** Destination URL. */
  href: string;
  /** Match only the exact path instead of a prefix. */
  exact?: boolean;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Render a disabled, non-interactive tab. */
  disabled?: boolean;
};

export type LinkTabsProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  /** Tabs in display order. */
  items: LinkTabsItem[];
  /** Current pathname, used to mark the active tab. */
  activeHref?: string;
  /** Router link element (Inertia Link, Next Link, react-router Link). Defaults to `<a>`. */
  linkComponent?: React.ElementType;
  /** Visual style. */
  variant?: LinkTabsVariant;
  /** Control density. */
  size?: LinkTabsSize;
  /** Accessible name for the navigation landmark. Default "Section". */
  label?: string;
};

const listVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      default: 'gap-1 rounded-md bg-muted p-1',
      underline: 'gap-1 rounded-none border-b border-border bg-transparent p-0',
      rounded: 'gap-1 rounded-full border border-border bg-background p-1',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const itemVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'rounded-sm px-3 py-1.5 text-muted-foreground hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-sm',
        underline:
          'border-b-2 border-transparent px-3 py-2 text-muted-foreground hover:text-foreground data-[active=true]:border-primary data-[active=true]:text-foreground',
        rounded:
          'rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground',
      },
      size: {
        sm: 'h-7',
        md: 'h-9',
        lg: 'h-11 px-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

function isActive(item: LinkTabsItem, activeHref: string | undefined): boolean {
  if (!activeHref) return false;
  const path = activeHref.split('?')[0].split('#')[0];
  const href = item.href.split('?')[0].split('#')[0];
  return item.exact ? path === href : path === href || path.startsWith(`${href}/`);
}

/**
 * Navigation tabs for route-based sections. Unlike `Tabs` (which switches
 * client-side panels), `LinkTabs` renders real links and marks the current
 * route with `aria-current="page"` - the correct pattern for URL-driven
 * sub-navigation such as settings, account, or app sections.
 */
export const LinkTabs = React.forwardRef<HTMLElement, LinkTabsProps>(function LinkTabs(
  {
    items,
    activeHref,
    linkComponent,
    variant = 'default',
    size = 'md',
    label = 'Section',
    className,
    ...props
  },
  ref
) {
  const Link = linkComponent ?? 'a';

  return (
    <nav ref={ref} aria-label={label} className={cn(listVariants({ variant, size }), className)} {...props}>
      {items.map((item) => {
        const active = isActive(item, activeHref);
        const content = (
          <>
            {item.icon}
            {item.label}
          </>
        );

        if (item.disabled) {
          return (
            <span
              key={item.href}
              aria-disabled="true"
              data-active={active ? 'true' : 'false'}
              className={cn(itemVariants({ variant, size }), 'pointer-events-none opacity-50')}
            >
              {content}
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            data-active={active ? 'true' : 'false'}
            className={itemVariants({ variant, size })}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
});

LinkTabs.displayName = 'LinkTabs';
