'use client';

import { useRef, useState } from 'react';
import {
  Conversation,
  MessageActions,
  PromptInput,
  Response,
  type MessageData,
} from '@slipstream-ui/ai';

const DEMO_REPLY = `Here's the **streaming chat** pattern in action:

- \`Response\` renders markdown token-by-token
- \`parseIncompleteMarkdown\` repairs half-finished syntax mid-stream
- \`MessageActions\` appears under the latest assistant message
- \`PromptInput\` handles submit + stop`;

/**
 * Live demo of the Streaming Chat template: simulated token-by-token
 * streaming so the pattern is interactive without a backend.
 */
export function StreamingChatDemo() {
  const [messages, setMessages] = useState<MessageData[]>([
    { id: '1', role: 'user', content: 'Show me the streaming chat pattern' },
  ]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function handleSubmit(value: string) {
    const userId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userId, role: 'user', content: value }]);

    const replyId = `${Date.now()}-a`;
    timers.current.push(
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: replyId, role: 'assistant', content: '' }]);
        setStreamingId(replyId);

        let cursor = 0;
        const tick = () => {
          cursor += 5;
          if (cursor >= DEMO_REPLY.length) {
            setStreamingId(null);
            return;
          }
          const partial = DEMO_REPLY.slice(0, cursor);
          setMessages((prev) =>
            prev.map((m) => (m.id === replyId ? { ...m, content: partial } : m))
          );
          timers.current.push(setTimeout(tick, 20));
        };
        tick();
      }, 400)
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-[320px]">
        <Conversation
          messages={messages}
          renderContent={(content) => (
            <Response parseIncompleteMarkdown>{content}</Response>
          )}
          streamingMessageId={streamingId ?? undefined}
          showScrollButton={false}
        />
      </div>
      <div className="border-t border-border p-3">
        {messages.at(-1)?.role === 'assistant' && streamingId === null && (
          <div className="px-1 pb-2">
            <MessageActions
              content={messages.at(-1)!.content}
              onFeedback={(rating) => console.log('feedback', rating)}
              onRegenerate={() => handleSubmit('Regenerate')}
            />
          </div>
        )}
        <PromptInput
          onSubmit={handleSubmit}
          isLoading={streamingId !== null}
          onStop={() => {
            timers.current.forEach(clearTimeout);
            setStreamingId(null);
          }}
          placeholder="Try the pattern…"
        />
      </div>
    </div>
  );
}
