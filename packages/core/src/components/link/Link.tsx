'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const linkVariants = cva('inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm', {
  variants: {
    variant: {
      default: 'text-primary hover:underline underline-offset-4',
      muted: 'text-muted-foreground hover:text-foreground',
      underline: 'underline underline-offset-4 hover:text-primary',
      arrow: 'font-medium text-primary hover:underline underline-offset-4',
      external: 'text-primary hover:underline underline-offset-4',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkVariants> & {
    /** Render the child element (router Link) with link styling. */
    asChild?: boolean;
    /**
     * Force external handling (target=_blank + rel). Absolute http(s) hrefs
     * are detected automatically; mailto:/tel: links never open a new tab.
     */
    external?: boolean;
  };

const ABSOLUTE = /^https?:\/\//i;

/**
 * Inline link primitive with the project's link variants. Keeps a real
 * `<a href>` (SEO, modified clicks, middle-click) and adds safe external
 * handling: absolute URLs get target="_blank" + rel="noopener noreferrer"
 * and a screen-reader note, unless `external={false}`.
 *
 * For client-side routing, wrap your router's link: `<Link asChild><RouterLink …/></Link>`.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, variant, asChild = false, external, target, rel, children, ...props },
  ref
) {
  const isAbsolute = typeof props.href === 'string' && ABSOLUTE.test(props.href);
  const isExternal = external ?? isAbsolute;
  const Comp = asChild ? Slot : 'a';

  if (asChild) {
    return (
      <Comp
        ref={ref}
        className={cn(linkVariants({ variant }), className)}
        target={isExternal ? target ?? '_blank' : target}
        rel={isExternal ? rel ?? 'noopener noreferrer' : rel}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref}
      className={cn(linkVariants({ variant }), className)}
      target={isExternal ? target ?? '_blank' : target}
      rel={isExternal ? rel ?? 'noopener noreferrer' : rel}
      {...props}
    >
      {children}
      {isExternal && variant !== 'muted' && (
        <>
          <span aria-hidden="true" className="text-[0.75em]">
            ↗
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </Comp>
  );
});

export type LinkVariant = NonNullable<VariantProps<typeof linkVariants>['variant']>;
