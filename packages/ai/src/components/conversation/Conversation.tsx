'use client';

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
  /**
   * Show a floating "scroll to latest" pill when the user has scrolled up.
   * Default true.
   */
  showScrollButton?: boolean;
  /** Show a download button that exports the transcript as Markdown. Default false. */
  showDownload?: boolean;
  /** Per-message generation failures keyed by message id; renders retry cards. */
  messageErrors?: Record<string, string>;
  /** Retry handler for failed messages in `messageErrors`. */
  onRetryMessage?: (message: MessageType) => void;

  // --- Empty state -------------------------------------------------------
  /** Heading for the empty-transcript welcome state. */
  welcomeTitle?: string;
  /** Supporting copy for the welcome state. */
  welcomeDescription?: string;
  /** Starter prompts rendered as buttons under the welcome copy. */
  welcomeSuggestions?: string[];
  /** Called with the chosen starter prompt text. */
  onWelcomeSelect?: (prompt: string) => void;

  // --- History pagination --------------------------------------------------
  /** Older history exists; renders a "load earlier" control at the top. */
  hasMoreHistory?: boolean;
  /** Older history request is in flight; shows a loading row. */
  isLoadingMore?: boolean;
  /** Called when the user requests older history. */
  onLoadMore?: () => void;
}

/** Distance (px) from the bottom within which the view counts as "pinned". */
const PINNED_THRESHOLD = 80;

const DEFAULT_WELCOME_TITLE = 'Start the conversation';
const DEFAULT_WELCOME_DESCRIPTION = 'Ask anything — responses stream in real time.';
const DEFAULT_WELCOME_SUGGESTIONS = [
  'Explain what you can do',
  'Summarize a topic for me',
];

function transcriptToMarkdown(messages: MessageType[]): string {
  return messages
    .map((message) => {
      const speaker =
        message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Assistant' : message.role;
      const time = message.timestamp ? ` (${new Date(message.timestamp).toISOString()})` : '';
      return `**${speaker}${time}:**\n\n${message.content}`;
    })
    .join('\n\n---\n\n');
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
    showScrollButton = true,
    showDownload = false,
    messageErrors,
    onRetryMessage,
    welcomeTitle = DEFAULT_WELCOME_TITLE,
    welcomeDescription = DEFAULT_WELCOME_DESCRIPTION,
    welcomeSuggestions = DEFAULT_WELCOME_SUGGESTIONS,
    onWelcomeSelect,
    hasMoreHistory = false,
    isLoadingMore = false,
    onLoadMore,
    ...props
  }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const [isUnpinned, setIsUnpinned] = React.useState(false);
    const prevScrollMetrics = React.useRef<{ height: number; top: number } | null>(null);

    // Announce stream completion to assistive tech: when the streaming id
    // transitions from set to unset, a response just finished.
    const [announcement, setAnnouncement] = React.useState('');
    const prevStreamingRef = React.useRef<string | undefined>(undefined);
    React.useEffect(() => {
      if (prevStreamingRef.current && !streamingMessageId) {
        setAnnouncement('Response complete.');
      }
      prevStreamingRef.current = streamingMessageId;
    }, [streamingMessageId]);

    // Track pinned state on scroll so the jump-to-latest pill can appear.
    React.useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;

      const updatePinned = () => {
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        setIsUnpinned(distanceFromBottom > PINNED_THRESHOLD);
      };

      updatePinned();
      container.addEventListener('scroll', updatePinned, { passive: true });
      return () => container.removeEventListener('scroll', updatePinned);
    }, []);

    // Scroll anchoring across history loads: capture metrics before new rows
    // render, then restore the same visual position after they land.
    React.useLayoutEffect(() => {
      const container = scrollRef.current;
      if (!container || prevScrollMetrics.current === null) return;

      const { height, top } = prevScrollMetrics.current;
      container.scrollTop = container.scrollHeight - height + top;
      prevScrollMetrics.current = null;
    }, [messages]);

    const captureAnchor = () => {
      const container = scrollRef.current;
      if (!container) return;
      prevScrollMetrics.current = { height: container.scrollHeight, top: container.scrollTop };
    };

    const handleLoadMore = () => {
      captureAnchor();
      onLoadMore?.();
    };

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

    const scrollToLatest = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDownload = () => {
      const blob = new Blob([transcriptToMarkdown(messages)], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'conversation.md';
      anchor.click();
      URL.revokeObjectURL(url);
    };

    const isEmpty = messages.length === 0 && !isLoading;

    return (
      <div ref={ref} className={cn('relative h-full w-full', className)} {...props}>
        <div ref={scrollRef} className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
          {(hasMoreHistory || isLoadingMore) && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="mx-auto rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {isLoadingMore ? 'Loading…' : 'Load earlier messages'}
            </button>
          )}

          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center py-16">
              <h3 className="text-lg font-semibold">{welcomeTitle}</h3>
              <p className="text-sm text-muted-foreground max-w-sm">{welcomeDescription}</p>
              {welcomeSuggestions.length > 0 && (
                <div className="mt-2 flex flex-col gap-2 w-full max-w-sm">
                  {welcomeSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => onWelcomeSelect?.(suggestion)}
                      className="rounded-md border border-border bg-background px-4 py-2.5 text-sm text-left text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
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
                error={messageErrors?.[message.id]}
                onRetry={
                  onRetryMessage && messageErrors?.[message.id]
                    ? () => onRetryMessage(message)
                    : undefined
                }
              />
            ))
          )}

          {isLoading && !isEmpty && (
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
                <span className="text-muted-foreground animate-pulse motion-reduce:animate-none">{content}</span>
              )}
            />
          )}

          {/* Screen-reader announcement when a streamed response completes. */}
          <div aria-live="polite" className="sr-only">{announcement}</div>

          <div ref={messagesEndRef} />
        </div>

        {showDownload && messages.length > 0 && (
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download transcript"
            className="absolute top-2 right-2 z-10 rounded-md border border-border bg-background/90 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ↓ .md
          </button>
        )}

        {showScrollButton && isUnpinned && (
          <button
            type="button"
            onClick={scrollToLatest}
            aria-label="Scroll to latest message"
            className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-border bg-background/95 px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ↓ Latest
          </button>
        )}
      </div>
    );
  }
);

Conversation.displayName = 'Conversation';

export { Conversation };
