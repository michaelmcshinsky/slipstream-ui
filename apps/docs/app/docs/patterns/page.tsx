import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'Patterns',
  description:
    'Full recipes for AI product surfaces built with Slipstream UI: streaming chat, tool-calling UI, RAG citations, human-in-the-loop approval, and multi-branch conversations.',
};

type Recipe = {
  id: string;
  title: string;
  description: string;
  components: string[];
  code: string;
};

const recipes: Recipe[] = [
  {
    id: 'streaming-chat',
    title: 'Streaming chat',
    description:
      'The baseline assistant surface: stream markdown tokens as they arrive, repair incomplete syntax mid-stream, stop generation on demand, and pin the viewport to the latest message. Wire the `send` body to any transport — fetch SSE, Vercel AI SDK, or a raw ReadableStream.',
    components: ['Conversation', 'Response', 'PromptInput', 'MessageActions'],
    code: `const [messages, setMessages] = useState<Message[]>([]);
const [streamingId, setStreamingId] = useState<string | null>(null);

async function send(text: string) {
  const id = crypto.randomUUID();
  setMessages((prev) => [...prev, { id, role: 'user', content: text }]);

  const replyId = crypto.randomUUID();
  setMessages((prev) => [...prev, { id: replyId, role: 'assistant', content: '' }]);
  setStreamingId(replyId);

  // Any transport that yields text chunks.
  const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ prompt: text }) });
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let content = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    content += decoder.decode(value, { stream: true });
    setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content } : m)));
  }
  setStreamingId(null);
}

<Conversation
  messages={messages}
  streamingMessageId={streamingId ?? undefined}
  renderContent={(content) => <Response parseIncompleteMarkdown>{content}</Response>}
/>
<PromptInput onSubmit={send} isLoading={streamingId !== null} onStop={() => controller.abort()} />`,
  },
  {
    id: 'tool-calling',
    title: 'Tool-calling UI',
    description:
      'Render the agent\'s tool lifecycle — pending → running → success/error — with arguments and results inspectable. Failures stay inline with a retry affordance instead of collapsing the transcript.',
    components: ['ToolCall', 'Reasoning', 'ChainThought'],
    code: `<ToolCall
  toolCall={{
    id: call.id,
    name: 'search_files',
    status: 'running',           // 'pending' | 'running' | 'success' | 'error'
    arguments: { query: '*.tsx', directory: 'src' },
  }}
/>

{/* Failed calls keep the args visible and surface the error */}
<ToolCall
  toolCall={{
    id: failed.id,
    name: 'read_file',
    status: 'error',
    arguments: { path: 'src/missing.ts' },
    result: 'ENOENT: no such file',
  }}
/>

{/* Pair with a collapsible reasoning panel for longer tasks */}
<Reasoning steps={[{ id: '1', content: 'Locate candidate files' }, { id: '2', content: 'Read and rank' }]} />`,
  },
  {
    id: 'rag-citations',
    title: 'RAG citations',
    description:
      'Ground answers in retrieved context: inline citation chips inside the markdown, a numbered sources footer, and follow-up suggestions. Your retriever emits `{{citation:N}}` markers; resolve them to InlineCitation chips at render time.',
    components: ['Response', 'InlineCitation', 'Sources', 'Suggestions'],
    code: `import { InlineCitation, Response, Sources, Suggestions } from '@slipstream-ui/ai';

// The model answers with {{citation:N}} markers; resolve them as the text renders.
function GroundedAnswer({ answer, sources, followUps }) {
  const parts = answer.split(/\\{\\{citation:(\\d+)\\}\\}/);
  return (
    <>
      <Response parseIncompleteMarkdown>
        {parts.map((part, i) => {
          const source = sources[Number(part) - 1];
          return i % 2 === 1 && source ? <InlineCitation key={i} source={source} /> : part;
        }).join('')}
      </Response>
      <Sources sources={sources} maxDisplay={3} />
      <Suggestions suggestions={followUps} />
    </>
  );
}`,
  },
  {
    id: 'human-in-the-loop',
    title: 'Human-in-the-loop approval',
    description:
      'Pause destructive or outward-facing tool calls behind an explicit approval gate. While pending, Confirmation renders as an alertdialog so screen readers announce the decision point; approve to resume, reject to unwind.',
    components: ['Confirmation', 'ToolCall', 'MessageActions'],
    code: `const [approved, setApproved] = useState(false);

{toolCall.name === 'delete_files' && !approved ? (
  <Confirmation
    title="Delete all files in /tmp?"
    description="This affects 14 files and cannot be undone."
    toolName={toolCall.name}
    onApprove={() => setApproved(true)}
    onReject={() => onCancel(toolCall.id)}
  />
) : (
  <ToolCall toolCall={toolCall} />
)}`,
  },
  {
    id: 'multi-branch',
    title: 'Multi-branch conversations',
    description:
      'When a generation can be regenerated into alternatives, keep every variant and let the user navigate them. Each message id carries its branch list; Branch renders prev/next arrows with an N/M indicator in the toolbar.',
    components: ['Branch', 'Conversation', 'MessageActions'],
    code: `// Regenerating stores a new variant instead of replacing the message.
function regenerate(messageId: string) {
  const variants = branches[messageId] ?? [messages.find((m) => m.id === messageId)!];
  const next = variants.length + 1;
  setBranches({ ...branches, [messageId]: [...variants, { ...variants[0], id: crypto.randomUUID() }] });
  return next;
}

// Render the navigator only for messages that actually branch.
{branchCount > 1 && (
  <Branch
    current={branchIndex}
    total={branchCount}
    onPrev={() => showVariant(messageId, branchIndex - 1)}
    onNext={() => showVariant(messageId, branchIndex + 1)}
  />
)}`,
  },
];

const COMPONENT_LINKS: Record<string, string> = {
  Conversation: '/docs/components/conversation',
  Response: '/docs/components/response',
  PromptInput: '/docs/components/prompt-input',
  MessageActions: '/docs/components/message-actions',
  ToolCall: '/docs/components/tool-call',
  Reasoning: '/docs/components/reasoning',
  ChainThought: '/docs/components/chain-thought',
  InlineCitation: '/docs/components/inline-citation',
  Sources: '/docs/components/sources',
  Suggestions: '/docs/components/suggestions',
  Confirmation: '/docs/components/confirmation',
  Message: '/docs/components/message',
  Branch: '/docs/components/branch',
};

export default function PatternsPage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">Patterns</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Full recipes for the surfaces AI products actually ship. Every one is stateless — you own
        the transport and the state. Prefer a complete copy-paste app? Start from the{' '}
        <Link href="/docs/templates" className="font-medium text-primary hover:underline">
          templates
        </Link>
        .
      </p>

      <div className="mt-10 space-y-14">
        {recipes.map((recipe) => (
          <section key={recipe.id} id={recipe.id} className="scroll-m-20">
            <h2 className="text-2xl font-semibold tracking-tight">{recipe.title}</h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
              {recipe.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {recipe.components.map((name) =>
                COMPONENT_LINKS[name] ? (
                  <Link
                    key={name}
                    href={COMPONENT_LINKS[name]}
                    className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {name}
                  </Link>
                ) : (
                  <span
                    key={name}
                    className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    {name}
                  </span>
                )
              )}
            </div>
            <div className="mt-4">
              <CodeBlock language="tsx" code={recipe.code} />
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Bring your own backend</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          None of these recipes import a model SDK. Swap the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">fetch</code>{' '}
          call for Vercel AI SDK's <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">useChat</code>, a LangGraph stream, or
          WebSocket frames — the components only consume <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">messages</code> and{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">streamingMessageId</code>. See{' '}
          <Link href="/docs/components/conversation" className="font-medium text-primary hover:underline">
            Conversation
          </Link>{' '}
          for the full prop contract.
        </p>
      </div>
    </div>
  );
}
