'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export interface TooltipProps {
  /** The tooltip text. */
  content: string;
  /** Placement relative to the trigger (defaults to top). */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing on hover, in milliseconds. */
  delay?: number;
  className?: string;
  /** A single focusable element; receives aria-describedby when open. */
  children: React.ReactElement;
}

const placementClasses: Record<'top' | 'bottom' | 'left' | 'right', string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * Hover/focus tooltip built on aria-describedby. Shows on pointer
 * hover and keyboard focus (not click), dismisses on Escape, and
 * never traps focus. The describedby attribute is injected directly
 * into the trigger so screen readers announce the hint with focus.
 */
const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, side = 'top', delay = 300, className, children }, ref) => {
    const [open, setOpen] = React.useState(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const id = React.useId();

    const show = React.useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOpen(true), delay);
    }, [delay]);

    const hide = React.useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setOpen(false);
    }, []);

    React.useEffect(() => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    // Inject aria-describedby into the trigger so the hint is announced
    // alongside the trigger's own accessible name.
    const trigger = React.cloneElement(children, {
      'aria-describedby': open ? id : undefined,
    } as React.Attributes);

    return (
      <div
        ref={ref}
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
        {open && (
          <div
            id={id}
            role="tooltip"
            className={cn(
              'pointer-events-none absolute z-50 w-max max-w-xs rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md',
              placementClasses[side]
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);
Tooltip.displayName = 'Tooltip';

export { Tooltip };
