import * as React from 'react';
import { cn } from '@slipstream-ui/core';
import type { SourceItem } from '../../types';

export interface InlineCitationProps {
  /** The cited source; powers the hover/focus preview card. */
  source: SourceItem;
  /** Citation text to wrap (defaults to the source title). */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Perplexity-style inline citation: a superscript chip that reveals the
 * source snippet on hover or keyboard focus.
 */
const InlineCitation = React.forwardRef<HTMLSpanElement, InlineCitationProps>(
  ({ source, children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('group relative inline focus-within:outline-none', className)}
        {...props}
      >
        <button
          type="button"
          aria-describedby={`citation-${source.id}-card`}
          className="inline-flex items-baseline rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {children ?? <span>{source.title}</span>}
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center align-super ml-0.5 h-4 min-w-4 px-1 rounded-full border border-border bg-muted text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors"
          >
            {source.title.charAt(0).toUpperCase()}
          </span>
        </button>
        <span
          id={`citation-${source.id}-card`}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 w-64 rounded-md border border-border bg-popover p-2.5 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
        >
          <span className="block font-medium text-foreground truncate">{source.title}</span>
          {source.snippet && (
            <span className="mt-0.5 block text-muted-foreground line-clamp-3">
              {source.snippet}
            </span>
          )}
        </span>
      </span>
    );
  }
);
InlineCitation.displayName = 'InlineCitation';

export { InlineCitation };
