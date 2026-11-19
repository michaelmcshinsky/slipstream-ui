'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

function cx(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Overflow detection shared by the scrollable regions below. Mirrors the
 * approach in `@slipstream-ui/ai` CodeBlock: only become a tab stop when the
 * content actually overflows, so short blocks do not add tab-order noise.
 */
function useScrollable<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setScrollable(element.scrollWidth > element.clientWidth + 1);
    update();
    // jsdom (tests) has no ResizeObserver; window resize is the fallback.
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
    // Content is static per mounted article section; route changes remount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, scrollable };
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/**
 * Server-rendered markdown emits plain <pre>/<div> scroll regions, which axe
 * flags as scrollable-region-focusable once a code line or table is wider than
 * the column. These client wrappers add tabIndex only when overflow exists.
 */
export function ScrollablePre({ className, children }: { className?: string; children: ReactNode }) {
  const { ref, scrollable } = useScrollable<HTMLPreElement>();
  return (
    <pre
      ref={ref}
      tabIndex={scrollable ? 0 : undefined}
      aria-label={scrollable ? 'Code block, scrollable' : undefined}
      className={cx(className, FOCUS_RING)}
    >
      {children}
    </pre>
  );
}

export function ScrollableRegion({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: ReactNode;
}) {
  const { ref, scrollable } = useScrollable<HTMLDivElement>();
  return (
    <div
      ref={ref}
      tabIndex={scrollable ? 0 : undefined}
      aria-label={scrollable ? `${label}, scrollable` : undefined}
      className={cx(className, FOCUS_RING)}
    >
      {children}
    </div>
  );
}
