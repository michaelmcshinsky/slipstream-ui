import * as React from 'react';
import { cn } from '../../utils/cn';

export type BlockElement =
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'figure'
  | 'header'
  | 'footer'
  | 'nav'
  | 'main'
  | 'aside';

export type BlockProps = React.HTMLAttributes<HTMLElement> & {
  /** Semantic element to render (default 'div'). */
  as?: BlockElement;
  /** Shorthand for as="span" — inline flow instead of a block box. */
  inline?: boolean;
  /** Use the muted-foreground token for the block's text. */
  muted?: boolean;
};

/**
 * Semantic container div — the structural counterpart to Text (p). Pick the
 * element that matches the content's meaning (section/article/figure…) and
 * use `inline` for span-level flow. No default styling beyond layout-safe
 * color tokens, so it composes with any Tailwind utilities.
 */
const Block = React.forwardRef<HTMLElement, BlockProps>(
  ({ as = 'div', inline, muted, className, ...props }, ref) => {
    const Tag = (inline ? 'span' : as) as BlockElement;
    return (
      <Tag
        ref={ref as never}
        className={cn(muted && 'text-muted-foreground', inline && 'inline', className)}
        {...props}
      />
    );
  }
);
Block.displayName = 'Block';

export { Block };
