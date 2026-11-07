import * as React from 'react';
import { cn } from '../../utils/cn';
import { Container, type ContainerWidth } from '../container/Container';

export type SectionTone = 'default' | 'muted' | 'subtle' | 'brand' | 'inverse';

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Surface treatment. 'inverse' flips the token ladder for a dark band. */
  tone?: SectionTone;
  /** Vertical rhythm. Default 'md'. */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Inner container width. Default 'lg'. */
  width?: ContainerWidth;
  /** Wrap children in a centered Container (default true). */
  container?: boolean;
  /** Extra classes for the inner Container. */
  containerClassName?: string;
  /** Semantic element (default 'section'). */
  as?: 'section' | 'div' | 'article' | 'header' | 'footer' | 'main' | 'aside';
};

const toneClasses: Record<SectionTone, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted/40 text-foreground',
  subtle: 'bg-secondary/50 text-secondary-foreground',
  brand: 'bg-primary text-primary-foreground',
  inverse: 'bg-inverse text-inverse-foreground',
};

const paddingClasses = {
  none: '',
  sm: 'py-10 sm:py-12',
  md: 'py-14 sm:py-16',
  lg: 'py-16 sm:py-20 lg:py-24',
  xl: 'py-20 sm:py-28 lg:py-32',
} as const;

/**
 * Scope the semantic token ladder to an inverse band. Components inside the
 * Section (Card, Text, FormField, SectionHeading) read the scoped variables,
 * so a dark band does not require per-child color overrides.
 */
const inverseVars = {
  '--background': 'var(--inverse)',
  '--foreground': 'var(--inverse-foreground)',
  '--muted': 'var(--inverse-muted)',
  '--muted-foreground': 'var(--inverse-muted-foreground)',
  '--border': 'var(--inverse-border)',
  '--input': 'var(--inverse-border)',
  '--ring': 'var(--inverse-primary)',
  '--primary': 'var(--inverse-primary)',
  '--primary-foreground': 'var(--inverse-primary-foreground)',
  '--card': 'var(--inverse-card)',
  '--card-foreground': 'var(--inverse-card-foreground)',
  '--popover': 'var(--inverse-card)',
  '--popover-foreground': 'var(--inverse-card-foreground)',
  '--secondary': 'var(--inverse-muted)',
  '--secondary-foreground': 'var(--inverse-foreground)',
  '--accent': 'var(--inverse-muted)',
  '--accent-foreground': 'var(--inverse-foreground)',
} as React.CSSProperties;

const brandVars = {
  '--foreground': 'var(--primary-foreground)',
  '--muted-foreground': 'var(--primary-foreground)',
  '--border': 'var(--primary-foreground)',
  '--input': 'var(--primary-foreground)',
} as React.CSSProperties;

/**
 * Page section with a consistent vertical rhythm and surface tone. Section
 * owns the full-bleed band; Container owns the gutters. Use it instead of
 * repeating `py-*` and background classes on every marketing or content
 * section, and use `tone="inverse"` for a readable dark band.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(function Section(
  {
    tone = 'default',
    padding = 'md',
    width = 'lg',
    container = true,
    containerClassName,
    as = 'section',
    className,
    style,
    children,
    ...props
  },
  ref
) {
  const Tag = as as 'section';
  const toneStyle = tone === 'inverse' ? inverseVars : tone === 'brand' ? brandVars : undefined;

  return (
    <Tag
      ref={ref as never}
      data-tone={tone === 'default' ? undefined : tone}
      className={cn('w-full', toneClasses[tone], paddingClasses[padding], className)}
      style={{ ...toneStyle, ...style }}
      {...props}
    >
      {container ? (
        <Container width={width} className={containerClassName}>
          {children}
        </Container>
      ) : (
        children
      )}
    </Tag>
  );
});
