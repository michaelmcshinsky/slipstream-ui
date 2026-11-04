import * as React from 'react';
import { cn } from '../../utils/cn';

export type StepperStep = {
  label: string;
  description?: string;
};

export type StepperProps = Omit<React.OlHTMLAttributes<HTMLOListElement>, 'onClick'> & {
  steps: StepperStep[];
  /** Zero-based index of the active step. */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  /** Makes completed/upcoming steps clickable. */
  onStepClick?: (index: number) => void;
};

/**
 * Progress through a multi-step flow with proper semantics: an ordered list
 * where the active step carries aria-current="step" and each marker states
 * complete/current/upcoming in text, not only color.
 */
export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, orientation = 'horizontal', onStepClick, className, ...props },
  ref
) {
  return (
    <ol
      ref={ref}
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-wrap items-start',
        className
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const state = index < current ? 'complete' : index === current ? 'current' : 'upcoming';
        const interactive = Boolean(onStepClick);
        const content = (
          <>
            <span
              aria-hidden="true"
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
                state === 'complete' && 'border-primary bg-primary text-primary-foreground',
                state === 'current' && 'border-primary text-primary',
                state === 'upcoming' && 'border-border text-muted-foreground'
              )}
            >
              {state === 'complete' ? '✓' : index + 1}
            </span>
            <span className="min-w-0">
              <span className={cn('block text-sm', state === 'upcoming' ? 'text-muted-foreground' : 'font-medium')}>
                {step.label}
              </span>
              {step.description && (
                <span className="block text-xs text-muted-foreground">{step.description}</span>
              )}
              <span className="sr-only">
                {state === 'complete' ? ' (completed)' : state === 'current' ? ' (current step)' : ' (upcoming)'}
              </span>
            </span>
          </>
        );

        return (
          <li key={step.label} className="flex min-w-0 items-start gap-2">
            {interactive ? (
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                aria-current={state === 'current' ? 'step' : undefined}
                className="flex items-start gap-2 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {content}
              </button>
            ) : (
              <div aria-current={state === 'current' ? 'step' : undefined} className="flex items-start gap-2">
                {content}
              </div>
            )}
            {orientation === 'horizontal' && index < steps.length - 1 && (
              <span aria-hidden="true" className="mt-3.5 hidden h-px w-8 bg-border sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
});
