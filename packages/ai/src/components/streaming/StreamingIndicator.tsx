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
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 bg-primary rounded-full animate-pulse motion-reduce:animate-none"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      <span>{text}</span>
    </div>
  );
});
StreamingIndicator.displayName = 'StreamingIndicator';

export { StreamingIndicator };
