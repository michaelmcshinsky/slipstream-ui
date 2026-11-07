import * as React from 'react';
import { cn } from '../../utils/cn';
import { Section, type SectionTone } from '../section/Section';
import type { ContainerWidth } from '../container/Container';

export type CTASectionTone = Extract<SectionTone, 'default' | 'muted' | 'brand' | 'inverse'>;

export type CTASectionProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  /** Headline for the call to action. */
  title: string;
  /** Supporting copy under the headline. */
  description?: string;
  /** Small overline above the headline. */
  eyebrow?: string;
  /** Buttons or links. */
  actions?: React.ReactNode;
  /** Surface treatment. Default 'inverse' for a contrasting band. */
  tone?: CTASectionTone;
  /** Copy alignment. Default 'center'. */
  align?: 'left' | 'center';
  /** Vertical space. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Inner container width. Default 'lg'. */
  width?: ContainerWidth;
};

const sizePadding = {
  sm: 'md',
  md: 'lg',
  lg: 'xl',
} as const;

/**
 * Full-width conversion band: optional eyebrow, headline, supporting copy and
 * an action cluster. Use it at the end of a marketing page, between feature
 * sections, or after a content hub. Section owns the tone and spacing;
 * CTASection owns the centered content hierarchy.
 */
export const CTASection = React.forwardRef<HTMLElement, CTASectionProps>(function CTASection(
  {
    title,
    description,
    eyebrow,
    actions,
    tone = 'inverse',
    align = 'center',
    size = 'md',
    width = 'lg',
    className,
    ...props
  },
  ref
) {
  return (
    <Section
      ref={ref}
      tone={tone}
      padding={sizePadding[size]}
      width={width}
      className={className}
      {...props}
    >
      <div
        className={cn(
          'flex flex-col gap-5',
          align === 'center' ? 'items-center text-center' : 'items-start text-left'
        )}
      >
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className={cn('max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg')}>
            {description}
          </p>
        )}
        {actions && (
          <div className={cn('mt-2 flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
            {actions}
          </div>
        )}
      </div>
    </Section>
  );
});
