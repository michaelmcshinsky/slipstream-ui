import * as React from 'react';
import { cn } from '../../utils/cn';

export type TimelineItem = {
  title: string;
  /** Period/date label (e.g. "2023 — Present"). */
  period?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Muted items render dimmed (upcoming/archived). */
  muted?: boolean;
};

export type TimelineProps = Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children'> & {
  items: TimelineItem[];
};

/**
 * Vertical chronology (experience, activity, audit trail). Renders an
 * ordered list with a connector rule, so the sequence is conveyed
 * structurally instead of by decoration alone.
 */
export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { items, className, ...props },
  ref
) {
  return (
    <ol ref={ref} className={cn('relative flex flex-col gap-6', className)} {...props}>
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <span
              aria-hidden="true"
              className={cn(
                'mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2',
                item.muted ? 'border-border bg-background' : 'border-primary bg-primary'
              )}
            />
            {index < items.length - 1 && <span aria-hidden="true" className="mt-1 w-px flex-1 bg-border" />}
          </div>
          <div className="min-w-0 pb-1">
            {item.period && (
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.period}</p>
            )}
            <p className={cn('text-sm font-semibold', item.muted && 'text-muted-foreground')}>{item.title}</p>
            {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
            {item.icon && <div className="mt-1 text-muted-foreground [&_svg]:size-4">{item.icon}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
});
