import * as React from 'react';
import { cn } from '@slipstream-ui/core';

export type StreamingIndicatorProps = {
  isStreaming: boolean;
  className?: string;
  /** Label announced and rendered next to the dots. */
  text?: string;
  /** Dot scale. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Dot colour. Default 'primary'. */
  tone?: 'primary' | 'muted' | 'current';
  /** How many dots to pulse. Default 3. */
  dotCount?: number;
  /** Render the label beside the dots. Default true. */
  showLabel?: boolean;
};

/** Literal maps so the scanner keeps every size/tone utility. */
const DOT_SIZE = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-2.5 h-2.5' } as const;
const TEXT_SIZE = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' } as const;
const DOT_TONE = {
  primary: 'bg-primary',
  muted: 'bg-muted-foreground',
  current: 'bg-current',
} as const;

/**
 * Animated three-dot streaming indicator. Announces the streaming state
 * to screen readers via role="status" / aria-live so assistive tech
 * users know generation is in progress.
 */
const StreamingIndicator = React.forwardRef<HTMLDivElement, StreamingIndicatorProps>(
  (
    {
      isStreaming,
      className,
      text = 'Generating...',
      size = 'md',
      tone = 'primary',
      dotCount = 3,
      showLabel = true,
      ...props
    },
    ref
  ) => {
    if (!isStreaming) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={text}
        className={cn(
          'flex items-center gap-2 text-muted-foreground',
          TEXT_SIZE[size],
          className
        )}
        {...props}
      >
        <div className="flex gap-1" aria-hidden="true">
          {Array.from({ length: Math.max(1, dotCount) }, (_, index) => (
            <span
              key={index}
              className={cn(
                'rounded-full animate-pulse motion-reduce:animate-none',
                DOT_SIZE[size],
                DOT_TONE[tone]
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            />
          ))}
        </div>
        {showLabel && <span>{text}</span>}
      </div>
    );
  }
);
StreamingIndicator.displayName = 'StreamingIndicator';

export { StreamingIndicator };
