'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';

export type FilterSection = {
  /** Section heading. */
  title: string;
  /** Supporting line under the heading. */
  description?: string;
  /** Filter controls shown inside the section. */
  content: React.ReactNode;
  /** Open on first render. */
  defaultOpen?: boolean;
};

export type FilterPanelProps = React.HTMLAttributes<HTMLElement> & {
  /** Filter groups. */
  sections: FilterSection[];
  /** Panel heading. Default "Filters". */
  title?: string;
  /** Supporting copy under the panel heading. */
  description?: string;
  /** Reset action shown in the footer. */
  onReset?: () => void;
  /** Apply action shown in the footer. */
  onApply?: () => void;
  /** Reset button label. Default "Reset". */
  resetLabel?: string;
  /** Apply button label. Default "Apply". */
  applyLabel?: string;
  /** Allow sections to collapse. Default true. */
  collapsible?: boolean;
  /** Section titles open on first render. */
  defaultOpen?: string[];
  /** Extra footer content. */
  actions?: React.ReactNode;
  /** Semantic element (default 'div'). */
  as?: 'div' | 'aside' | 'section';
};

/**
 * Structured filter panel for dashboards and directories. It owns section
 * expansion and the reset/apply footer; filter values stay with the caller.
 * Use it in a sidebar on desktop and inside a Drawer on mobile.
 */
export const FilterPanel = React.forwardRef<HTMLElement, FilterPanelProps>(function FilterPanel(
  {
    sections,
    title = 'Filters',
    description,
    onReset,
    onApply,
    resetLabel = 'Reset',
    applyLabel = 'Apply',
    collapsible = true,
    defaultOpen,
    actions,
    as = 'div',
    className,
    ...props
  },
  ref
) {
  const Tag = as as 'div';
  const [open, setOpen] = React.useState<string[]>(
    defaultOpen ?? sections.filter((section) => section.defaultOpen).map((section) => section.title)
  );

  const isOpen = (section: FilterSection) => !collapsible || open.includes(section.title);

  const toggle = (section: FilterSection) => {
    if (!collapsible) return;
    setOpen((current) =>
      current.includes(section.title)
        ? current.filter((title) => title !== section.title)
        : [...current, section.title]
    );
  };

  return (
    <Tag ref={ref as never} className={cn('w-full rounded-xl border border-border bg-card', className)} {...props}>
      {(title || description) && (
        <div className="border-b border-border px-4 py-3">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="divide-y divide-border">
        {sections.map((section) => {
          const expanded = isOpen(section);
          return (
            <div key={section.title} className="px-4 py-3">
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(section)}
                  aria-expanded={expanded}
                  aria-controls={`filter-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`}
                  disabled={!collapsible}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 text-left text-sm font-medium',
                    collapsible && 'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  )}
                >
                  <span>
                    {section.title}
                    {section.description && (
                      <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{section.description}</span>
                    )}
                  </span>
                  {collapsible && (
                    <span aria-hidden="true" className={cn('text-muted-foreground transition-transform', expanded && 'rotate-180')}>
                      ⌄
                    </span>
                  )}
                </button>
              </h3>
              {expanded && (
                <div id={`filter-section-${section.title.replace(/\s+/g, '-').toLowerCase()}`} className="mt-3">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {(onReset || onApply || actions) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
          {actions}
          {onReset && (
            <Button type="button" variant="ghost" size="sm" onClick={onReset} className="ml-auto">
              {resetLabel}
            </Button>
          )}
          {onApply && (
            <Button type="button" size="sm" onClick={onApply}>
              {applyLabel}
            </Button>
          )}
        </div>
      )}
    </Tag>
  );
});
