import * as React from 'react';
import { cn } from '../../utils/cn';

export type StatItem = {
  /** The headline number or short value (e.g. "12,000+"). */
  value: React.ReactNode;
  /** What the value measures. */
  label: string;
  /** Optional supporting line under the label. */
  hint?: string;
};

export type StatBandProps = React.HTMLAttributes<HTMLDListElement> & {
  /** Stats to display. */
  items: StatItem[];
  /** Desktop column count (2-4). Default 3. */
  columns?: 2 | 3 | 4;
  /** Copy alignment. Default 'center'. */
  align?: 'left' | 'center';
  /** Value scale. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Draw dividers between stats at sm and up. Default true. */
  divided?: boolean;
  /**
   * Surface treatment. 'panel' renders a bordered strip of hairline-separated
   * cells with denser type for data pages; 'plain' is the marketing band.
   * Default 'plain'.
   */
  variant?: 'plain' | 'panel';
  /** Extra classes for the value element (e.g. font-mono for tabular numerals). */
  valueClassName?: string;
};

const columnClasses: Record<NonNullable<StatBandProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

const valueClasses: Record<NonNullable<StatBandProps['size']>, string> = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl sm:text-5xl',
};

const panelValueClasses: Record<NonNullable<StatBandProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-xl sm:text-2xl',
  lg: 'text-2xl sm:text-3xl',
};

/**
 * Marketing stat band: a semantic description list of headline numbers with
 * labels and optional hints. Use it inside a Section; the Section owns the
 * surface tone, so the same band works on white and inverse backgrounds.
 */
export const StatBand = React.forwardRef<HTMLDListElement, StatBandProps>(function StatBand(
  {
    items,
    columns = 3,
    align = 'center',
    size = 'md',
    divided = true,
    variant = 'plain',
    valueClassName,
    className,
    ...props
  },
  ref
) {
  const panel = variant === 'panel';
  return (
    <dl
      ref={ref}
      className={cn(
        'grid w-full',
        panel ? 'gap-0 rounded-lg border border-border bg-card' : 'gap-8',
        columnClasses[columns],
        divided &&
          (panel
            ? 'divide-y divide-border sm:divide-x sm:divide-y-0'
            : 'sm:divide-x sm:divide-border'),
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'flex min-w-0 flex-col gap-1',
            panel ? 'px-4 py-3 sm:px-5 sm:py-4' : 'sm:px-6 sm:first:pl-0 sm:last:pr-0',
            align === 'center' ? 'items-center text-center' : 'items-start text-left'
          )}
        >
          <dt
            className={cn(
              'order-2 text-muted-foreground',
              panel ? 'text-xs font-medium uppercase tracking-wide' : 'text-sm font-medium'
            )}
          >
            {item.label}
            {item.hint && (
              <span className={cn('mt-1 block font-normal', panel ? 'text-xs normal-case tracking-normal' : 'text-xs')}>
                {item.hint}
              </span>
            )}
          </dt>
          <dd
            className={cn(
              'order-1 m-0 font-semibold tracking-tight tabular-nums',
              panel ? panelValueClasses[size] : valueClasses[size],
              valueClassName
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
});
