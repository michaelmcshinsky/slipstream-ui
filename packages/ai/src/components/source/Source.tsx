import * as React from 'react';
import { cn } from '@slipstream-ui/core';
import type { SourceItem } from '../../types';

export interface SourceProps {
  source: SourceItem;
  /**
   * 1-based citation marker rendered as a `[n]` prefix.
   * Omit to render the citation without numbering.
   */
  index?: number;
  className?: string;
}

const Source = React.forwardRef<HTMLDivElement, SourceProps>(
  ({ source, index, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex gap-2 items-start text-sm', className)} {...props}>
        {index !== undefined && (
          <span className="text-muted-foreground select-none" aria-hidden="true">
            [{index}]
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-foreground">
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {source.title}
              </a>
            ) : (
              <span>{source.title}</span>
            )}
          </div>
          {source.snippet && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {source.snippet}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Source.displayName = 'Source';

export { Source };
