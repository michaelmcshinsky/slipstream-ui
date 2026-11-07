import * as React from 'react';
import { cn } from '../../utils/cn';

export type SectionHeadingProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  /** Kicker above the title (category, step, overline). */
  eyebrow?: React.ReactNode;
  /** Right-aligned actions (link to all, buttons). */
  actions?: React.ReactNode;
  /** Heading level rendered for the title (default h2). */
  level?: 2 | 3 | 4;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  /** Extra classes for the title, for host typography (display fonts, scales). */
  titleClassName?: string;
  /** Extra classes for the description. */
  descriptionClassName?: string;
  /** Extra classes for the eyebrow. */
  eyebrowClassName?: string;
};

const sizeClasses: Record<NonNullable<SectionHeadingProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
};

/**
 * Marketing/content section heading: eyebrow, title, description and an
 * actions slot, with heading level and alignment control. Complements
 * PageHeader (which owns the page's single h1).
 */
export const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(function SectionHeading(
  { title, description, eyebrow, actions, level = 2, align = 'left', size = 'md', titleClassName, descriptionClassName, eyebrowClassName, className, ...props },
  ref
) {
  const Heading = `h${level}` as 'h2' | 'h3' | 'h4';

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-2',
        align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className
      )}
      {...props}
    >
      <div className={cn('min-w-0', align === 'center' && 'flex flex-col items-center')}>
        {eyebrow && <div className={cn('mb-1 text-xs font-medium uppercase tracking-wide text-primary', eyebrowClassName)}>{eyebrow}</div>}
        <Heading className={cn('font-semibold tracking-tight', sizeClasses[size], titleClassName)}>{title}</Heading>
        {description && (
          <p className={cn('mt-2 max-w-2xl text-muted-foreground', align === 'center' ? 'mx-auto' : '', descriptionClassName)}>{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
});
