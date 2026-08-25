import * as React from 'react';
import { cn } from '@slipstream-ui/core';
import type { SourceItem } from '../../types';
import { Source } from './Source';

export interface SourcesProps {
  sources: SourceItem[];
  className?: string;
  maxDisplay?: number;
  /** Heading label; override for localization. */
  label?: string;
}

const Sources = React.forwardRef<HTMLDivElement, SourcesProps>(
  ({ sources, className, maxDisplay = 3, label = 'Sources', ...props }, ref) => {
    const displaySources = maxDisplay ? sources.slice(0, maxDisplay) : sources;
    const hasMore = maxDisplay && sources.length > maxDisplay;

    if (sources.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={cn('mt-4 pt-4 border-t border-border', className)} {...props}>
        <div className="text-xs font-medium text-muted-foreground mb-2">{label}</div>
        <div className="space-y-2">
          {displaySources.map((source, index) => (
            <Source key={source.id} source={source} index={index + 1} />
          ))}
          {hasMore && (
            <div className="text-xs text-muted-foreground">
              +{sources.length - (maxDisplay ?? 0)} more sources
            </div>
          )}
        </div>
      </div>
    );
  }
);
Sources.displayName = 'Sources';

export { Sources };
