'use client';

import * as React from 'react';
import { cn } from '@slipstream-ui/core';
import type { ToolCall as ToolCallType } from '../../types';

export interface ToolCallProps {
  toolCall: ToolCallType;
  className?: string;
  showResult?: boolean;
}

const statusChipClasses: Record<ToolCallType['status'], string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  running: 'bg-info/10 text-info border-info/20',
  completed: 'bg-success/10 text-success border-success/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusLabels: Record<ToolCallType['status'], string> = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
};

/**
 * Displays a single tool invocation: name, status chip, serialized
 * arguments, optional result, and an error block on failure.
 */
const ToolCall = React.forwardRef<HTMLDivElement, ToolCallProps>(
  ({ toolCall, className, showResult = true, ...props }, ref) => {
    // Serialize once per tool-call change instead of on every render.
    const serializedArguments = React.useMemo(
      () => JSON.stringify(toolCall.arguments, null, 2),
      [toolCall.arguments]
    );
    const serializedResult = React.useMemo(() => {
      if (toolCall.result === undefined) return undefined;
      return typeof toolCall.result === 'string'
        ? toolCall.result
        : JSON.stringify(toolCall.result, null, 2);
    }, [toolCall.result]);

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
                statusChipClasses[toolCall.status]
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
              <code>{serializedArguments}</code>
            </pre>
          </div>

          {showResult && serializedResult !== undefined && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">Result</div>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                <code>{serializedResult}</code>
              </pre>
            </div>
          )}

          {toolCall.status === 'failed' && toolCall.error && (
            <div role="alert">
              <div className="text-xs font-medium text-destructive mb-1">Error</div>
              <pre className="text-xs bg-destructive/10 text-destructive p-2 rounded overflow-x-auto whitespace-pre-wrap">
                <code>{toolCall.error}</code>
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
