'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { usePresence } from '../../utils/presence';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  /** Edge the drawer slides from (default 'right'). */
  side?: DrawerSide;
  /** Preset extent along the side axis (width for left/right, height for top/bottom). */
  size?: DrawerSize;
  /**
   * Custom extent for left/right drawers: pixels (480) or any CSS length
   * ("70vw"). Overrides `size`.
   */
  width?: number | string;
  /**
   * Custom extent for top/bottom drawers: pixels (320) or any CSS length
   * ("60vh"). Overrides `size`.
   */
  height?: number | string;
  /** Clicking the backdrop closes (default true). */
  closeOnBackdrop?: boolean;
  /** Hide the close (✕) button in the header (default true). */
  showClose?: boolean;
  /** Focused when the drawer opens; defaults to the first focusable element. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Overrides the accessible name (defaults to the title). */
  ariaLabel?: string;
  /**
   * Slide the panel in from its edge and out on close (requires the
   * tailwindcss-animate plugin). Off by default; reduced-motion users
   * get animate-none automatically.
   */
  animate?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const sideClasses: Record<DrawerSide, string> = {
  right: 'inset-y-0 right-0 border-l',
  left: 'inset-y-0 left-0 border-r',
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
};

const sideWidths: Record<DrawerSize, string> = {
  sm: 'w-72',
  md: 'w-96',
  lg: 'w-[32rem]',
  xl: 'w-[40rem]',
  '2xl': 'w-[48rem]',
};

const sideHeights: Record<DrawerSize, string> = {
  sm: 'h-48',
  md: 'h-80',
  lg: 'h-[32rem]',
  xl: 'h-[40rem]',
  '2xl': 'h-[48rem]',
};

const sizeClasses: Record<DrawerSide, Record<DrawerSize, string>> = {
  right: sideWidths,
  left: sideWidths,
  top: sideHeights,
  bottom: sideHeights,
};

/** Custom extent wins over the preset; numbers are pixels. */
function extentStyle(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

// Literal class maps so Tailwind's scanner keeps every slide utility.
const slideIn: Record<DrawerSide, string> = {
  right: 'slide-in-from-right',
  left: 'slide-in-from-left',
  top: 'slide-in-from-top',
  bottom: 'slide-in-from-bottom',
};
const slideOut: Record<DrawerSide, string> = {
  right: 'slide-out-to-right',
  left: 'slide-out-to-left',
  top: 'slide-out-to-top',
  bottom: 'slide-out-to-bottom',
};

/**
 * Edge sheet for secondary flows (filters, detail panes, mobile nav).
 * Modal semantics identical to Dialog: portal, aria-modal + labelled by
 * title, Escape and backdrop dismissal, focus move + Tab trap + focus
 * restoration on close. Renders fixed to the chosen edge with a border
 * against the backdrop.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  size = 'md',
  width,
  height,
  closeOnBackdrop = true,
  showClose = true,
  initialFocusRef,
  ariaLabel,
  animate = false,
}: DrawerProps) {
  const drawerRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const { present, exiting } = usePresence(open, animate);

  // Capture the opener before the panel takes focus; restore the moment
  // open flips false — even while an exit animation keeps the DOM up.
  React.useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      return;
    }
    previouslyFocused.current?.focus?.();
    previouslyFocused.current = null;
  }, [open]);

  // Move focus in once the panel is actually mounted (present can lag
  // open by a render when the presence gate starts closed).
  React.useEffect(() => {
    if (!open || !present) return;
    const node = drawerRef.current;
    const target =
      initialFocusRef?.current ?? node?.querySelector<HTMLElement>(FOCUSABLE) ?? node;
    target?.focus();
  }, [open, present, initialFocusRef]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onOpenChange(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const node = drawerRef.current;
      if (!node) return;
      const focusable = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !node.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  if (!present || typeof document === 'undefined') return null;

  const isVerticalSide = side === 'top' || side === 'bottom';
  const customExtent = isVerticalSide ? extentStyle(height) : extentStyle(width);

  const motion = animate
    ? cn(
        'duration-200 motion-reduce:animate-none',
        exiting ? `animate-out ${slideOut[side]}` : `animate-in ${slideIn[side]}`,
      )
    : undefined;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'fixed flex flex-col bg-background shadow-xl border-border',
          sideClasses[side],
          sizeClasses[side][size],
          motion
        )}
        style={customExtent ? { [isVerticalSide ? 'height' : 'width']: customExtent } : undefined}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 id={titleId} className="text-base font-semibold leading-tight">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {showClose && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close drawer"
              className="-mr-1 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
