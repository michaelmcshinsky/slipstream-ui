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

/**
 * Marketing stat band: a semantic description list of headline numbers with
 * labels and optional hints. Use it inside a Section; the Section owns the
 * surface tone, so the same band works on white and inverse backgrounds.
 */
export const StatBand = React.forwardRef<HTMLDListElement, StatBandProps>(function StatBand(
  { items, columns = 3, align = 'center', size = 'md', divided = true, className, ...props },
  ref
) {
  return (
    <dl
      ref={ref}
      className={cn(
        'grid w-full gap-8',
        columnClasses[columns],
        divided && 'sm:divide-x sm:divide-border',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'flex min-w-0 flex-col gap-1 sm:px-6 sm:first:pl-0 sm:last:pr-0',
            align === 'center' ? 'items-center text-center' : 'items-start text-left'
          )}
        >
          <dt className="order-2 text-sm font-medium text-muted-foreground">
            {item.label}
            {item.hint && <span className="mt-1 block text-xs font-normal">{item.hint}</span>}
          </dt>
          <dd className={cn('order-1 m-0 font-semibold tracking-tight tabular-nums', valueClasses[size])}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
});
