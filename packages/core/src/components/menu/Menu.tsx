'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  /** The relative wrapper the menu is anchored to (measured for portal positioning). */
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
};

const MenuContext = React.createContext<MenuContextValue>({
  open: false,
  setOpen: () => {},
  activeIndex: -1,
  setActiveIndex: () => {},
  wrapperRef: { current: null },
});

export interface MenuProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Dropdown menu with keyboard navigation (arrows, Home/End, Escape),
 * typeahead, and proper ARIA menu semantics. Items are rendered in a
 * floating panel anchored to the trigger.
 */
const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ open, onOpenChange, className, children }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const current = open ?? internalOpen;
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (open === undefined) setInternalOpen(next);
        onOpenChange?.(next);
        if (!next) setActiveIndex(-1);
      },
      [open, onOpenChange]
    );

    return (
      <div ref={setRefs} className={cn('relative inline-block', className)}>
        <MenuContext.Provider
          value={{ open: current, setOpen, activeIndex, setActiveIndex, wrapperRef }}
        >
          {children}
        </MenuContext.Provider>
      </div>
    );
  }
);
Menu.displayName = 'Menu';

export interface MenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/** The button that opens the menu. */
const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(MenuContext);
    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors',
          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
MenuTrigger.displayName = 'MenuTrigger';

export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/** The floating panel containing menu items. */
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, activeIndex, setActiveIndex, wrapperRef } = React.useContext(MenuContext);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    // Viewport coordinates measured from the wrapper; the panel portals to
    // document.body with position:fixed so ancestor overflow (scrollable
    // demo frames, clipped containers) can never cut it off.
    const [pos, setPos] = React.useState<{ top: number; right: number } | null>(null);
    const itemsRef = React.useRef<HTMLElement[]>([]);

    React.useLayoutEffect(() => {
      if (!open) {
        setPos(null);
        return;
      }
      const GAP = 4; // matches the previous mt-1 spacing
      const measure = () => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ top: rect.bottom + GAP, right: Math.max(8, window.innerWidth - rect.right) });
      };
      measure();
      // Close on any scroll (capture phase catches scrolling ancestors that
      // do not bubble) so the fixed panel never drifts from its trigger;
      // reposition on resize.
      const onScroll = () => setOpen(false);
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', measure);
      return () => {
        window.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('resize', measure);
      };
    }, [open, setOpen, wrapperRef]);

    // Close on outside click.
    React.useEffect(() => {
      if (!open) return;
      function onPointerDown(event: PointerEvent) {
        if (!contentRef.current?.contains(event.target as Node)) setOpen(false);
      }
      document.addEventListener('pointerdown', onPointerDown);
      return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open, setOpen]);

    // Collect items for keyboard navigation and move focus into the menu
    // when it opens so arrow keys reach the onKeyDown handler. Depends on
    // `pos` because the panel only mounts once measured.
    React.useEffect(() => {
      if (open && pos && contentRef.current) {
        itemsRef.current = Array.from(
          contentRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')
        );
        itemsRef.current[0]?.focus();
        setActiveIndex(0);
      }
    }, [open, pos, setActiveIndex]);

    const onKeyDown = (event: React.KeyboardEvent) => {
      const items = itemsRef.current;
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        setActiveIndex(next);
        items[next]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const next = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        setActiveIndex(next);
        items[next]?.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        setActiveIndex(0);
        items[0]?.focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        setActiveIndex(items.length - 1);
        items[items.length - 1]?.focus();
      }
    };

    if (!open || !pos || typeof document === 'undefined') return null;

    return createPortal(
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="menu"
        onKeyDown={onKeyDown}
        style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 50 }}
        className={cn(
          'min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);
MenuContent.displayName = 'MenuContent';

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders the item in a destructive style. */
  destructive?: boolean;
}

/** A single action item in the menu. */
const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, destructive, onClick, ...props }, ref) => {
    const { setOpen } = React.useContext(MenuContext);
    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        onClick={(event) => {
          onClick?.(event);
          setOpen(false);
        }}
        className={cn(
          'flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
          'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
          destructive && 'text-destructive hover:bg-destructive/10 hover:text-destructive',
          className
        )}
        {...props}
      />
    );
  }
);
MenuItem.displayName = 'MenuItem';

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Visual divider between menu items. */
const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
  )
);
MenuSeparator.displayName = 'MenuSeparator';

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Non-interactive label grouping related menu items. */
const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground', className)}
      {...props}
    />
  )
);
MenuLabel.displayName = 'MenuLabel';

export { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel };
