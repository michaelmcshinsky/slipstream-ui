import * as React from 'react';
import { cn } from '@slipstream-ui/core';

export interface ChainThoughtStep {
  id: string;
  content: string;
  status?: 'pending' | 'completed' | 'failed';
}

export interface ChainThoughtProps {
  steps: ChainThoughtStep[];
  className?: string;
  compact?: boolean;
}

const ChainThought = React.forwardRef<HTMLDivElement, ChainThoughtProps>(
  ({ steps, className, compact = false, ...props }, ref) => {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-3 items-start">
          <div className={cn(
            'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
            step.status === 'completed' ? 'bg-green-500' : 
            step.status === 'failed' ? 'bg-red-500' : 
            step.status === 'pending' ? 'bg-yellow-500' : 'bg-primary'
          )} />
          <div className={cn('flex-1', compact && 'text-sm')}>
            <div className="text-sm text-muted-foreground">
              Step {index + 1}
            </div>
            <div className="text-foreground">{step.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
});
ChainThought.displayName = 'ChainThought';

export { ChainThought };
