import * as React from 'react';
import { cn } from '../../utils/cn';

export type HeroVariant = 'split' | 'centered' | 'stacked' | 'overlay';

export type HeroProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  /** Main headline. Accepts inline markup for a highlighted phrase. */
  title: React.ReactNode;
  /** Supporting sentence under the headline. */
  description?: React.ReactNode;
  /** Small overline above the headline. */
  eyebrow?: React.ReactNode;
  /** Pill above the headline (announcement, category, proof point). */
  badge?: React.ReactNode;
  /** Primary and secondary calls to action. */
  actions?: React.ReactNode;
  /** Product shot, illustration, video or form shown beside or behind the copy. */
  media?: React.ReactNode;
  /** Which side the media sits on at lg and up in the split layout. Default 'right'. */
  mediaPosition?: 'left' | 'right';
  /** Copy alignment. Centered is typically used without media. */
  align?: 'left' | 'center';
  /** Headline scale. Default 'lg'. */
  size?: 'md' | 'lg';
  /** Heading level. Default 1; use 2 when the hero is nested under a page h1. */
  level?: 1 | 2;
  /**
   * Layout:
   * - `split` places copy and media side by side at lg and up (default with media).
   * - `centered` stacks copy in a narrow centered column (default without media).
   * - `stacked` puts copy above full-width media, left aligned unless `align` says otherwise.
   * - `overlay` places media behind the copy with a scrim; copy stays readable in both themes.
   */
  variant?: HeroVariant;
  /** Semantic element (default 'div'). */
  as?: 'div' | 'section' | 'header';
  /** Extra classes for the headline, for host display typography. */
  titleClassName?: string;
  /** Extra classes for the description. */
  descriptionClassName?: string;
  /** Extra classes for the eyebrow. */
  eyebrowClassName?: string;
  /** Extra classes for the badge wrapper. */
  badgeClassName?: string;
  /** Extra classes for the media wrapper. */
  mediaClassName?: string;
};

const titleSizes = {
  md: 'text-3xl sm:text-4xl md:text-5xl',
  lg: 'text-4xl sm:text-5xl md:text-6xl lg:leading-[1.05]',
} as const;

/**
 * Marketing hero: optional badge/eyebrow, a large headline, supporting copy,
 * calls to action and an optional media slot. Four responsive layouts cover
 * the common landing-page shapes: split, centered, stacked and overlay. Use it
 * inside Section so the band owns its tone and vertical padding. For a
 * documentation page title without media, use PageHeader instead.
 */
export const Hero = React.forwardRef<HTMLElement, HeroProps>(function Hero(
  {
    title,
    description,
    eyebrow,
    badge,
    actions,
    media,
    mediaPosition = 'right',
    align = 'left',
    size = 'lg',
    level = 1,
    variant,
    as = 'div',
    titleClassName,
    descriptionClassName,
    eyebrowClassName,
    badgeClassName,
    mediaClassName,
    className,
    ...props
  },
  ref
) {
  const Tag = as as 'div';
  const layout = variant ?? (media ? 'split' : 'centered');
  const Heading = `h${level}` as 'h1' | 'h2';
  const centered = layout === 'centered' || align === 'center';
  const overlay = layout === 'overlay';

  const copy = (
    <div
      className={cn(
        'min-w-0',
        centered && 'mx-auto flex max-w-3xl flex-col items-center text-center',
        overlay && 'max-w-2xl'
      )}
    >
      {badge && (
        <div
          className={cn(
            'mb-5 inline-flex rounded-full border px-3 py-1 text-xs font-medium',
            overlay
              ? 'border-background/30 bg-background/10 text-background'
              : 'border-primary/30 bg-primary/10 text-primary',
            badgeClassName
          )}
        >
          {badge}
        </div>
      )}
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-xs font-semibold uppercase tracking-widest',
            overlay ? 'text-background/90' : 'text-primary',
            eyebrowClassName
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          'font-semibold tracking-tight text-balance',
          titleSizes[size],
          overlay && 'text-background',
          titleClassName
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed sm:text-lg',
            overlay ? 'text-background/80' : 'text-muted-foreground',
            centered ? 'max-w-2xl' : 'max-w-xl',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      {actions && (
        <div
          className={cn(
            'mt-8 flex flex-wrap items-center gap-3',
            centered && 'justify-center'
          )}
        >
          {actions}
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <Tag
        ref={ref as never}
        className={cn(
          'relative isolate flex min-h-[22rem] w-full items-center overflow-hidden rounded-lg py-12 sm:min-h-[26rem] sm:py-16 lg:min-h-[32rem] lg:py-20',
          className
        )}
        {...props}
      >
        {media && (
          <div
            className={cn(
              'absolute inset-0 -z-20 [&>*]:h-full [&>*]:w-full [&>*]:object-cover',
              mediaClassName
            )}
          >
            {media}
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-foreground/60" />
        <div className="relative w-full px-4 sm:px-6 lg:px-10">{copy}</div>
      </Tag>
    );
  }

  if (layout === 'centered') {
    return (
      <Tag ref={ref as never} className={cn('w-full', className)} {...props}>
        {copy}
        {media && <div className={cn('mt-12 min-w-0', mediaClassName)}>{media}</div>}
      </Tag>
    );
  }

  if (layout === 'stacked') {
    return (
      <Tag
        ref={ref as never}
        className={cn('flex w-full flex-col gap-10 lg:gap-14', className)}
        {...props}
      >
        {copy}
        {media && <div className={cn('min-w-0 w-full', mediaClassName)}>{media}</div>}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      className={cn('grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20', className)}
      {...props}
    >
      <div className={cn(mediaPosition === 'left' && 'lg:order-2')}>{copy}</div>
      {media && (
        <div className={cn('min-w-0', mediaPosition === 'left' && 'lg:order-1', mediaClassName)}>
          {media}
        </div>
      )}
    </Tag>
  );
});
