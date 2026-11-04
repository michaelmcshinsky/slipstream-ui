import * as React from 'react';
import { cn } from '../../utils/cn';

export type MetricTrend = 'up' | 'down' | 'flat';

export type MetricCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  label: string;
  value: string | number;
  /** Secondary line under the value. */
  hint?: string;
  /** Signed change, e.g. "+12.4%" or "-3". */
  delta?: string;
  /** Direction colors the delta (green up / red down / muted flat). */
  trend?: MetricTrend;
  icon?: React.ReactNode;
};

const trendClasses: Record<MetricTrend, string> = {
  up: 'text-success',
  down: 'text-destructive',
  flat: 'text-muted-foreground',
};

const trendGlyph: Record<MetricTrend, string> = { up: '↑', down: '↓', flat: '→' };

/**
 * Compact KPI tile: label, value, optional delta with direction color and a
 * supporting hint. Deltas always carry an arrow glyph so the direction is
 * never communicated by color alone.
 */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(function MetricCard(
  { label, value, hint, delta, trend = 'flat', icon, className, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn('rounded-xl border border-border bg-card p-5', className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {(delta || hint) && (
        <p className="mt-1 flex items-center gap-2 text-sm">
          {delta && (
            <span className={cn('font-medium tabular-nums', trendClasses[trend])}>
              <span aria-hidden="true">{trendGlyph[trend]}</span> {delta}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </p>
      )}
    </div>
  );
});
