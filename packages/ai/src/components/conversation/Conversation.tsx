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

    // Auto-scroll to bottom on new messages and during token streaming
    React.useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingMessageId]);

    return (
      <div ref={ref} className={cn('h-full w-full overflow-auto', className)} {...props}>
        <div ref={scrollRef} className="flex flex-col gap-4 p-4">
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
            <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
              {showAvatars && (
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                  {assistantAvatarFallback || 'A'}
                </div>
              )}
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">Assistant</div>
                <div className="text-sm text-muted-foreground animate-pulse">
                  {loadingMessage}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }
);
Conversation.displayName = 'Conversation';

export { Conversation };
