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
          {/*
            One rail per item, absolutely positioned so it starts at the dot's
            bottom edge and runs through the list gap into the next dot. A
            flex-column connector stops at the item box, which left a visible
            break at every item boundary.
          */}
          {index < items.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[5.5px] top-4 -bottom-7 w-px bg-border"
            />
          )}
          <div className="relative z-10 flex flex-col items-center">
            <span
              aria-hidden="true"
              className={cn(
                'mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2',
                item.muted ? 'border-border bg-background' : 'border-primary bg-primary'
              )}
            />
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
