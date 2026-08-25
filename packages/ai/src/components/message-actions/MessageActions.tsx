import * as React from 'react';
import { cn } from '@slipstream-ui/core';

/** User sentiment for an AI response. */
export type FeedbackRating = 'up' | 'down';

export interface MessageActionsProps {
  /**
   * Content to copy. Omit to hide the copy action, or pass a getter when
   * the content lives outside this component.
   */
  content?: string;
  /** Called after the user copies the message; receives the copied text. */
  onCopy?: (content: string) => void;
  /** Called with the selected rating; selecting the same rating clears it (passes undefined). */
  onFeedback?: (rating: FeedbackRating | undefined) => void;
  /** Called when the user requests a regenerated response; omit to hide the action. */
  onRegenerate?: () => void;
  labels?: {
    copy?: string;
    copied?: string;
    thumbUp?: string;
    thumbDown?: string;
    regenerate?: string;
  };
  className?: string;
}

const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(
  (
    { content, onCopy, onFeedback, onRegenerate, labels, className, ...props },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [rating, setRating] = React.useState<FeedbackRating | undefined>();

    const t = {
      copy: labels?.copy ?? 'Copy',
      copied: labels?.copied ?? 'Copied',
      thumbUp: labels?.thumbUp ?? 'Good response',
      thumbDown: labels?.thumbDown ?? 'Bad response',
      regenerate: labels?.regenerate ?? 'Regenerate',
    };

    const handleCopy = async () => {
      if (!content) return;
      try {
        await navigator.clipboard.writeText(content);
      } catch {
        // Clipboard API may be unavailable (insecure context); still notify so consumers can react.
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      onCopy?.(content);
    };

    const handleRating = (next: FeedbackRating) => {
      const updated = rating === next ? undefined : next;
      setRating(updated);
      onFeedback?.(updated);
    };

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Message actions"
        className={cn('flex items-center gap-1 mt-2', className)}
        {...props}
      >
        {content !== undefined && (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? t.copied : t.copy}
          </button>
        )}

        <button
          type="button"
          onClick={() => handleRating('up')}
          aria-label={t.thumbUp}
          aria-pressed={rating === 'up'}
          className={cn(
            'rounded px-1.5 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            rating === 'up'
              ? 'text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          👍
        </button>

        <button
          type="button"
          onClick={() => handleRating('down')}
          aria-label={t.thumbDown}
          aria-pressed={rating === 'down'}
          className={cn(
            'rounded px-1.5 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            rating === 'down'
              ? 'text-destructive'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          👎
        </button>

        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t.regenerate}
          </button>
        )}
      </div>
    );
  }
);
MessageActions.displayName = 'MessageActions';

export { MessageActions };
