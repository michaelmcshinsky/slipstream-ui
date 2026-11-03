'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

type AccordionContextValue = {
  openItems: Set<string>;
  toggle: (id: string) => void;
  /** Whether only one item may be open at a time. */
  collapsible: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: new Set(),
  toggle: () => {},
  collapsible: true,
});

export interface AccordionProps {
  /** Controlled open item ids. */
  value?: string[];
  /** Initial open item ids when uncontrolled. */
  defaultValue?: string[];
  /** Called when the open set changes. */
  onValueChange?: (value: string[]) => void;
  /** When true (default), opening an item closes the others. */
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Collapsible content sections with proper ARIA accordion semantics.
 * Each item's trigger announces its expanded state and controls its panel.
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ value, defaultValue = [], onValueChange, collapsible = true, className, children }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState<string[]>(defaultValue);
    const current = value ?? internalOpen;

    const toggle = React.useCallback(
      (id: string) => {
        const next = current.includes(id)
          ? current.filter((item) => item !== id)
          : collapsible
            ? [id]
            : [...current, id];
        if (value === undefined) setInternalOpen(next);
        onValueChange?.(next);
      },
      [current, collapsible, value, onValueChange]
    );

    return (
      <div ref={ref} className={cn('w-full divide-y divide-border rounded-lg border border-border', className)}>
        <AccordionContext.Provider value={{ openItems: new Set(current), toggle, collapsible }}>
          {children}
        </AccordionContext.Provider>
      </div>
    );
  }
);
Accordion.displayName = 'Accordion';

export interface AccordionItemProps {
  /** Unique id linking the trigger to its panel. */
  id: string;
  className?: string;
  children: React.ReactNode;
}

/** A single collapsible section. */
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ id, className, children }, ref) => (
    <div ref={ref} data-accordion-item={id} className={className}>
      <AccordionItemContext.Provider value={{ id }}>{children}</AccordionItemContext.Provider>
    </div>
  )
);
AccordionItem.displayName = 'AccordionItem';

const AccordionItemContext = React.createContext<{ id: string }>({ id: '' });

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Replace the default chevron (rendered at the far right of the header). */
  icon?: React.ReactNode;
};

/** The clickable header that expands/collapses its panel. */
const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, icon, ...props }, ref) => {
    const { id } = React.useContext(AccordionItemContext);
    const { openItems, toggle } = React.useContext(AccordionContext);
    const open = openItems.has(id);
    const panelId = `${id}-panel`;
    const triggerId = `${id}-trigger`;

    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => toggle(id)}
        className={cn(
          // w-full keeps the header clickable edge-to-edge in closed AND
          // open states; the icon slot sits at the far right via justify-between.
          'flex w-full flex-1 items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors',
          'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        {...props}
      >
        {children}
        {icon ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={cn('h-4 w-4 shrink-0 transition-transform duration-200', open && 'rotate-180')}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

/** The collapsible panel; hidden from assistive tech when collapsed. */
const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { id } = React.useContext(AccordionItemContext);
    const { openItems } = React.useContext(AccordionContext);
    const open = openItems.has(id);

    // Expansion animation via grid-template-rows (0fr -> 1fr): supported
    // in Chrome 117+/Firefox 66+/Safari 17+, and degrades to an instant
    // toggle elsewhere because the rows value simply stops interpolating.
    // The `hidden` attribute stays bound to `open` (synchronous) so panels
    // are removed from the a11y tree and tab order the moment they close.
    const [expanded, setExpanded] = React.useState(open);
    React.useEffect(() => {
      if (!open) {
        setExpanded(false);
        return;
      }
      const reduce =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        setExpanded(true);
        return;
      }
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setExpanded(true));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }, [open]);

    return (
      <div
        ref={ref}
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!open}
        className={cn(
          // No display utility while closed: author styles would beat the
          // UA [hidden] rule and keep the collapsed panel visible.
          open &&
            cn(
              'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
              expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            ),
          !open && 'grid-rows-[0fr]',
          className
        )}
        {...props}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-3 text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
