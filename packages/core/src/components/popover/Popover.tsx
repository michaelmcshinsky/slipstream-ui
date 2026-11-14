'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { computePosition, type Align, type PositionResult, type Side } from '../../utils/position';

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  /** The relative wrapper the popover is anchored to by default. */
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  /** Optional explicit anchor, rendered by PopoverAnchor. */
  anchorRef: React.MutableRefObject<HTMLElement | null>;
};

const PopoverContext = React.createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
  triggerId: '',
  contentId: '',
  wrapperRef: { current: null },
  anchorRef: { current: null },
});

export type PopoverProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
};

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
    const anchorRef = React.useRef<HTMLElement | null>(null);
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
          value={{ open: current, setOpen, triggerId, contentId, wrapperRef, anchorRef }}
        >
          {children}
        </PopoverContext.Provider>
      </div>
    );
  }
);
Popover.displayName = 'Popover';

export type PopoverTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

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

export type PopoverAnchorProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Anchors the panel to this element instead of the trigger. Useful when the
 * panel belongs to a field that is not itself the button opening it.
 */
const PopoverAnchor = React.forwardRef<HTMLSpanElement, PopoverAnchorProps>(
  ({ className, children, ...props }, ref) => {
    const { anchorRef } = React.useContext(PopoverContext);
    const setRefs = React.useCallback(
      (node: HTMLSpanElement | null) => {
        anchorRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [anchorRef, ref]
    );
    return (
      <span ref={setRefs} className={cn('inline-block', className)} {...props}>
        {children}
      </span>
    );
  }
);
PopoverAnchor.displayName = 'PopoverAnchor';

export type PopoverContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Preferred side of the anchor. Flips when it cannot fit. */
  side?: Side;
  /** Cross-axis alignment against the anchor. */
  align?: Align;
  /** Gap between anchor and panel. */
  sideOffset?: number;
  /** Nudge along the cross axis. */
  alignOffset?: number;
  /** Minimum distance kept from the viewport edges. */
  collisionPadding?: number;
  /** Match the panel width to the anchor width (select-like panels). */
  matchTriggerWidth?: boolean;
};

function rectOf(element: Element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width || (element as HTMLElement).offsetWidth || 0,
    height: rect.height || (element as HTMLElement).offsetHeight || 0,
  };
}

/** The floating panel with interactive content. */
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      children,
      onKeyDown,
      style,
      side = 'bottom',
      align = 'start',
      sideOffset = 8,
      alignOffset = 0,
      collisionPadding = 8,
      matchTriggerWidth = false,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, triggerId, contentId, wrapperRef, anchorRef } =
      React.useContext(PopoverContext);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    // Viewport coordinates measured from the anchor; the panel portals to
    // document.body with position:fixed so ancestor overflow can never clip it.
    const [pos, setPos] = React.useState<PositionResult | null>(null);
    const [width, setWidth] = React.useState<number | undefined>(undefined);

    const updatePosition = React.useCallback(() => {
      const anchorEl = anchorRef.current ?? wrapperRef.current;
      const panel = contentRef.current;
      if (!anchorEl || !panel) return;
      const anchor = rectOf(anchorEl);
      const measured = rectOf(panel);
      setWidth(matchTriggerWidth ? anchor.width : undefined);
      setPos(
        computePosition({
          anchor,
          content: { width: measured.width, height: measured.height },
          viewport: { width: window.innerWidth, height: window.innerHeight },
          side,
          align,
          sideOffset,
          alignOffset,
          collisionPadding,
        })
      );
    }, [
      align,
      alignOffset,
      anchorRef,
      collisionPadding,
      matchTriggerWidth,
      side,
      sideOffset,
      wrapperRef,
    ]);

    React.useLayoutEffect(() => {
      if (!open) {
        setPos(null);
        return;
      }
      updatePosition();
    }, [open, updatePosition]);

    // Keep the panel anchored while the page moves: reposition on scroll and
    // resize, and re-measure when the content itself changes size.
    React.useEffect(() => {
      if (!open) return;
      const onScroll = () => updatePosition();
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', onScroll);
      const panel = contentRef.current;
      const observer =
        typeof ResizeObserver === 'undefined' || !panel ? null : new ResizeObserver(onScroll);
      if (panel && observer) observer.observe(panel);
      return () => {
        window.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('resize', onScroll);
        observer?.disconnect();
      };
    }, [open, updatePosition]);

    // Close on outside click.
    React.useEffect(() => {
      if (!open) return;
      function onPointerDown(event: PointerEvent) {
        if (!contentRef.current?.contains(event.target as Node)) setOpen(false);
      }
      document.addEventListener('pointerdown', onPointerDown);
      return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open, setOpen]);

    // Focus the content when it opens so Escape reaches it. Depends on `pos`
    // because the panel only mounts once measured.
    React.useEffect(() => {
      if (open && pos && contentRef.current) {
        contentRef.current.focus();
      }
    }, [open, pos]);

    if (!open || typeof document === 'undefined') return null;

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
        data-side={pos?.side ?? side}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === 'Escape') {
            event.stopPropagation();
            setOpen(false);
          }
        }}
        style={{
          position: 'fixed',
          top: pos?.top ?? 0,
          left: pos?.left ?? 0,
          width,
          visibility: pos ? 'visible' : 'hidden',
          zIndex: 50,
          ...style,
        }}
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

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
