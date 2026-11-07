'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type RangeSliderProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  /** Controlled low/high pair. */
  value?: [number, number];
  /** Initial low/high pair when uncontrolled. Defaults to [min, max]. */
  defaultValue?: [number, number];
  /** Fires with the next low/high pair. */
  onValueChange?: (value: [number, number]) => void;
  /** Lower bound. Default 0. */
  min?: number;
  /** Upper bound. Default 100. */
  max?: number;
  /** Increment. Default 1. */
  step?: number;
  /** Accessible label for the low thumb. Default "Minimum". */
  startLabel?: string;
  /** Accessible label for the high thumb. Default "Maximum". */
  endLabel?: string;
  /** Formats the displayed values and aria-valuetext. */
  formatValue?: (value: number) => string;
  /** Show the current low/high values above the track. Default true. */
  showValues?: boolean;
  disabled?: boolean;
};

const rangeInputClass = cn(
  'pointer-events-none absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2 appearance-none bg-transparent',
  '[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent',
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow',
  '[&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent',
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

/**
 * Dual-thumb range slider for numeric ranges such as revenue or EBITDA.
 * Uses two native range inputs for keyboard and screen-reader behavior, and
 * keeps the low and high thumbs from crossing. Pair it with a FilterBar or
 * FilterPanel for data dashboards.
 */
export const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider(
  {
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    startLabel = 'Minimum',
    endLabel = 'Maximum',
    formatValue = (entry) => String(entry),
    showValues = true,
    disabled = false,
    className,
    ...props
  },
  ref
) {
  const clamp = (entry: number) => Math.min(Math.max(entry, min), max);
  const [internal, setInternal] = React.useState<[number, number]>(() => {
    const initial = defaultValue ?? [min, max];
    return [clamp(initial[0]), clamp(initial[1])];
  });
  const current = value ?? internal;
  const low = Math.min(clamp(current[0]), clamp(current[1]));
  const high = Math.max(clamp(current[0]), clamp(current[1]));

  const commit = (next: [number, number]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const span = max - min || 1;
  const lowPercent = ((low - min) / span) * 100;
  const highPercent = ((high - min) / span) * 100;

  return (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {showValues && (
        <div className="mb-2 flex items-center justify-between text-sm font-medium tabular-nums">
          <span>{formatValue(low)}</span>
          <span>{formatValue(high)}</span>
        </div>
      )}
      <div className="relative h-5 w-full">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          disabled={disabled}
          aria-label={startLabel}
          aria-valuetext={formatValue(low)}
          onChange={(event) => commit([Math.min(Number(event.target.value), high), high])}
          className={cn(rangeInputClass, 'z-10')}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          disabled={disabled}
          aria-label={endLabel}
          aria-valuetext={formatValue(high)}
          onChange={(event) => commit([low, Math.max(Number(event.target.value), low)])}
          className={cn(rangeInputClass, 'z-20')}
        />
      </div>
    </div>
  );
});
