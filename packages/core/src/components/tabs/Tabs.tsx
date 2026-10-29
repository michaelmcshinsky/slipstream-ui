'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
};

const TabsContext = React.createContext<TabsContextValue>({
  value: '',
  setValue: () => {},
  baseId: '',
});

export interface TabsProps {
  /** Controlled active tab value. */
  value?: string;
  /** Initial tab value when uncontrolled. */
  defaultValue?: string;
  /** Called when the active tab changes. */
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Tabbed content container. Manages the active tab and wires ARIA
 * tablist/tab/tabpanel semantics with roving-tabindex keyboard
 * navigation (arrow keys, Home/End).
 */
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, defaultValue, onValueChange, className, children }, ref) => {
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
      <div ref={ref} className={className} data-value={current}>
        <TabsContext.Provider value={{ value: current, setValue, baseId }}>
          {children}
        </TabsContext.Provider>
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Container for the tab triggers; renders `role="tablist"`. */
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The tab's value; links it to its panel. */
  value: string;
}

/** A single tab button. Handles roving tabindex and arrow-key navigation. */
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, onKeyDown, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const active = ctx.value === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${ctx.baseId}-tab-${value}`}
        aria-selected={active}
        aria-controls={`${ctx.baseId}-panel-${value}`}
        tabIndex={active ? 0 : -1}
        onClick={() => ctx.setValue(value)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          // Arrow-key navigation is provided by the parent list via DOM order.
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            ctx.setValue(value);
          }
        }}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active
            ? 'bg-background text-foreground shadow-sm'
            : 'hover:text-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The panel's value; must match its trigger. */
  value: string;
}

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
