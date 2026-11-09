import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'Streaming fundamentals',
  description:
    'Transport-agnostic streaming for AI chat UIs: fetch readers, abort handling, partial-markdown repair, scroll anchoring, and the backpressure details that make streams feel instant.',
};

export default function StreamingGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        Streaming fundamentals
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Slipstream components consume a stream-agnostic contract: a growing{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">content</code> string and
        an optional <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">streamingMessageId</code>.
        Whether the bytes come from SSE, WebSockets, or LangGraph, the UI side is identical.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">The one contract</h2>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`// While streaming, exactly one message updates on every chunk:
setMessages((prev) =>
  prev.map((m) => (m.id === replyId ? { ...m, content } : m))
));
setStreamingId(replyId);   // drives the typing cursor + aria-busy

// When done:
setStreamingId(null);      // cursor stops, completion is announced`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Reading a fetch stream
      </h2>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`async function* streamText(url: string, body: unknown, signal: AbortSignal) {
  const res = await fetch(url, { method: 'POST', body: JSON.stringify(body), signal });
  if (!res.ok || !res.body) throw new Error('Stream failed: ' + res.status);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE lines: "data: {...}" — split on newlines, keep the tail.
    const lines = buffer.split('\\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const payload = line.replace(/^data:\\s*/, '');
      if (payload && payload !== '[DONE]') yield JSON.parse(payload).delta as string;
    }
  }
}`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Abort and stop-generation
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Keep the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">AbortController</code>{' '}
        in a ref — PromptInput&apos;s stop button just calls it. Abort is not an error: stop writing
        and leave the partial text in place (users expect their stop to keep what arrived).
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`const abortRef = useRef<AbortController | null>(null);

async function send(text: string) {
  const controller = new AbortController();
  abortRef.current = controller;
  try {
    for await (const delta of streamText('/api/chat', { text }, controller.signal)) {
      appendDelta(delta);
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;   // user pressed Stop
    setMessageError(replyId, (err as Error).message);   // render retry card
  } finally {
    setStreamingId(null);
  }
}

<PromptInput onSubmit={send} isLoading={streamingId !== null}
  onStop={() => abortRef.current?.abort()} />`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Partial markdown renders cleanly
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Streams cut mid-token: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">**half</code>,
        unclosed code fences, dangling tables.{' '}
        <Link href="/docs/components/response" className="font-medium text-primary underline underline-offset-2">Response</Link>{' '}
        repairs those on every render (<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">parseIncompleteMarkdown</code>,
        on by default) — never show raw asterisks while streaming.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Scroll anchoring rules
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          <Link href="/docs/components/conversation" className="text-primary underline underline-offset-2">Conversation</Link>{' '}
          auto-scrolls only while you are near the bottom — reading history is never yanked mid-stream.
        </li>
        <li>During streaming scrolls are instant (per-token smooth animations jank); user-triggered jumps are smooth.</li>
        <li>The scroll-to-latest pill scrolls the container only — never the page.</li>
        <li>History prepend (loading older messages) keeps your anchor position stable.</li>
      </ul>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Performance notes</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Batch state updates (requestAnimationFrame or a 30–60ms timer) when your transport emits
          sub-frame chunks — one setState per token will melt large transcripts.
        </li>
        <li>
          Keep deltas as strings; parse markdown lazily per message, not the whole transcript on
          every chunk.
        </li>
        <li>
          Drop <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">response.body</code> readers
          on abort — holding them keeps the connection open.
        </li>
      </ul>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Next</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/docs/guides/ai-chat-ui" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">Full chat walkthrough</Link>
          <Link href="/docs/guides/vercel-ai-sdk" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">AI SDK adapter</Link>
          <Link href="/docs/components/response" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">Response</Link>
        </div>
      </div>
    </div>
  );
}
