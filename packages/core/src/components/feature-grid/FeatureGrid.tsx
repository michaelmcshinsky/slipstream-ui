import * as React from 'react';
import { cn } from '../../utils/cn';

export type FeatureItem = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  /** Link text shown when href is present. */
  actionLabel?: string;
};

export type FeatureGridProps = React.HTMLAttributes<HTMLUListElement> & {
  /** Features to display. */
  features: FeatureItem[];
  /** Desktop column count (2-4). Default 3. */
  columns?: 2 | 3 | 4;
  /** Card surface or plain stack. Default 'card'. */
  variant?: 'card' | 'plain';
  /** Content alignment. Default 'left'. */
  align?: 'left' | 'center';
  /** Custom link element for routers. */
  linkComponent?: React.ElementType;
};

const columnClasses: Record<NonNullable<FeatureGridProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Grid of feature or benefit cards with an optional icon, copy and link.
 * Use it for the three-risk, six-category and feature-row sections common on
 * marketing pages. Each card is a list item, so the group is announced as a list.
 */
export const FeatureGrid = React.forwardRef<HTMLUListElement, FeatureGridProps>(function FeatureGrid(
  { features, columns = 3, variant = 'card', align = 'left', linkComponent, className, ...props },
  ref
) {
  const Link = linkComponent ?? 'a';
  const cardClass = cn(
    'group flex h-full flex-col gap-3 rounded-xl p-6',
    variant === 'card' && 'border border-border bg-card shadow-sm transition-colors hover:border-primary/40',
    align === 'center' && 'items-center text-center'
  );

  const content = (feature: FeatureItem) => (
    <>
      {feature.icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5">
          {feature.icon}
        </span>
      )}
      <h3 className="text-base font-semibold tracking-tight">{feature.title}</h3>
      {feature.description && <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>}
      {feature.href && feature.actionLabel && (
        <span className="mt-auto pt-2 text-sm font-medium text-primary">
          {feature.actionLabel} <span aria-hidden="true">→</span>
        </span>
      )}
    </>
  );

  return (
    <ul ref={ref} className={cn('grid gap-6', columnClasses[columns], className)} {...props}>
      {features.map((feature) => (
        <li key={feature.title} className="min-w-0">
          {feature.href ? (
            <Link href={feature.href} className={cn(cardClass, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background')}>
              {content(feature)}
            </Link>
          ) : (
            <div className={cardClass}>{content(feature)}</div>
          )}
        </li>
      ))}
    </ul>
  );
});
