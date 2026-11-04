'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import {
  getToastServerSnapshot,
  getToastSnapshot,
  subscribeToToasts,
  toast as imperativeToast,
  type ToastRecord,
  type ToastVariant,
} from './toast-store';

export type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToasterProps = {
  /** Corner/edge the stack renders at. Default 'bottom-right'. */
  position?: ToasterPosition;
  /** Accessible name of the live region. Default 'Notifications'. */
  label?: string;
  /** Tint the toast surface with its status color (neutral by default). */
  richColors?: boolean;
};

const positionClasses: Record<ToasterPosition, string> = {
  'top-left': 'left-4 top-4 items-start',
  'top-center': 'left-1/2 top-4 -translate-x-1/2 items-center',
  'top-right': 'right-4 top-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};

const richClasses: Record<ToastVariant, string> = {
  default: 'border-border bg-card',
  success: 'border-success/50 bg-success/10',
  error: 'border-destructive/50 bg-destructive/10',
  warning: 'border-warning/50 bg-warning/10',
  info: 'border-info/50 bg-info/10',
};

const dotClasses: Record<ToastVariant, string> = {
  default: 'bg-muted-foreground',
  success: 'bg-success',
  error: 'bg-destructive',
  warning: 'bg-warning',
  info: 'bg-info',
};

/**
 * Renders the imperative toast queue. Mount once near the app root:
 *
 *   <Toaster />
 *   toast.success('Saved')
 *
 * The region is a polite live region, so announcements don't steal focus.
 */
export function Toaster({ position = 'bottom-right', label = 'Notifications', richColors = false }: ToasterProps) {
  const entries = React.useSyncExternalStore(subscribeToToasts, getToastSnapshot, getToastServerSnapshot);

  return (
    <ol
      aria-label={label}
      className={cn('fixed z-[60] flex w-full max-w-sm flex-col gap-2', positionClasses[position])}
    >
      {entries.map((entry) => {
        const variant = entry.variant ?? 'default';
        return (
          <li
            key={entry.id}
            className={cn(
              'rounded-lg border p-4 shadow-lg',
              richColors ? richClasses[variant] : 'border-border bg-card',
            )}
          >
            <div role="status" className="flex items-start gap-3">
              <span aria-hidden="true" className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', dotClasses[variant])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{entry.title}</p>
                {entry.description && <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>}
                {entry.action && (
                  <button
                    type="button"
                    onClick={() => {
                      entry.action?.onClick();
                      imperativeToast.dismiss(entry.id);
                    }}
                    className="mt-2 text-sm font-medium text-primary hover:underline"
                  >
                    {entry.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => imperativeToast.dismiss(entry.id)}
                aria-label={`Dismiss ${entry.title}`}
                className="rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                ✕
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export type { ToastRecord };
