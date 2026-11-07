import * as React from 'react';
import { cn } from '../../utils/cn';

export type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ContainerProps = React.HTMLAttributes<HTMLElement> & {
  /** Maximum content width. Default 'lg' (80rem / 1280px). */
  width?: ContainerWidth;
  /** Horizontal gutters. Default 'md'. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Semantic element (default 'div'). */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav';
};

const widthClasses: Record<ContainerWidth, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-none',
};

const paddingClasses = {
  none: '',
  sm: 'px-4',
  md: 'px-4 sm:px-6',
  lg: 'px-4 sm:px-6 lg:px-8',
} as const;

/**
 * Centered, width-constrained page container. Use it for page chrome,
 * marketing sections and any content that should share the same gutters and
 * maximum width instead of repeating `mx-auto max-w-* px-*` per page.
 */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(function Container(
  { width = 'lg', padding = 'md', as = 'div', className, ...props },
  ref
) {
  const Tag = as as 'div';

  return (
    <Tag
      ref={ref as never}
      className={cn('mx-auto w-full', widthClasses[width], paddingClasses[padding], className)}
      {...props}
    />
  );
});
