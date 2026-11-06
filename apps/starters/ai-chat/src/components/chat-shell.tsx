'use client';

import * as React from 'react';
import {
  Attachment,
  Confirmation,
  Message,
  MessageActions,
  PromptInput,
  Reasoning,
  Response,
  Source,
  StreamingIndicator,
  ToolCall,
} from '@slipstream-ui/ai';
import { Badge, Button, Card, Separator } from '@slipstream-ui/core';
import { runChat } from '@/src/lib/chat/runner';
import { createFetchAdapter } from '@/src/lib/chat/sse-adapter';
import { createAssistantMessage, type ChatApproval, type ChatMessage } from '@/src/lib/chat/types';
import { createAnalytics } from '@/src/lib/analytics';
import { clearHistory, loadHistory, saveHistory } from '@/src/lib/history';

function AssistantActivity({ message, onApproval }: { message: ChatMessage; onApproval: (status: ChatApproval['status']) => void }) {
  const hasActivity = message.reasoning.length > 0 || message.tools.length > 0 || message.approval || message.citations.length > 0;
  if (!hasActivity) return null;

  return (
    <div className="space-y-3">
      {message.reasoning.length > 0 && (
        <Reasoning
          steps={[{ id: `${message.id}-reasoning`, content: message.reasoning }]}
          isStreaming={message.reasoningStreaming}
          defaultExpanded={false}
        />
      )}
      {message.tools.map((tool) => (
        <ToolCall key={tool.id} toolCall={tool} />
      ))}
      {message.approval && (
        <Confirmation
          title={message.approval.title}
          description={message.approval.description}
          toolName={message.approval.toolName}
          status={message.approval.status}
          onApprove={() => onApproval('approved')}
          onReject={() => onApproval('rejected')}
          showActions={message.approval.status === 'pending'}
        />
      )}
      {message.citations.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold">Sources</h3>
          <div className="mt-3 space-y-2">
            {message.citations.map((citation, index) => (
              <Source key={citation.id} source={citation} index={index + 1} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export function ChatShell() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const analytics = React.useMemo(() => createAnalytics(), []);
  const abortRef = React.useRef<AbortController | null>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = loadHistory(window.localStorage);
    if (saved.length > 0) setMessages(saved);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    saveHistory(window.localStorage, messages);
  }, [hydrated, messages]);

  const setApproval = React.useCallback((messageId: string, status: ChatApproval['status']) => {
    analytics.track(status === 'approved' ? 'approval_approve' : 'approval_reject', { approved: status === 'approved' });
    setMessages((previous) =>
      previous.map((message) =>
        message.id === messageId && message.approval ? { ...message, approval: { ...message.approval, status } } : message,
      ),
    );
  }, [analytics]);

  const send = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      const user: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        text: trimmed,
        reasoning: '',
        reasoningStreaming: false,
        tools: [],
        citations: [],
        status: 'complete',
      };
      const assistantId = crypto.randomUUID();
      const assistant = createAssistantMessage(assistantId);
      const history = [...messages, user];

      setMessages([...history, assistant]);
      setBusy(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;
      const adapter = createFetchAdapter('/api/chat');
      const startedAt = Date.now();
      analytics.track('chat_send', { messageCount: history.length });

      const final = await runChat(
        adapter,
        history,
        assistantId,
        (next) => setMessages((previous) => previous.map((message) => (message.id === assistantId ? next : message))),
        controller.signal,
      );

      setMessages((previous) => previous.map((message) => (message.id === assistantId ? final : message)));
      setBusy(false);
      abortRef.current = null;
      if (final.status === 'error' && final.error) {
        setError(final.error);
        analytics.track('chat_error', { durationMs: Date.now() - startedAt });
      } else {
        analytics.track('chat_complete', {
          durationMs: Date.now() - startedAt,
          toolCount: final.tools.length,
          citationCount: final.citations.length,
        });
      }
    },
    [analytics, busy, messages],
  );

  const stop = React.useCallback(() => {
    abortRef.current?.abort();
    analytics.track('chat_stop');
    setBusy(false);
  }, [analytics]);

  const reset = React.useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    setError(null);
    if (typeof window !== 'undefined') clearHistory(window.localStorage);
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Chat Starter</h1>
          <p className="text-sm text-muted-foreground">
            Streaming, reasoning, tool calls, approvals and citations. Bring your own backend.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">stateless</Badge>
          <a
            href="/buy"
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Buy licence
          </a>
          <Button variant="outline" onClick={reset} disabled={busy || messages.length === 0}>
            New chat
          </Button>
        </div>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex min-h-[60vh] flex-col rounded-xl border border-border bg-card">
          <div className="flex-1 space-y-6 overflow-y-auto p-4" aria-live="polite" aria-busy={busy}>
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
                <h2 className="text-lg font-semibold">Ask anything</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  The mock backend streams a complete response. Set <code>OPENAI_API_KEY</code> to use a real model.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <Message
                  message={{ id: message.id, role: message.role, content: message.text }}
                  isStreaming={message.status === 'streaming' && message.role === 'assistant'}
                  error={message.error}
                  renderContent={
                    message.role === 'assistant' ? (content) => <Response>{content}</Response> : undefined
                  }
                />
                {message.role === 'assistant' && (
                  <>
                    <AssistantActivity message={message} onApproval={(status) => setApproval(message.id, status)} />
                    {message.status === 'streaming' && <StreamingIndicator isStreaming text="Generating..." />}
                    {message.status === 'complete' && message.text.length > 0 && (
                      <MessageActions content={message.text} onFeedback={() => undefined} />
                    )}
                  </>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-3">
            {error && (
              <p role="alert" className="mb-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <PromptInput
              onSubmit={(value) => void send(value)}
              onStop={stop}
              isLoading={busy}
              placeholder="Ask the agent to build, search, or deploy..."
              autoFocus
            />
          </div>
        </section>

        <aside className="space-y-4">
          <Card className="p-4">
            <h2 className="text-sm font-semibold">Agent activity</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Reasoning, tool calls, approvals and citations from the latest response.
            </p>
            <Separator className="my-3" />
            {(() => {
              const latest = [...messages].reverse().find((message) => message.role === 'assistant');
              if (!latest) return <p className="text-sm text-muted-foreground">No activity yet.</p>;
              return (
                <div className="space-y-4">
                  {latest.approval && (
                    <div className="space-y-2">
                      <Confirmation
                        title={latest.approval.title}
                        description={latest.approval.description}
                        status={latest.approval.status}
                        showActions={false}
                      />
                      {latest.approval.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setApproval(latest.id, 'approved')}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setApproval(latest.id, 'rejected')}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {latest.tools.length === 0 && latest.reasoning.length === 0 && !latest.approval && (
                    <p className="text-sm text-muted-foreground">No activity yet.</p>
                  )}
                  {latest.tools.map((tool) => (
                    <ToolCall key={tool.id} toolCall={tool} showResult />
                  ))}
                  {latest.reasoning.length > 0 && (
                    <Reasoning
                      steps={[{ id: 'reasoning', content: latest.reasoning }]}
                      isStreaming={latest.reasoningStreaming}
                      defaultExpanded
                    />
                  )}
                  {latest.citations.map((citation, index) => (
                    <Source key={citation.id} source={citation} index={index + 1} />
                  ))}
                </div>
              );
            })()}
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold">Backend</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The client speaks one SSE protocol. The server chooses the backend.
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>
                <code className="text-foreground">CHAT_BACKEND=mock</code> — deterministic streamed response.
              </li>
              <li>
                <code className="text-foreground">CHAT_BACKEND=openai</code> — raw SSE via <code>OPENAI_API_KEY</code>.
              </li>
              <li>
                Point <code className="text-foreground">createFetchAdapter</code> at any endpoint that emits the same events.
              </li>
            </ul>
            <label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={analyticsEnabled}
                onChange={(event) => {
                  setAnalyticsEnabled(event.target.checked);
                  analytics.setEnabled(event.target.checked);
                }}
              />
              Share anonymous usage events (no message content, no identifiers).
            </label>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold">Attachments</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Attachment attachment={{ id: 'demo-1', name: 'spec.pdf', size: '2.4 MB', status: 'done' }} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              PromptInput manages its own attachment queue; wire uploads to your storage.
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}
