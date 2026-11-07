'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export type TableOfContentsProps = React.HTMLAttributes<HTMLElement> & {
  headings: TocHeading[];
  /** Controlled active heading id (otherwise use `useScrollSpy`). */
  activeId?: string;
  /** Accessible name. Default 'On this page'. */
  label?: string;
  /** Accessible name for the nav landmark when it differs from the visible label. */
  ariaLabel?: string;
  /** Extra classes for the visible label. */
  labelClassName?: string;
  /** Stick to the viewport while the article scrolls (default true). */
  sticky?: boolean;
};

/**
 * "On this page" navigation for long-form content. Renders a nested list
 * with indentation per heading level and aria-current on the active item.
 * Pair with `useScrollSpy` (or your own scroll tracking) for the active id.
 */
export function TableOfContents({
  headings,
  activeId,
  label = 'On this page',
  ariaLabel,
  labelClassName,
  sticky = true,
  className,
  ...props
}: TableOfContentsProps) {
  return (
    <nav
      aria-label={ariaLabel ?? label}
      className={cn('text-sm', sticky && 'sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto', className)}
      {...props}
    >
      <p className={cn('mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground', labelClassName)}>{label}</p>
      <ul className="space-y-1 border-l border-border">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  '-ml-px block border-l py-1 pl-3 no-underline transition-colors',
                  active
                    ? 'border-primary font-medium text-primary underline'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Tracks which of the given element ids is currently in view. Returns the
 * active id (the last heading scrolled past) and stays SSR-safe.
 */
export function useScrollSpy(ids: string[], options?: { rootMargin?: string }): string | undefined {
  const [activeId, setActiveId] = React.useState<string | undefined>();
  const idKey = ids.join('|');
  const rootMargin = options?.rootMargin ?? '0px 0px -70% 0px';

  React.useEffect(() => {
    if (idKey.length === 0 || typeof IntersectionObserver === 'undefined') return;
    const elements = idKey
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
        return;
      },
      { rootMargin, threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [idKey, rootMargin]);

  return activeId;
}
