import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/guides/state-threads', {
  title: 'State & threads',
  description:
    'Where conversation state should live with stateless Slipstream components: message shapes, persistence, history prepend, branching, and multi-thread structures.',
});

export default function StateThreadsGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        State &amp; threads
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Slipstream components are <strong className="text-foreground">stateless</strong>: they render
        the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">messages</code> you
        pass and emit actions through callbacks. Everything else — threads, persistence, optimistic
        updates — is your store. This guide is the recommended shape for that store.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">The message shape</h2>
      <div className="mt-4">
        <CodeBlock
          language="typescript"
          code={`type Message = {
  id: string;                    // stable — used as React key, streaming target, error map key
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;               // markdown is fine — Response renders it
  timestamp?: Date;
  metadata?: Record<string, unknown>;   // toolCalls, sources, branch info…
};`}
        />
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Never reuse ids — streaming, retry cards, and error maps all key off them.</li>
        <li>Put auxiliary data (tool calls, citations) in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">metadata</code>, not in content markup.</li>
        <li>Append optimistically for the user turn; replace-or-fill the assistant turn while streaming.</li>
      </ul>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Minimal store</h2>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
  streamingId?: string;
  errors?: Record<string, string>;   // messageId -> retryable failure
};

// One hook, plain state — swap for Zustand/Jotai/Redux/SWR freely.
function useThread(initial: Thread) {
  const [thread, setThread] = useState(initial);
  const patch = (id: string, content: string) =>
    setThread((t) => ({ ...t, messages: t.messages.map((m) => (m.id === id ? { ...m, content } : m)) }));
  const fail = (id: string, message: string) =>
    setThread((t) => ({ ...t, streamingId: undefined, errors: { ...t.errors, [id]: message } }));
  return { thread, setThread, patch, fail };
}`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Persistence</h2>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`// Save on idle, not per token: debounce the whole transcript.
useEffect(() => {
  const t = setTimeout(() => saveThread(thread.id, stripEphemeral(thread)), 800);
  return () => clearTimeout(t);
}, [thread]);

// Reload older pages WITHOUT shifting the reader:
function prependHistory(thread: Thread, older: Message[]): Thread {
  return { ...thread, messages: [...older, ...thread.messages] };
}
// Conversation keeps scroll anchoring stable when the top grows.`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Multi-thread structure</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Slipstream has no Thread component baked in — a thread list is just data next to the active
        thread. The pattern used by the{' '}
        <Link href="/docs/templates" className="font-medium text-primary underline underline-offset-2">templates</Link>:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`const [threads, setThreads] = useState<Thread[]>([]);   // sidebar list
const [activeId, setActiveId] = useState<string>();
const active = threads.find((t) => t.id === activeId);

// Only the ACTIVE thread streams; background threads stay frozen snapshots.
<ThreadList threads={threads} activeId={activeId} onSelect={setActiveId} />
<Conversation
  key={active!.id}                       // key resets scroll state per thread
  messages={active!.messages}
  streamingMessageId={active!.streamingId}
/>`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Branching</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Regeneration should <em>add</em> a variant, not overwrite. Store variants per message id and
        hand the active variant to the list —{' '}
        <Link href="/docs/components/branch" className="font-medium text-primary underline underline-offset-2">Branch</Link>{' '}
        renders the N/M navigator. Full recipe:{' '}
        <Link href="/docs/patterns#multi-branch" className="font-medium text-primary underline underline-offset-2">multi-branch conversations</Link>.
      </p>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Rules of thumb</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Components never fetch — your store owns transport and persistence.</li>
          <li>Serialize your own state; nothing Slipstream renders is required to round-trip.</li>
          <li>Stream into one id, fail into an error map keyed by the same id, retry by re-sending that id.</li>
        </ul>
      </div>
    </div>
  );
}
