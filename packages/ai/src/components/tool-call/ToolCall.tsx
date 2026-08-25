import * as React from 'react';
import { cn } from '@slipstream-ui/core';
import type { ToolCall as ToolCallType } from '../../types';

export interface ToolCallProps {
  toolCall: ToolCallType;
  className?: string;
  showResult?: boolean;
}

const ToolCall = React.forwardRef<HTMLDivElement, ToolCallProps>(
  ({ toolCall, className, showResult = true, ...props }, ref) => {
    const statusColors = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      running: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const statusLabels = {
      pending: 'Pending',
      running: 'Running',
      completed: 'Completed',
      failed: 'Failed',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'border rounded-lg p-4 bg-muted/30',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{toolCall.name}</span>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full border',
                statusColors[toolCall.status]
              )}
            >
              {statusLabels[toolCall.status]}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{toolCall.id}</span>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Arguments</div>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              <code>{JSON.stringify(toolCall.arguments, null, 2)}</code>
            </pre>
          </div>

          {showResult && toolCall.result !== undefined && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">Result</div>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                <code>
                  {typeof toolCall.result === 'string'
                    ? toolCall.result
                    : JSON.stringify(toolCall.result, null, 2)}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ToolCall.displayName = 'ToolCall';

export { ToolCall };
