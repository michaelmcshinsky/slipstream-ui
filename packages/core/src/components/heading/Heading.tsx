import * as React from 'react';
import { cn } from '../../utils/cn';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const levelClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-base',
};

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl',
  '3xl': 'text-5xl',
} as const;

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  /** Semantic level — renders the matching h1..h6 element. */
  level: HeadingLevel;
  /** Visual size override, independent of the semantic level. */
  size?: keyof typeof sizeClasses;
  /** Use the muted-foreground token instead of the primary text color. */
  muted?: boolean;
};

/**
 * Semantic heading with a safe default scale. Keep `level` correct for
 * document outline (h1 once per page, no skipped levels) and use `size`
 * when the visual weight must differ from the structural level.
 */
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, size, muted, className, ...props }, ref) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    return (
      <Tag
        ref={ref}
        className={cn(
          'font-semibold tracking-tight',
          size ? sizeClasses[size] : levelClasses[level],
          muted && 'text-muted-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

export { Heading };
