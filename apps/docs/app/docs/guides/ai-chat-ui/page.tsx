import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'React AI chat UI guide',
  description:
    'Build a production React AI chat interface with Slipstream UI: streaming markdown, stop-generation, feedback actions, and accessible messages — stateless components, your backend.',
};

export default function AiChatUiGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        Build a React AI chat UI
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        A walkthrough of the production chat surface: message state, token streaming, markdown that
        survives partial tokens, an input with stop-generation, and feedback actions. Slipstream
        components are stateless — you own the transport, they render.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/docs/templates" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          Copy-paste template →
        </Link>
        <Link href="/docs/patterns" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          All recipes →
        </Link>
        <Link href="/docs/components/conversation" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          Conversation API →
        </Link>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">1. Install</h2>
      <div className="mt-4">
        <CodeBlock language="bash" code={`pnpm add @slipstream-ui/core @slipstream-ui/ai
# or copy source files
npx shadcn@latest add https://slipstreamui.com/registry/conversation.json`} />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        2. Own two pieces of state
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        The entire surface is driven by <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">messages</code>{' '}
        and an optional <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">streamingMessageId</code>. No context
        providers, no runtime lock-in — works with Vercel AI SDK, LangGraph, WebSockets, or a raw
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"> fetch</code> stream.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`const [messages, setMessages] = useState<MessageData[]>([]);
const [streamingId, setStreamingId] = useState<string | null>(null);`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">3. Stream tokens as they arrive</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Append the assistant message, set it as streaming, and update its content on every chunk.
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"> Response</code> repairs half-finished markdown
        mid-stream, so a chunk ending in <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">**half</code> renders
        cleanly instead of showing raw asterisks.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`async function send(text: string) {
  const replyId = crypto.randomUUID();
  setMessages((prev) => [
    ...prev,
    { id: crypto.randomUUID(), role: 'user', content: text },
    { id: replyId, role: 'assistant', content: '' },
  ]);
  setStreamingId(replyId);

  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt: text }),
    signal: controller.signal,          // kept for stop-generation
  });
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let content = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    content += decoder.decode(value, { stream: true });
    setMessages((prev) =>
      prev.map((m) => (m.id === replyId ? { ...m, content } : m))
    );
  }
  setStreamingId(null);
}`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">4. Compose the surface</h2>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`<Conversation
  messages={messages}
  streamingMessageId={streamingId ?? undefined}
  renderContent={(content) => <Response parseIncompleteMarkdown>{content}</Response>}
  welcomeTitle="Ask anything"
  welcomeSuggestions={['Summarize this thread', 'Draft a reply']}
  onWelcomeSelect={send}
/>
<PromptInput
  onSubmit={send}
  isLoading={streamingId !== null}
  onStop={() => controller.abort()}
/>`}
        />
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          <Link href="/docs/components/conversation" className="text-primary hover:underline">Conversation</Link> pins
          scroll to the latest message and exposes a scroll-to-latest pill, transcript download, and welcome state.
        </li>
        <li>
          <Link href="/docs/components/prompt-input" className="text-primary hover:underline">PromptInput</Link> handles
          Enter-to-send, Shift+Enter, auto-resize, attachments, and flips to a Stop button while loading.
        </li>
        <li>
          <Link href="/docs/components/message-actions" className="text-primary hover:underline">MessageActions</Link>{' '}
          adds copy, thumbs up/down, and regenerate under the latest assistant message.
        </li>
      </ul>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">5. Accessibility is built in</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Streaming sets <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">aria-busy</code> and announces completion politely.</li>
        <li>Every component passes jest-axe suites; keyboard navigation works end-to-end.</li>
        <li>Reduced-motion variants respect <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">prefers-reduced-motion</code>.</li>
        <li>Empty transcripts render a configurable welcome state instead of a blank box.</li>
      </ul>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Next steps</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link href="/docs/templates" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Streaming chat template</h3>
          <p className="mt-1 text-sm text-muted-foreground">The full ~80-line pattern with a live demo.</p>
        </Link>
        <Link href="/docs/patterns" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">More recipes</h3>
          <p className="mt-1 text-sm text-muted-foreground">Tool calls, RAG citations, approvals, branches.</p>
        </Link>
      </div>
    </div>
  );
}
