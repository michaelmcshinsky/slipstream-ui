import * as React from 'react';
import { cn } from '../../utils/cn';
import { Badge, type BadgeProps } from '../badge/Badge';
import { CoverImage, type CoverImageProps } from '../cover-image/CoverImage';
import { linkDestination, type LinkLikeProps } from '../../utils/link';

export type MediaCardChip = {
  label: string;
  /** Badge variant; quiet outline tones fit status metadata best. */
  variant?: BadgeProps['variant'];
  /** Leading status dot. */
  dot?: boolean;
};

export type MediaCardProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & LinkLikeProps & {
  /** Card title. */
  title: string;
  /** Supporting copy under the title. */
  description?: React.ReactNode;
  /** Destination URL; the whole card becomes one link when set. */
  href?: string;
  /** Cover art rendered through CoverImage (seeded gradient fallback included). */
  cover?: Omit<CoverImageProps, 'className'>;
  /** Metadata line under the description (date, location, deadline). */
  meta?: React.ReactNode;
  /** Status/category chips rendered as Badges. */
  chips?: MediaCardChip[];
  /** Bottom slot for a details affordance or secondary text. Non-interactive when the card is a link. */
  footer?: React.ReactNode;
  /** 'vertical' stacks cover over content; 'row' puts a fixed-width cover beside it. */
  layout?: 'vertical' | 'row';
};

/**
 * Media card for event, article and listing grids: CoverImage on top (or
 * beside in `layout="row"`), title, description, metadata line, status chips
 * and an optional footer. With `href` the entire card is a single link —
 * one target, one hover state, one focus ring — so keep `footer` free of
 * nested interactive elements.
 */
export const MediaCard = React.forwardRef<HTMLElement, MediaCardProps>(function MediaCard(
  {
    title,
    description,
    href,
    cover,
    meta,
    chips,
    footer,
    layout = 'vertical',
    linkComponent,
    linkHrefProp = 'href',
    className,
    ...props
  },
  ref
) {
  const Link = linkComponent ?? 'a';
  const destination = href ? linkDestination(href, linkHrefProp) : undefined;
  const row = layout === 'row';

  const body = (
    <>
      {cover && (
        <CoverImage
          {...cover}
          className={cn(
            row ? 'w-36 shrink-0 sm:w-44' : 'w-full',
            !row && 'rounded-none border-b border-border'
          )}
        />
      )}
      <div className={cn('flex min-w-0 flex-1 flex-col gap-2', row ? 'p-4' : 'p-5')}>
        {chips && chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <Badge key={chip.label} variant={chip.variant ?? 'outline'} size="sm" dot={chip.dot}>
                {chip.label}
              </Badge>
            ))}
          </div>
        )}
        <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary-ink">{title}</h3>
        {description && (
          <div className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{description}</div>
        )}
        {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
        {footer && <div className="mt-auto pt-2 text-xs text-muted-foreground">{footer}</div>}
      </div>
    </>
  );

  const cardClass = cn(
    'group flex h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/40',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    row ? 'flex-row' : 'flex-col',
    className
  );

  return (
    <article ref={ref as never} className="h-full" {...props}>
      {href && destination ? (
        <Link {...destination} className={cardClass}>
          {body}
        </Link>
      ) : (
        <div className={cardClass}>{body}</div>
      )}
    </article>
  );
});

MediaCard.displayName = 'MediaCard';
