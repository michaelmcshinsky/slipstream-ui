import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value between 0 and `max`. */
  value?: number;
  /** Upper bound (default 100). */
  max?: number;
  /** Accessible label announced by screen readers. */
  label?: string;
}

/**
 * Determinate progress bar. Exposes `role="progressbar"` with
 * `aria-valuenow`/`aria-valuemax` so assistive tech reports the exact
 * percentage; the visual track is pure CSS.
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, label, ...props }, ref) => {
    const clamped = Math.min(Math.max(value, 0), max);
    const percent = max > 0 ? (clamped / max) * 100 : 0;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
