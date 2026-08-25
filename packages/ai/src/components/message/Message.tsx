'use client';

import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback, Button } from '@slipstream-ui/core';
import { cn } from '@slipstream-ui/core';
import type { Message as MessageType } from '../../types';

export interface MessageProps {
  message: MessageType;
  className?: string;
  showAvatar?: boolean;
  avatarSrc?: string;
  avatarFallback?: string;
  /** Display name for the user role; override for localization. */
  userLabel?: string;
  /** Display name for the assistant role; override for localization. */
  assistantLabel?: string;
  /**
   * Custom content renderer, e.g. for markdown/code blocks.
   * When provided, it fully replaces the default plain-text rendering.
   */
  renderContent?: (content: string) => React.ReactNode;
  /**
   * Marks the response as still being generated: shows a typing cursor
   * and sets aria-busy so assistive tech knows more content is coming.
   */
  isStreaming?: boolean;
  /** Generation failure text; renders an error card in place of content. */
  error?: string;
  /** Called when the user requests a retry after `error`; omit to hide the action. */
  onRetry?: () => void;
  labels?: {
    retry?: string;
    edit?: string;
    save?: string;
    cancel?: string;
  };
  /**
   * Edit-and-resubmit affordance for user messages: renders an Edit action
   * that swaps content into an inline textarea and calls `onEditContent`.
   */
  onEditContent?: (content: string) => void;
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      message,
      className,
      showAvatar = true,
      avatarSrc,
      avatarFallback,
      userLabel = 'You',
      assistantLabel = 'Assistant',
      renderContent,
      isStreaming = false,
      error,
      onRetry,
      onEditContent,
      labels,
      ...props
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(message.content);

    const t = {
      retry: labels?.retry ?? 'Retry',
      edit: labels?.edit ?? 'Edit',
      save: labels?.save ?? 'Save & resend',
      cancel: labels?.cancel ?? 'Cancel',
    };

    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const displayLabel = isUser
      ? userLabel
      : message.role === 'assistant'
        ? assistantLabel
        : message.role;

    const startEdit = () => {
      setDraft(message.content);
      setIsEditing(true);
    };

    const commitEdit = () => {
      const trimmed = draft.trim();
      if (!trimmed) return;
      setIsEditing(false);
      onEditContent?.(trimmed);
    };

    return (
      <div
        ref={ref}
        aria-busy={isStreaming || undefined}
        className={cn(
          'flex gap-3 p-4 rounded-lg',
          isUser ? 'bg-primary/10' : 'bg-muted',
          isSystem && 'border-l-4 border-muted-foreground',
          error && 'border border-destructive/40',
          className
        )}
        {...props}
      >
        {showAvatar && !isSystem && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={displayLabel} />}
            <AvatarFallback className={cn(
              'text-xs font-medium',
              isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}>
              {avatarFallback || (isUser ? 'U' : 'A')}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{displayLabel}</span>
            {message.timestamp && (
              <span className="text-xs text-muted-foreground">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>

          {error ? (
            <div role="alert" className="text-sm">
              <div className="text-destructive mb-2">{error}</div>
              {onRetry && (
                <Button size="sm" variant="outline" onClick={onRetry}>
                  ↻ {t.retry}
                </Button>
              )}
            </div>
          ) : isEditing ? (
            <div className="space-y-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    commitEdit();
                  }
                  if (event.key === 'Escape') setIsEditing(false);
                }}
                aria-label="Edit message"
                autoFocus
                rows={Math.min(6, draft.split('\n').length + 1)}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={commitEdit}>{t.save}</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>{t.cancel}</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap break-words">
              {renderContent ? (
                renderContent(message.content)
              ) : (
                <>
                  {message.content}
                  {isStreaming && (
                    <span
                      className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom bg-current animate-pulse motion-reduce:animate-none"
                      data-testid="streaming-cursor"
                    />
                  )}
                </>
              )}
              {onEditContent && !isStreaming && (
                <div>
                  <button
                    type="button"
                    onClick={startEdit}
                    aria-label={t.edit}
                    className="mt-1 rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    ✎ {t.edit}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Message.displayName = 'Message';

/**
 * Memoized: during token streaming the parent re-renders on every tick, but
 * only the streaming message's object identity changes. Memo skips re-render
 * (and timestamp re-formatting) for every other message in the transcript.
 * Callback props must be referentially stable for memo to help.
 */
const MemoizedMessage = React.memo(Message);
MemoizedMessage.displayName = 'Message';

export { MemoizedMessage as Message };
