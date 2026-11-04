import type { CSSProperties } from 'react';

/**
 * Gap tokens (Tailwind scale) OR an exact pixel number.
 * Numbers are pixels — `gap={16}` is exactly 16px, no scale guessing;
 * tokens keep spacing on the design-system grid.
 */
export type GapValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | number;

const GAP_CLASSES: Record<string, string> = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

/**
 * Resolve a GapValue to a Tailwind class (token) or an exact px style
 * (number). Both forms are supported everywhere gaps appear — Flex, Grid,
 * FormLayout, Accordion.
 */
export function resolveGap(gap: GapValue | undefined): {
  className?: string;
  style?: CSSProperties;
} {
  if (gap === undefined) return {};
  if (typeof gap === 'number') return { style: { gap: `${gap}px` } };
  return { className: GAP_CLASSES[gap] };
}
