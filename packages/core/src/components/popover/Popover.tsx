'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  /** The relative wrapper the popover is anchored to (measured for portal positioning). */
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
};

const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
  triggerId: '',
  contentId: '',
  wrapperRef: { current: null },
});

export interface PopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Floating panel anchored to a trigger. Unlike Tooltip, the content is
 * interactive (links, buttons, forms). Closes on outside click and Escape.
 * Renders as a non-modal dialog with proper aria wiring.
 */
const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ open, onOpenChange, className, children }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const current = open ?? internalOpen;
    const triggerId = React.useId();
    const contentId = React.useId();
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
      },
      [open, onOpenChange]
    );

    return (
      <div ref={setRefs} className={cn('relative inline-block', className)}>
        <PopoverContext.Provider
          value={{ open: current, setOpen, triggerId, contentId, wrapperRef }}
        >
          {children}
        </PopoverContext.Provider>
      </div>
    );
  }
);
Popover.displayName = 'Popover';

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/** The button that toggles the popover. */
const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { open, setOpen, triggerId, contentId } = React.useContext(PopoverContext);
    return (
      <button
        ref={ref}
        id={triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        onClick={(event) => {
          onClick?.(event);
          setOpen(!open);
        }}
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
PopoverTrigger.displayName = 'PopoverTrigger';

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {}

  /** The floating panel with interactive content. */
  const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
    ({ className, children, onKeyDown, ...props }, ref) => {
      const { open, setOpen, triggerId, contentId, wrapperRef } =
        React.useContext(PopoverContext);
      const contentRef = React.useRef<HTMLDivElement | null>(null);
      // Viewport coordinates measured from the wrapper; the panel portals to
      // document.body with position:fixed so ancestor overflow (scrollable
      // demo frames, clipped containers) can never cut it off.
      const [pos, setPos] = React.useState<{ top: number; right: number } | null>(null);

      React.useLayoutEffect(() => {
        if (!open) {
          setPos(null);
          return;
        }
        const GAP = 8; // matches the previous mt-2 spacing
        const measure = () => {
          const rect = wrapperRef.current?.getBoundingClientRect();
          if (!rect) return;
          setPos({ top: rect.bottom + GAP, right: Math.max(8, window.innerWidth - rect.right) });
        };
        measure();
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

      // Focus the content when it opens so Escape reaches it. Depends on
      // `pos` because the panel only mounts once measured.
      React.useEffect(() => {
        if (open && pos && contentRef.current) {
          contentRef.current.focus();
        }
      }, [open, pos]);

      if (!open || !pos || typeof document === 'undefined') return null;

      return createPortal(
        <div
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          id={contentId}
          role="dialog"
          aria-labelledby={triggerId}
          tabIndex={-1}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.key === 'Escape') {
              event.stopPropagation();
              setOpen(false);
            }
          }}
          style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 50 }}
          className={cn(
            'w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none',
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
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
