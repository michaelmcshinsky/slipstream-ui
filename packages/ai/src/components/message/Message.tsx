import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@slipstream-ui/core';
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
      ...props
    },
    ref
  ) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const displayLabel = isUser
      ? userLabel
      : message.role === 'assistant'
        ? assistantLabel
        : message.role;

    return (
      <div
        ref={ref}
        aria-busy={isStreaming || undefined}
        className={cn(
          'flex gap-3 p-4 rounded-lg',
          isUser ? 'bg-primary/10' : 'bg-muted',
          isSystem && 'border-l-4 border-muted-foreground',
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
          <div className="text-sm whitespace-pre-wrap break-words">
            {renderContent ? (
              renderContent(message.content)
            ) : (
              <>
                {message.content}
                {isStreaming && (
                  <span
                    className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom bg-current animate-pulse"
                    data-testid="streaming-cursor"
                  />
                )}
              </>
            )}
          </div>
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
 */
const MemoizedMessage = React.memo(Message);
MemoizedMessage.displayName = 'Message';

export { MemoizedMessage as Message };
