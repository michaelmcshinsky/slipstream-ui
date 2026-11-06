'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { usePresence } from '../../utils/presence';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name + default header title. Optional when composing a custom header. */
  title?: string;
  description?: string;
  children?: React.ReactNode;
  /** Panel max-width preset (default 'md'). */
  size?: DialogSize;
  /**
   * Replaces the default header row. Compose with `<DialogHeader>` /
   * `<DialogTitle>` / `<DialogDescription>` — those parts pick up the
   * dialog's aria ids automatically.
   */
  header?: React.ReactNode;
  /** Action row pinned under the body. */
  footer?: React.ReactNode;
  /** Cap the body height and scroll inside the panel. */
  scrollable?: boolean;
  bodyClassName?: string;
  closeOnBackdrop?: boolean;
  /** Hide the close (✕) button in the header; Escape and backdrop still close. */
  showClose?: boolean;
  /** Accessible label for the close button (default "Close dialog"). */
  closeLabel?: string;
  /** Focused when the dialog opens; defaults to the first focusable element. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Accessible name when `title` is omitted (required with a custom header). */
  ariaLabel?: string;
  /**
   * Fade the backdrop and panel in on open and out on close (requires
   * the tailwindcss-animate plugin). Off by default; reduced-motion
   * users get animate-none automatically.
   */
  animate?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const DialogIdsContext = React.createContext<{ titleId: string; descriptionId: string } | null>(null);

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** Header row for composed dialogs. */
function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div className={cn('flex items-start justify-between gap-4', className)} {...props} />;
}

export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/** Dialog heading; automatically wired to aria-labelledby. */
function DialogTitle({ className, ...props }: DialogTitleProps) {
  const ids = React.useContext(DialogIdsContext);
  return <h2 id={ids?.titleId} className={cn('text-lg font-semibold', className)} {...props} />;
}

export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Supporting line; automatically wired to aria-describedby. */
function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  const ids = React.useContext(DialogIdsContext);
  return <p id={ids?.descriptionId} className={cn('mt-2 text-sm text-muted-foreground', className)} {...props} />;
}

export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement>;

/** Body wrapper for composed dialogs. */
function DialogBody({ className, ...props }: DialogBodyProps) {
  return <div className={cn('mt-4', className)} {...props} />;
}

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Action row pinned to the bottom of the panel. */
function DialogFooter({ className, ...props }: DialogFooterProps) {
  return <div className={cn('mt-6 flex items-center justify-end gap-2', className)} {...props} />;
}

/**
 * Accessible modal dialog: portal, aria-modal + labelled/describedby wiring,
 * Escape and backdrop dismissal, initial focus on open and focus restoration
 * on close, plus a Tab/Shift+Tab focus trap.
 *
 * Use `title`/`description` for the default header, or pass `header` with
 * `<DialogHeader>`/`<DialogTitle>`/`<DialogDescription>` (and an
 * `ariaLabel` fallback) for full control.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  header,
  footer,
  scrollable = false,
  bodyClassName,
  closeOnBackdrop = true,
  showClose = true,
  closeLabel = 'Close dialog',
  initialFocusRef,
  ariaLabel,
  animate = false,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
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
    const node = dialogRef.current;
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
      const node = dialogRef.current;
      if (!node) return;
      const focusable = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, onOpenChange]);

  if (!present || typeof document === 'undefined') return null;

  const motion = animate
    ? cn(
        'duration-200 motion-reduce:animate-none',
        exiting ? 'animate-out fade-out-0 zoom-out-95' : 'animate-in fade-in-0 zoom-in-95',
      )
    : undefined;

  return createPortal(
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4', motion)}
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'flex w-full flex-col rounded-xl border border-border bg-card p-6 shadow-xl',
          sizeClasses[size],
          motion,
        )}
      >
        <DialogIdsContext.Provider value={{ titleId, descriptionId }}>
          {header ?? (
            <DialogHeader>
              <div className="min-w-0">
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label={closeLabel}
                  className="rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  ✕
                </button>
              )}
            </DialogHeader>
          )}
          <div
            className={cn(
              'mt-4 min-h-0',
              scrollable && 'max-h-[60vh] overflow-y-auto pr-1',
              bodyClassName,
            )}
          >
            {children}
          </div>
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogIdsContext.Provider>
      </div>
    </div>,
    document.body,
  );
}

export { DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter };
