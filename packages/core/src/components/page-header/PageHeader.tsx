import * as React from 'react';
import { cn } from '../../utils/cn';

export type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  /** Alias for `description` (migration-friendly). */
  subtitle?: string;
  /** Breadcrumbs/eyebrow above the title. */
  breadcrumbs?: React.ReactNode;
  /** Right-aligned actions (buttons, menus). */
  actions?: React.ReactNode;
  /** Small slot under the title row (tabs, filters). */
  children?: React.ReactNode;
  /** Eyebrow/kicker above the title (category, date, overline). */
  eyebrow?: React.ReactNode;
  /** Heading scale - 'hero' is for marketing landing pages. */
  size?: 'sm' | 'md' | 'lg' | 'hero';
  /** Text alignment; hero marketing pages often center. */
  align?: 'left' | 'center';
  /** Extra classes for the h1, for host display typography. */
  titleClassName?: string;
  /** Extra classes for the description. */
  descriptionClassName?: string;
  /** Extra classes for the eyebrow. */
  eyebrowClassName?: string;
};

const sizeClasses: Record<NonNullable<PageHeaderProps['size']>, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  hero: 'text-4xl sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]',
};

/**
 * Standard page heading block: optional breadcrumbs, title, description and
 * a right-aligned action cluster. Pages stop inventing their own spacing
 * and heading hierarchy.
 */
export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { title, description, subtitle, breadcrumbs, actions, eyebrow, size = 'md', align = 'left', titleClassName, descriptionClassName, eyebrowClassName, className, children, ...props },
  ref
) {
  const supporting = description ?? subtitle;
  return (
    <div ref={ref} className={cn('flex flex-col gap-2', align === 'center' && 'items-center text-center', className)} {...props}>
      {breadcrumbs && <div className="text-sm text-muted-foreground">{breadcrumbs}</div>}
      {eyebrow && (
        <div className={cn('text-xs font-medium uppercase tracking-wide text-primary', eyebrowClassName)}>{eyebrow}</div>
      )}
      <div className={cn('flex w-full flex-wrap items-start justify-between gap-3', align === 'center' && 'justify-center')}>
        <div className={cn('min-w-0', align === 'center' && 'flex flex-col items-center')}>
          <h1 className={cn('font-semibold tracking-tight', sizeClasses[size], titleClassName)}>{title}</h1>
          {supporting && <p className={cn('mt-2 max-w-2xl text-base text-muted-foreground', descriptionClassName)}>{supporting}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
});
