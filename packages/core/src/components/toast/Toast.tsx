'use client';

import * as React from 'react';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title: string;
  description?: string;
  action?: ToastAction;
  /** Auto-dismiss delay in ms; 0 keeps the toast until dismissed. Default 5000. */
  duration?: number;
}

export interface ToastRecord extends ToastOptions {
  id: string;
}

export interface ToastContextValue {
  toasts: ToastRecord[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 5000;

/**
 * Accessible app-level notifications. Toasts render into a polite live
 * region so screen readers announce them without stealing focus, stack
 * newest-first, and auto-dismiss unless duration is 0 (KC-028).
 */
export function ToastProvider({ children, label = 'Notifications' }: { children: React.ReactNode; label?: string }) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = React.useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current, { ...options, id }]);
      const duration = options.duration ?? DEFAULT_DURATION;
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  React.useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) clearTimeout(timer);
      pending.clear();
    };
  }, []);

  const value = React.useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion toasts={toasts} onDismiss={dismiss} label={label} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a <ToastProvider>.');
  return context;
}

function ToastRegion({
  toasts,
  onDismiss,
  label,
}: {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
  label: string;
}) {
  return (
    <ol
      aria-label={label}
      className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((entry) => (
        <li key={entry.id} className="rounded-lg border border-border bg-card p-4 shadow-lg">
          <div role="status" className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{entry.title}</p>
              {entry.description && <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(entry.id)}
              aria-label={`Dismiss ${entry.title}`}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          {entry.action && (
            <button
              type="button"
              onClick={() => {
                entry.action?.onClick();
                onDismiss(entry.id);
              }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              {entry.action.label}
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}
