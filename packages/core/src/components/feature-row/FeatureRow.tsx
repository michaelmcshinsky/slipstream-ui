import * as React from 'react';
import { cn } from '../../utils/cn';

export type FeatureRowProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** Row heading. */
  title: React.ReactNode;
  /** Supporting copy. */
  description?: React.ReactNode;
  /** Small overline above the heading. */
  eyebrow?: React.ReactNode;
  /** Calls to action. */
  actions?: React.ReactNode;
  /** Image, mockup, video or form shown beside the copy. */
  media: React.ReactNode;
  /** Which side the media sits on at lg and up. Default 'right'. */
  mediaPosition?: 'left' | 'right';
  /** Heading level. Default 2. */
  level?: 2 | 3;
  /** Heading scale. Default 'md'. */
  size?: 'md' | 'lg';
};

const titleSizes = {
  md: 'text-3xl',
  lg: 'text-3xl sm:text-4xl',
} as const;

/**
 * Alternating media and copy row for feature sections. Unlike Hero, this is a
 * mid-page block with a smaller heading and no h1. Use several rows to explain
 * a workflow, product surface or audience benefit.
 */
export const FeatureRow = React.forwardRef<HTMLDivElement, FeatureRowProps>(function FeatureRow(
  {
    title,
    description,
    eyebrow,
    actions,
    media,
    mediaPosition = 'right',
    level = 2,
    size = 'md',
    className,
    ...props
  },
  ref
) {
  const Heading = `h${level}` as 'h2' | 'h3';

  return (
    <div
      ref={ref}
      className={cn('grid items-center gap-10 lg:grid-cols-2 lg:gap-16', className)}
      {...props}
    >
      <div className={cn('min-w-0', mediaPosition === 'left' && 'lg:order-2')}>
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        <Heading className={cn('font-semibold tracking-tight text-balance', titleSizes[size])}>{title}</Heading>
        {description && (
          <div className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </div>
        )}
        {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      <div className={cn('min-w-0', mediaPosition === 'left' && 'lg:order-1')}>{media}</div>
    </div>
  );
});
