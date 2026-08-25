import * as React from 'react';
import { cn } from '@slipstream-ui/core';
import { Message } from '../message';
import type { Message as MessageType } from '../../types';

export interface ConversationProps {
  messages: MessageType[];
  className?: string;
  showAvatars?: boolean;
  userAvatarSrc?: string;
  userAvatarFallback?: string;
  assistantAvatarSrc?: string;
  assistantAvatarFallback?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  /** Custom content renderer applied to every message (e.g. markdown). */
  renderContent?: (content: string) => React.ReactNode;
  /** ID of the message still being generated; renders its streaming cursor. */
  streamingMessageId?: string;
}

/** Distance (px) from the bottom within which the view counts as "pinned". */
const PINNED_THRESHOLD = 80;

const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  ({
    messages,
    className,
    showAvatars = true,
    userAvatarSrc,
    userAvatarFallback,
    assistantAvatarSrc,
    assistantAvatarFallback,
    isLoading = false,
    loadingMessage = 'Thinking...',
    renderContent,
    streamingMessageId,
    ...props
  }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll only when the user is already near the bottom, so reading
    // history is never yanked. During streaming use instant scrolls; smooth
    // animations restarted per token cause jank.
    React.useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;

      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceFromBottom > PINNED_THRESHOLD) return;

      messagesEndRef.current?.scrollIntoView({
        behavior: streamingMessageId ? 'auto' : 'smooth',
      });
    }, [messages, streamingMessageId]);

    return (
      <div ref={ref} className={cn('h-full w-full', className)} {...props}>
        <div ref={scrollRef} className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              showAvatar={showAvatars}
              avatarSrc={
                message.role === 'user' ? userAvatarSrc : assistantAvatarSrc
              }
              avatarFallback={
                message.role === 'user' ? userAvatarFallback : assistantAvatarFallback
              }
              renderContent={renderContent}
              isStreaming={message.id === streamingMessageId}
            />
          ))}

          {isLoading && (
            <Message
              message={{
                id: '__loading__',
                role: 'assistant',
                content: loadingMessage,
              }}
              showAvatar={showAvatars}
              avatarSrc={assistantAvatarSrc}
              avatarFallback={assistantAvatarFallback}
              className="bg-muted/50"
              renderContent={(content) => (
                <span className="text-muted-foreground animate-pulse">{content}</span>
              )}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }
);
Conversation.displayName = 'Conversation';

export { Conversation };
