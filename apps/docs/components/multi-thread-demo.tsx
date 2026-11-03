'use client';

import { useRef, useState } from 'react';
import {
  Conversation,
  MessageActions,
  PromptInput,
  Response,
  type MessageData,
} from '@slipstream-ui/ai';

interface Thread {
  id: string;
  title: string;
  messages: MessageData[];
  streamingId?: string | null;
}

const SEED: Thread[] = [
  {
    id: 't1',
    title: 'Draft release notes',
    messages: [{ id: 'm1', role: 'user', content: 'Draft release notes for 0.1.0' }],
  },
  {
    id: 't2',
    title: 'RAG citation UX',
    messages: [{ id: 'm2', role: 'assistant', content: 'Inline chips + a numbered sources footer is the pattern we settled on.' }],
  },
  {
    id: 't3',
    title: 'Refactor: prompt input',
    messages: [],
  },
];

const REPLIES = [
  'Thread-scoped reply — only the ACTIVE thread streams; background threads stay frozen snapshots.',
  'State lives in your store: threads[], activeId. Components just render the active one.',
  'Switch threads mid-stream and back: the streaming id travels with its own thread.',
];

/**
 * Live demo of the multi-thread pattern: a thread list beside the active
 * conversation, fake token streaming, and the Conversation key-reset that
 * keeps scroll state per thread.
 */
export function MultiThreadDemo() {
  const [threads, setThreads] = useState<Thread[]>(SEED);
  const [activeId, setActiveId] = useState('t1');
  const [turn, setTurn] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  const patchThread = (id: string, patch: Partial<Thread>) =>
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  function send(text: string) {
    const userId = Date.now().toString();
    const replyId = `${userId}-a`;
    const threadId = active.id;
    patchThread(threadId, {
      messages: [...active.messages, { id: userId, role: 'user', content: text }],
    });

    timers.current.push(
      setTimeout(() => {
        patchThread(threadId, {
          messages: [
            ...threads.find((t) => t.id === threadId)!.messages,
            { id: replyId, role: 'assistant', content: '' },
          ],
          streamingId: replyId,
        });
        const full = REPLIES[turn % REPLIES.length];
        setTurn((n) => n + 1);
        let cursor = 0;
        const tick = () => {
          cursor += 5;
          const current = threads.find((t) => t.id === threadId)!;
          if (cursor >= full.length) {
            patchThread(threadId, { streamingId: null });
            return;
          }
          patchThread(threadId, {
            messages: current.messages.map((m) =>
              m.id === replyId ? { ...m, content: full.slice(0, cursor) } : m
            ),
          });
          timers.current.push(setTimeout(tick, 24));
        };
        tick();
      }, 350)
    );
  }

  function newThread() {
    const id = `t${Date.now()}`;
    setThreads((prev) => [{ id, title: 'New conversation', messages: [] }, ...prev]);
    setActiveId(id);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-muted-foreground">multi-thread pattern — threads[] + activeId</span>
      </div>
      <div className="flex h-[340px]">
        <div className="w-40 shrink-0 space-y-1 border-r border-border p-2">
          <button
            type="button"
            onClick={newThread}
            className="w-full rounded-md border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            + New chat
          </button>
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveId(thread.id)}
              className={`block w-full truncate rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                thread.id === active.id
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {thread.title}
              {thread.streamingId && <span className="ml-1 animate-pulse">●</span>}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1">
            {/* key resets scroll state whenever the active thread changes */}
            <Conversation
              key={active.id}
              messages={active.messages}
              streamingMessageId={active.streamingId ?? undefined}
              renderContent={(content) => <Response parseIncompleteMarkdown>{content}</Response>}
              showScrollButton={false}
              welcomeTitle="New conversation"
              welcomeSuggestions={['Draft release notes', 'Explain this pattern']}
              onWelcomeSelect={send}
            />
          </div>
          <div className="border-t border-border p-2">
            {active.messages.at(-1)?.role === 'assistant' && !active.streamingId && (
              <div className="px-1 pb-1">
                <MessageActions
                  content={active.messages.at(-1)!.content}
                  onRegenerate={() => send('Regenerate')}
                />
              </div>
            )}
            <PromptInput onSubmit={send} isLoading={Boolean(active.streamingId)} placeholder="Message this thread…" />
          </div>
        </div>
      </div>
    </div>
  );
}
