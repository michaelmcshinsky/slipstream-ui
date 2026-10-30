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
      <div ref={ref} className={cn('divide-y divide-border rounded-lg border border-border', className)}>
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

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/** The clickable header that expands/collapses its panel. */
const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
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
          'flex flex-1 items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors',
          'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        {...props}
      >
        {children}
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
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/** The collapsible panel; hidden from assistive tech when collapsed. */
const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { id } = React.useContext(AccordionItemContext);
    const { openItems } = React.useContext(AccordionContext);
    const open = openItems.has(id);

    return (
      <div
        ref={ref}
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!open}
        className={cn('overflow-hidden px-4 pb-3 text-sm text-muted-foreground', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
