import * as React from 'react';
import { cn } from '../../utils/cn';

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
  /** Product shot, illustration, video or form shown beside the copy. */
  media?: React.ReactNode;
  /** Which side the media sits on at lg and up. Default 'right'. */
  mediaPosition?: 'left' | 'right';
  /** Copy alignment. Centered is typically used without media. */
  align?: 'left' | 'center';
  /** Headline scale. Default 'lg'. */
  size?: 'md' | 'lg';
  /** Heading level. Default 1; use 2 when the hero is nested under a page h1. */
  level?: 1 | 2;
  /**
   * Split places copy and media side by side; centered stacks copy in a
   * narrow column. Defaults to split when media is provided.
   */
  variant?: 'split' | 'centered';
  /** Semantic element (default 'div'). */
  as?: 'div' | 'section' | 'header';
};

const titleSizes = {
  md: 'text-4xl sm:text-5xl',
  lg: 'text-4xl sm:text-5xl lg:text-6xl lg:leading-[1.05]',
} as const;

/**
 * Marketing hero: optional badge/eyebrow, a large headline, supporting copy,
 * calls to action and an optional media slot. Use it inside Section so the
 * band owns its tone and vertical padding. For a documentation page title
 * without media, use PageHeader instead.
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
    className,
    ...props
  },
  ref
) {
  const Tag = as as 'div';
  const layout = variant ?? (media ? 'split' : 'centered');
  const Heading = `h${level}` as 'h1' | 'h2';
  const centered = layout === 'centered' || align === 'center';

  const copy = (
    <div className={cn('min-w-0', centered && 'mx-auto flex max-w-3xl flex-col items-center text-center')}>
      {badge && (
        <div className="mb-5 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {badge}
        </div>
      )}
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      )}
      <Heading className={cn('font-semibold tracking-tight text-balance', titleSizes[size])}>
        {title}
      </Heading>
      {description && (
        <p className={cn('mt-5 text-lg leading-relaxed text-muted-foreground', centered ? 'max-w-2xl' : 'max-w-xl')}>
          {description}
        </p>
      )}
      {actions && (
        <div className={cn('mt-8 flex flex-wrap items-center gap-3', centered && 'justify-center')}>
          {actions}
        </div>
      )}
    </div>
  );

  if (layout === 'centered') {
    return (
      <Tag ref={ref as never} className={cn('w-full', className)} {...props}>
        {copy}
        {media && <div className="mt-12">{media}</div>}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      className={cn('grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16', className)}
      {...props}
    >
      <div className={cn(mediaPosition === 'left' && 'lg:order-2')}>{copy}</div>
      {media && (
        <div className={cn('min-w-0', mediaPosition === 'left' && 'lg:order-1')}>{media}</div>
      )}
    </Tag>
  );
});
