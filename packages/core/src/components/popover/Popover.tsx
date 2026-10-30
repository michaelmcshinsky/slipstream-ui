'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
};

const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
  triggerId: '',
  contentId: '',
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

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (open === undefined) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [open, onOpenChange]
    );

    return (
      <div ref={ref} className={cn('relative inline-block', className)}>
        <PopoverContext.Provider value={{ open: current, setOpen, triggerId, contentId }}>
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
      const { open, setOpen, triggerId, contentId } = React.useContext(PopoverContext);
      const contentRef = React.useRef<HTMLDivElement | null>(null);

      // Close on outside click.
      React.useEffect(() => {
        if (!open) return;
        function onPointerDown(event: PointerEvent) {
          if (!contentRef.current?.contains(event.target as Node)) setOpen(false);
        }
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
      }, [open, setOpen]);

      // Focus the content when it opens so Escape reaches it.
      React.useEffect(() => {
        if (open && contentRef.current) {
          contentRef.current.focus();
        }
      }, [open]);

      if (!open) return null;

      return (
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
          className={cn(
            'absolute right-0 z-50 mt-2 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  );
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
