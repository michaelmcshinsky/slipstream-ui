import * as React from 'react';
import { cn } from '../../utils/cn';

export type ProcessStep = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export type ProcessStepsProps = React.HTMLAttributes<HTMLOListElement> & {
  /** Ordered steps. */
  steps: ProcessStep[];
  /** Desktop column count (2-4). Default 3. */
  columns?: 2 | 3 | 4;
  /** Show step numbers when no icon is provided. Default true. */
  numbered?: boolean;
  /** Content alignment. Default 'left'. */
  align?: 'left' | 'center';
};

const columnClasses: Record<NonNullable<ProcessStepsProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Ordered process or onboarding steps. Numbers are derived from the list
 * order and announced as an ordered list, so the sequence survives without
 * relying on decorative connectors.
 */
export const ProcessSteps = React.forwardRef<HTMLOListElement, ProcessStepsProps>(function ProcessSteps(
  { steps, columns = 3, numbered = true, align = 'left', className, ...props },
  ref
) {
  return (
    <ol ref={ref} className={cn('grid gap-8', columnClasses[columns], className)} {...props}>
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={cn('flex min-w-0 flex-col gap-4', align === 'center' && 'items-center text-center')}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary [&_svg]:size-5">
            {step.icon ?? (numbered ? String(index + 1).padStart(2, '0') : null)}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
            {step.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
});
