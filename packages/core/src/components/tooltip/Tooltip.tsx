'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

export type TooltipProps = {
  /** The tooltip text. */
  content: string;
  /** Placement relative to the trigger (defaults to top). */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing on hover, in milliseconds. */
  delay?: number;
  className?: string;
  /** A single focusable element; receives aria-describedby when open. */
  children: React.ReactElement;
};

type Position = { top: number; left: number; transform: string };

const GAP = 8;

/**
 * Hover/focus tooltip built on aria-describedby. Shows on pointer
 * hover and keyboard focus (not click), dismisses on Escape, and
 * never traps focus.
 *
 * The bubble portals to document.body with position:fixed, measured from
 * the trigger — overflowing a scrollable ancestor can never clip it or
 * scroll the container (the reported "tooltip causes scroll" bug).
 */
const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, side = 'top', delay = 300, className, children }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [pos, setPos] = React.useState<Position | null>(null);
    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const id = React.useId();

    const show = React.useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpen(true), delay);
    }, [delay]);

    const hide = React.useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setOpen(false);
      setPos(null);
    }, []);

    React.useEffect(
      () => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      []
    );

    // Measure the trigger for fixed positioning; scroll/resize dismisses
    // the bubble so it can never drift from (or scroll with) its anchor.
    React.useLayoutEffect(() => {
      if (!open) return;
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const next: Position =
        side === 'top'
          ? { top: rect.top - GAP, left: rect.left + rect.width / 2, transform: 'translate(-50%, -100%)' }
          : side === 'bottom'
            ? { top: rect.bottom + GAP, left: rect.left + rect.width / 2, transform: 'translate(-50%, 0)' }
            : side === 'left'
              ? { top: rect.top + rect.height / 2, left: rect.left - GAP, transform: 'translate(-100%, -50%)' }
              : { top: rect.top + rect.height / 2, left: rect.right + GAP, transform: 'translate(0, -50%)' };
      setPos(next);
      const onScrollOrResize = () => hide();
      window.addEventListener('scroll', onScrollOrResize, true);
      window.addEventListener('resize', onScrollOrResize);
      return () => {
        window.removeEventListener('scroll', onScrollOrResize, true);
        window.removeEventListener('resize', onScrollOrResize);
      };
    }, [open, side, hide]);

    // Inject aria-describedby into the trigger so the hint is announced
    // alongside the trigger's own accessible name.
    const trigger = React.cloneElement(children, {
      'aria-describedby': open ? id : undefined,
    } as React.Attributes);

    return (
      <div
        ref={(node) => {
          anchorRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn('relative inline-flex', className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocusCapture={show}
        onBlurCapture={hide}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && open) {
            event.stopPropagation();
            hide();
          }
        }}
      >
        {trigger}
        {open &&
          pos &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              id={id}
              role="tooltip"
              style={{ position: 'fixed', top: pos.top, left: pos.left, transform: pos.transform, zIndex: 60 }}
              className="pointer-events-none w-max max-w-xs rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md"
            >
              {content}
            </div>,
            document.body
          )}
      </div>
    );
  }
);
Tooltip.displayName = 'Tooltip';

export { Tooltip };
