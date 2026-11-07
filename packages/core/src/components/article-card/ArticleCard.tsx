import * as React from 'react';
import { cn } from '../../utils/cn';

export type ArticleCardProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  /** Article title. */
  title: string;
  /** Summary copy. */
  description?: string;
  /** Destination URL. */
  href: string;
  /** Category or content type. */
  eyebrow?: string;
  /** Image, illustration or video poster. */
  media?: React.ReactNode;
  /** Date, read time, author or other metadata. */
  meta?: React.ReactNode;
  /** Custom link element for routers. */
  linkComponent?: React.ElementType;
  /** Standard card or a denser compact card. */
  variant?: 'default' | 'compact';
};

/**
 * Article or resource card for a content hub. The whole card is one link, so
 * do not nest buttons or other links inside it. Media is a slot so consumers
 * can use next/image, a plain img, a video poster or an illustration.
 */
export const ArticleCard = React.forwardRef<HTMLElement, ArticleCardProps>(function ArticleCard(
  {
    title,
    description,
    href,
    eyebrow,
    media,
    meta,
    linkComponent,
    variant = 'default',
    className,
    ...props
  },
  ref
) {
  const Link = linkComponent ?? 'a';
  const compact = variant === 'compact';

  return (
    <article ref={ref as never} className={cn('h-full', className)} {...props}>
      <Link
        href={href}
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        )}
      >
        {media && !compact && (
          <div className="aspect-[16/10] w-full overflow-hidden bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
            {media}
          </div>
        )}
        <div className={cn('flex flex-1 flex-col gap-2', compact ? 'p-4' : 'p-5')}>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          )}
          <h3 className={cn('font-semibold tracking-tight transition-colors group-hover:text-primary', compact ? 'text-base' : 'text-lg')}>
            {title}
          </h3>
          {description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
          {meta && <div className="mt-auto pt-2 text-xs text-muted-foreground">{meta}</div>}
        </div>
      </Link>
    </article>
  );
});
