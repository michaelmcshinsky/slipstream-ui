'use client';

import * as React from 'react';
import { cn } from '@slipstream-ui/core';

export interface BranchProps {
  /** Total number of message variants. Renders nothing when count < 2. */
  count: number;
  /** Zero-based index of the currently displayed variant. */
  selected?: number;
  /** Uncontrolled initial variant when `selected` is omitted. */
  defaultSelected?: number;
  onSelect?: (index: number) => void;
  labels?: { previous?: string; next?: string };
  className?: string;
}

/**
 * Variant navigation for branched messages (`‹ 2 / 3 ›`).
 * Purely presentational + minimal internal state; the consumer swaps content.
 */
const Branch = React.forwardRef<HTMLDivElement, BranchProps>(
  (
    { count, selected, defaultSelected = 0, onSelect, labels, className, ...props },
    ref
  ) => {
    const [internalIndex, setInternalIndex] = React.useState(defaultSelected);
    const isControlled = selected !== undefined;
    const index = Math.min(Math.max(isControlled ? selected : internalIndex, 0), count - 1);

    const t = {
      previous: labels?.previous ?? 'Previous response',
      next: labels?.next ?? 'Next response',
    };

    if (count < 2) return null;

    const goTo = (next: number) => {
      const clamped = Math.min(Math.max(next, 0), count - 1);
      if (!isControlled) setInternalIndex(clamped);
      onSelect?.(clamped);
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}
        {...props}
      >
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label={t.previous}
          className="rounded px-1 hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          ‹
        </button>
        <span aria-live="polite" className="tabular-nums">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === count - 1}
          aria-label={t.next}
          className="rounded px-1 hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          ›
        </button>
      </div>
    );
  }
);
Branch.displayName = 'Branch';

export { Branch };
