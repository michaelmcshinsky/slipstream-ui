/**
 * Imperative toast store.
 *
 * Components can call `toast(...)` from anywhere — event handlers, data
 * layers, async catch blocks — without threading a hook through the tree.
 * `<Toaster />` subscribes to this store and renders the queue. The
 * provider/hook API in Toast.tsx remains for tree-scoped usage.
 */

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  title: string;
  description?: string;
  action?: ToastAction;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms; 0 keeps the toast until dismissed. Default 5000. */
  duration?: number;
};

export type ToastRecord = ToastOptions & { id: string };

type Listener = (toasts: readonly ToastRecord[]) => void;

const DEFAULT_DURATION = 5000;

let toasts: readonly ToastRecord[] = [];
const EMPTY: readonly ToastRecord[] = [];
const listeners = new Set<Listener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  for (const listener of listeners) listener(toasts);
}

function dismiss(id: string) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  toasts = toasts.filter((entry) => entry.id !== id);
  emit();
}

function show(options: ToastOptions): string {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  toasts = [...toasts, { ...options, id }];
  emit();

  const duration = options.duration ?? DEFAULT_DURATION;
  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismiss(id), duration),
    );
  }
  return id;
}

type ToastFunction = ((options: ToastOptions) => string) & {
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id?: string) => void;
  clear: () => void;
};

/**
 * Fire a toast from anywhere. Variant helpers mirror the sonner/Radix
 * shape most codebases already call:
 *
 *   toast.success('Saved')
 *   toast.error('Upload failed', 'Check your connection')
 *   toast({ title: 'Heads up', duration: 0 })
 */
export const toast: ToastFunction = Object.assign(
  (options: ToastOptions) => show({ ...options, variant: options.variant ?? 'default' }),
  {
    success: (title: string, description?: string) => show({ title, description, variant: 'success' }),
    error: (title: string, description?: string) => show({ title, description, variant: 'error' }),
    warning: (title: string, description?: string) => show({ title, description, variant: 'warning' }),
    info: (title: string, description?: string) => show({ title, description, variant: 'info' }),
    dismiss: (id?: string) => {
      if (id) {
        dismiss(id);
        return;
      }
      for (const entry of [...toasts]) dismiss(entry.id);
    },
    clear: () => {
      for (const entry of [...toasts]) dismiss(entry.id);
    },
  },
);

/** Subscribe to the queue (used by `<Toaster />`). */
export function subscribeToToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current queue; the reference is stable between mutations. */
export function getToastSnapshot(): readonly ToastRecord[] {
  return toasts;
}

/** SSR-safe snapshot — always empty (toasts only exist client-side). */
export function getToastServerSnapshot(): readonly ToastRecord[] {
  return EMPTY;
}
