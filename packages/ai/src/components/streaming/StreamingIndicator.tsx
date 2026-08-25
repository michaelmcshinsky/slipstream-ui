import * as React from 'react';
import { cn } from '@slipstream-ui/core';

export interface StreamingIndicatorProps {
  isStreaming: boolean;
  className?: string;
  text?: string;
}

const StreamingIndicator = React.forwardRef<HTMLDivElement, StreamingIndicatorProps>(
  ({ isStreaming, className, text = 'Generating...', ...props }, ref) => {
  if (!isStreaming) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
      {...props}
    >
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{text}</span>
    </div>
  );
});
StreamingIndicator.displayName = 'StreamingIndicator';

export { StreamingIndicator };
