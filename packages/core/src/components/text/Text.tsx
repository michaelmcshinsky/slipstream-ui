import * as React from 'react';
import { cn } from '../../utils/cn';

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
} as const;

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

export type TextProps = React.HTMLAttributes<HTMLElement> & {
  /** Render as an inline <span> instead of a block <p> ("inline block" variation). */
  inline?: boolean;
  /** Type scale (default 'base'). */
  size?: keyof typeof sizeClasses;
  /** Font weight (default 'normal'). */
  weight?: keyof typeof weightClasses;
  /** Use the muted-foreground token instead of the primary text color. */
  muted?: boolean;
};

/**
 * Semantic paragraph text with a controlled type scale. Renders a real
 * <p> for document structure (or <span> with inline) — never a styled
 * div — so copy, screen readers, and reader-mode all treat it as text.
 */
const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ inline, size = 'base', weight, muted, className, ...props }, ref) => {
    const Tag = (inline ? 'span' : 'p') as 'span' | 'p';
    return (
      <Tag
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={cn(
          sizeClasses[size],
          weight && weightClasses[weight],
          muted && 'text-muted-foreground',
          inline ? 'inline' : 'block',
          className
        )}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text };
