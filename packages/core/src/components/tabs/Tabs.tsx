'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

type TabsVariant = 'default' | 'underline' | 'rounded';
type TabsSize = 'sm' | 'md' | 'lg';

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  variant: TabsVariant;
  size: TabsSize;
};

const TabsContext = React.createContext<TabsContextValue>({
  value: '',
  setValue: () => {},
  baseId: '',
  variant: 'default',
  size: 'md',
});

export type TabsProps = {
  /** Controlled active tab value. */
  value?: string;
  /** Initial tab value when uncontrolled. */
  defaultValue?: string;
  /** Called when the active tab changes. */
  onValueChange?: (value: string) => void;
  /** Visual style of the tab strip. Default is the enclosed pill track. */
  variant?: TabsVariant;
  /** Control density for strip and triggers. */
  size?: TabsSize;
  className?: string;
  children: React.ReactNode;
};

/**
 * Tabbed content container. Manages the active tab and wires ARIA
 * tablist/tab/tabpanel semantics with roving-tabindex keyboard
 * navigation (arrow keys, Home/End).
 */
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    { value, defaultValue, onValueChange, variant = 'default', size = 'md', className, children },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const current = value ?? internalValue;
    const baseId = React.useId();

    const setValue = React.useCallback(
      (next: string) => {
        if (value === undefined) setInternalValue(next);
        onValueChange?.(next);
      },
      [value, onValueChange]
    );

    return (
      <div ref={ref} className={className} data-value={current} data-variant={variant}>
        <TabsContext.Provider value={{ value: current, setValue, baseId, variant, size }}>
          {children}
        </TabsContext.Provider>
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';

const tabsListVariants = cva('inline-flex items-center justify-center text-muted-foreground', {
  variants: {
    variant: {
      default: 'rounded-md bg-muted p-1',
      // Item 18: underline strips carry no background — the underline alone
      // marks the active tab.
      underline: 'gap-1 rounded-none border-b border-border bg-transparent p-0',
      // Item 9: fully-rounded pill track with pill triggers.
      rounded: 'rounded-full bg-muted p-1',
    },
    size: {
      sm: 'gap-0.5',
      md: 'gap-1',
      lg: 'gap-1.5',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

/** Container for the tab triggers; renders `role="tablist"`. */
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(tabsListVariants({ variant: ctx.variant, size: ctx.size }), className)}
        {...props}
      />
    );
  }
);
TabsList.displayName = 'TabsList';

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all',
  {
    variants: {
      variant: {
        default: 'rounded-sm px-3 py-1.5 text-sm',
        underline: 'rounded-none border-b-2 border-transparent px-3 pb-2 pt-1.5 text-sm',
        rounded: 'rounded-full px-3 py-1.5 text-sm',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: '',
        lg: 'px-4 py-2 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

const triggerActiveByVariant: Record<TabsVariant, string> = {
  default: 'bg-background text-foreground shadow-sm',
  underline: 'border-primary text-foreground',
  rounded: 'bg-background text-foreground shadow-sm',
};

const triggerInactiveByVariant: Record<TabsVariant, string> = {
  default: 'hover:text-foreground',
  underline: 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
  rounded: 'hover:text-foreground',
};

export type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** The tab's value; links it to its panel. */
  value: string;
};

/** A single tab button. Roving tabindex plus full arrow-key navigation. */
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, onKeyDown, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const active = ctx.value === value;

    // WAI-ARIA tabs pattern: arrows move AND activate (automatic activation).
    const focusAt = (tabs: Element[], index: number) => {
      if (tabs.length === 0) return;
      const next = (index + tabs.length) % tabs.length;
      const target = tabs[next] as HTMLButtonElement;
      target.focus();
      target.click();
    };

    const siblingTabs = (button: HTMLButtonElement): Element[] =>
      Array.from(button.parentElement?.querySelectorAll('[role="tab"]') ?? []);

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${ctx.baseId}-tab-${value}`}
        aria-selected={active}
        aria-controls={`${ctx.baseId}-panel-${value}`}
        // Radix-compatible hook so consumers can style active state from
        // outside: data-[state=active]:border-primary etc.
        data-state={active ? 'active' : 'inactive'}
        tabIndex={active ? 0 : -1}
        onClick={() => ctx.setValue(value)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            ctx.setValue(value);
          } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            const tabs = siblingTabs(event.currentTarget);
            focusAt(tabs, tabs.indexOf(event.currentTarget) + 1);
          } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            const tabs = siblingTabs(event.currentTarget);
            focusAt(tabs, tabs.indexOf(event.currentTarget) - 1);
          } else if (event.key === 'Home') {
            event.preventDefault();
            focusAt(siblingTabs(event.currentTarget), 0);
          } else if (event.key === 'End') {
            event.preventDefault();
            focusAt(siblingTabs(event.currentTarget), -1);
          }
        }}
        className={cn(
          tabsTriggerVariants({ variant: ctx.variant, size: ctx.size }),
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active ? triggerActiveByVariant[ctx.variant] : triggerInactiveByVariant[ctx.variant],
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The panel's value; must match its trigger. */
  value: string;
};

/** The content panel for a tab. Hidden via the `hidden` attribute when inactive. */
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const active = ctx.value === value;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${ctx.baseId}-panel-${value}`}
        aria-labelledby={`${ctx.baseId}-tab-${value}`}
        data-state={active ? 'active' : 'inactive'}
        hidden={!active}
        tabIndex={0}
        className={cn(
          'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
