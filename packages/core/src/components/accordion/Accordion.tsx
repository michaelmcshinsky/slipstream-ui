'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { resolveGap, type GapValue } from '../../utils/gap';

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

export type AccordionSection = {
  /** Unique id linking the trigger to its panel. */
  id: string;
  /** Trigger label. */
  title: React.ReactNode;
  /** Panel content. */
  content: React.ReactNode;
  /** Disables the trigger for this section. */
  disabled?: boolean;
};

export type AccordionProps = {
  /** Controlled open item ids. */
  value?: string[];
  /** Initial open item ids when uncontrolled. */
  defaultValue?: string[];
  /** Called when the open set changes. */
  onValueChange?: (value: string[]) => void;
  /** When true (default), opening an item closes the others. */
  collapsible?: boolean;
  /** 'default' = bordered card with dividers; 'borderless' = plain stacked sections. */
  variant?: 'default' | 'borderless';
  /** Token gap ('lg') or exact pixels (16) between items. */
  gap?: GapValue;
  /**
   * Declarative sections. When provided, Accordion renders an
   * AccordionItem/AccordionTrigger/AccordionContent per entry instead of
   * reading `children`.
   */
  items?: AccordionSection[];
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * Collapsible content sections with proper ARIA accordion semantics.
 * Each item's trigger announces its expanded state and controls its panel.
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      value,
      defaultValue = [],
      onValueChange,
      collapsible = true,
      variant = 'default',
      gap,
      items,
      className,
      style,
      children,
    },
    ref
  ) => {
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

    const gapResolved = resolveGap(gap);

    return (
      <div
        ref={ref}
        className={cn(
          // flex-col so token/px gaps apply (gap is a flex property);
          // divide-y rides along in the default variant.
          'flex w-full flex-col',
          variant === 'default' && 'rounded-lg border border-border divide-y divide-border',
          gapResolved.className,
          className
        )}
        style={{ ...gapResolved.style, ...style }}
      >
        <AccordionContext.Provider value={{ openItems: new Set(current), toggle, collapsible }}>
          {items
            ? items.map((item) => (
                <AccordionItem key={item.id} id={item.id}>
                  <AccordionTrigger disabled={item.disabled}>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))
            : children}
        </AccordionContext.Provider>
      </div>
    );
  }
);
Accordion.displayName = 'Accordion';

export type AccordionItemProps = {
  /** Unique id linking the trigger to its panel. */
  id: string;
  className?: string;
  children: React.ReactNode;
};

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
    //
    // Closing keeps the panel mounted for the transition window. Binding
    // `hidden` straight to `open` removed the panel on the closing frame, so
    // collapse was a jump cut with no animation at all.
    const [mounted, setMounted] = React.useState(open);
    const [expanded, setExpanded] = React.useState(open);

    React.useEffect(() => {
      const reduce =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (open) {
        setMounted(true);
        if (reduce) {
          setExpanded(true);
          return;
        }
        // Paint the collapsed frame first so the row transition has a start.
        let second = 0;
        const first = requestAnimationFrame(() => {
          second = requestAnimationFrame(() => setExpanded(true));
        });
        return () => {
          cancelAnimationFrame(first);
          cancelAnimationFrame(second);
        };
      }

      setExpanded(false);
      if (reduce) {
        setMounted(false);
        return;
      }
      const timer = setTimeout(() => setMounted(false), 320);
      return () => clearTimeout(timer);
    }, [open]);

    return (
      <div
        ref={ref}
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        aria-hidden={open ? undefined : true}
        hidden={!mounted}
        className={cn(
          // No display utility while unmounted: author styles would beat the
          // UA [hidden] rule and keep the collapsed panel visible.
          mounted &&
            cn(
              'grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none',
              expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] pointer-events-none opacity-0'
            ),
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
