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
  /** Layout direction. Default 'horizontal'. */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Marker style. `numbered` shows the step number and a check when complete;
   * `dots` is the compact progress variant with no numbers.
   */
  variant?: 'numbered' | 'dots';
  /** Marker and label scale. Default 'md'. */
  size?: 'sm' | 'md';
  /** Horizontal only: place the label beside the marker or beneath it. Default 'inline'. */
  labelPlacement?: 'inline' | 'below';
  /**
   * Center a title vertically against its marker when that step has no
   * description. Titles with a description stay top aligned. Default 'center'.
   */
  alignTitles?: 'start' | 'center';
  /** Makes completed/upcoming steps clickable. */
  onStepClick?: (index: number) => void;
};

/**
 * Progress through a multi-step flow with proper semantics: an ordered list
 * where the active step carries aria-current="step" and each marker states
 * complete/current/upcoming in text, not only color.
 *
 * Four practical shapes: horizontal inline labels, horizontal labels below
 * the markers, a vertical timeline, and a compact dots variant for tight
 * spaces. All four are responsive and keyboard operable when `onStepClick`
 * is provided.
 */
export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  {
    steps,
    current,
    orientation = 'horizontal',
    variant = 'numbered',
    size = 'md',
    labelPlacement = 'inline',
    alignTitles = 'center',
    onStepClick,
    className,
    ...props
  },
  ref
) {
  const vertical = orientation === 'vertical';
  const interactive = Boolean(onStepClick);

  const markerSizeClass = size === 'sm' ? 'h-6 w-6 text-[11px]' : 'h-7 w-7 text-xs';
  const dotSizeClass = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  const labelSizeClass = size === 'sm' ? 'text-xs' : 'text-sm';
  const descriptionSizeClass = size === 'sm' ? 'text-[11px]' : 'text-xs';
  const gapClass = size === 'sm' ? 'gap-1.5' : 'gap-2';
  const verticalTitlePad = size === 'sm' ? 'pt-0.5' : 'pt-1';
  const connectorTop =
    variant === 'dots'
      ? size === 'sm'
        ? 'mt-1'
        : 'mt-[5px]'
      : size === 'sm'
        ? 'mt-3'
        : 'mt-3.5';

  const focusClass =
    'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <ol
      ref={ref}
      className={cn(
        vertical ? 'flex flex-col' : 'flex flex-wrap items-start gap-4',
        className
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const state = index < current ? 'complete' : index === current ? 'current' : 'upcoming';
        const isLast = index === steps.length - 1;
        const titleCentered = alignTitles === 'center' && !step.description;
        const below = !vertical && labelPlacement === 'below';

        const marker = (
          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 items-center justify-center',
              variant === 'dots'
                ? cn(
                    'rounded-full',
                    dotSizeClass,
                    state === 'upcoming' ? 'bg-border' : 'bg-primary',
                    state === 'current' && 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
                  )
                : cn(
                    'rounded-full border font-medium',
                    markerSizeClass,
                    state === 'complete' && 'border-primary bg-primary text-primary-foreground',
                    state === 'current' && 'border-primary text-primary',
                    state === 'upcoming' && 'border-border text-muted-foreground'
                  )
            )}
          >
            {variant === 'numbered' ? (state === 'complete' ? '✓' : index + 1) : null}
          </span>
        );

        const label = (
          <span className="min-w-0">
            <span
              className={cn(
                'block leading-5',
                labelSizeClass,
                below && 'text-center',
                state === 'upcoming' ? 'text-muted-foreground' : 'font-medium'
              )}
            >
              {step.label}
            </span>
            {step.description && (
              <span
                className={cn(
                  'mt-0.5 block leading-4 text-muted-foreground',
                  descriptionSizeClass,
                  below && 'text-center'
                )}
              >
                {step.description}
              </span>
            )}
            <span className="sr-only">
              {state === 'complete' ? ' (completed)' : state === 'current' ? ' (current step)' : ' (upcoming)'}
            </span>
          </span>
        );

        const renderRow = (children: React.ReactNode, rowClassName: string) =>
          interactive ? (
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              aria-current={state === 'current' ? 'step' : undefined}
              className={cn(rowClassName, focusClass)}
            >
              {children}
            </button>
          ) : (
            <div aria-current={state === 'current' ? 'step' : undefined} className={rowClassName}>
              {children}
            </div>
          );

        if (vertical) {
          return (
            <li key={step.label} className="flex">
              {renderRow(
                <>
                  <div className="flex flex-col items-center">
                    {marker}
                    {!isLast && (
                      <span aria-hidden="true" className="my-1 w-px flex-1 rounded-full bg-border" />
                    )}
                  </div>
                  <div className={cn('min-w-0 pb-6', titleCentered && verticalTitlePad)}>{label}</div>
                </>,
                'flex w-full items-stretch gap-3 text-left'
              )}
            </li>
          );
        }

        if (below) {
          return (
            <li key={step.label} className="flex min-w-0 flex-1 items-start gap-2">
              {renderRow(
                <>
                  {marker}
                  {label}
                </>,
                'flex min-w-0 flex-1 flex-col items-center gap-2 text-center'
              )}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn('h-px min-w-4 flex-1 bg-border', connectorTop)}
                />
              )}
            </li>
          );
        }

        return (
          <li key={step.label} className="flex min-w-0 items-start gap-2">
            {renderRow(
              <>
                {marker}
                {label}
              </>,
              cn('flex min-w-0 text-left', gapClass, titleCentered ? 'items-center' : 'items-start')
            )}
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn('h-px w-6 shrink-0 bg-border sm:w-8', connectorTop)}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
});
