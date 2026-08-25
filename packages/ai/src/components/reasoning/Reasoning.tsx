'use client';

import * as React from 'react';
import { cn } from '@slipstream-ui/core';
import type { ReasoningStep } from '../../types';

export interface ReasoningProps {
  steps: ReasoningStep[];
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const Reasoning = React.forwardRef<HTMLDivElement, ReasoningProps>(
  ({ steps, className, collapsible = true, defaultExpanded = false, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
    const contentId = React.useId();

    if (steps.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={cn('border-l-2 border-muted-foreground/30 pl-4', className)} {...props}>
        {collapsible ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={isExpanded}
            aria-controls={contentId}
          >
            <span className={cn('transition-transform', isExpanded ? 'rotate-90' : '')}>▶</span>
            <span>Reasoning ({steps.length} steps)</span>
          </button>
        ) : null}

        {(isExpanded || !collapsible) && (
          <div id={contentId} className="mt-3 space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary flex-shrink-0 mt-1" />
                <div className="text-sm flex-1">
                  <div className="font-medium text-foreground mb-1">Step {index + 1}</div>
                  <div className="text-muted-foreground">{step.content}</div>
                  {step.timestamp && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
Reasoning.displayName = 'Reasoning';

export { Reasoning };
