import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/guides/vercel-ai-sdk', {
  title: 'Vercel AI SDK integration',
  description:
    'Bridge the Vercel AI SDK useChat state into Slipstream Conversation, Message, and ToolCall with useSlipstreamMessages and useSlipstreamStream — no runtime lock-in.',
});

export default function VercelAiSdkGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        Vercel AI SDK integration
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Slipstream ships a runtime-independent adapter: give it the chat state your AI SDK (or any
        chat library) already produces, get back exactly the props{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">Conversation</code> wants.
        Your route handlers stay untouched — the adapter only reads state on the client.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        The adapter imports <strong className="text-foreground">no SDK code</strong> — it consumes a
        structural shape (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'{ id, role, content, toolInvocations }'}</code>,
        status strings, error). Anything producing that shape works: AI SDK <em>useChat</em>,{' '}
        <em>useCompletion</em>, LangGraph adapters, or your own store.
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">1. Install</h2>
      <div className="mt-4">
        <CodeBlock language="bash" code={`pnpm add @slipstream-ui/core @slipstream-ui/ai ai`} />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        2. Bridge the chat state
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Two hooks do the whole mapping: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">useSlipstreamMessages</code>{' '}
        converts the message list (including tool invocations →{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">ToolCall</code> data in
        metadata), and <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">useSlipstreamStream</code>{' '}
        turns status/error into <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">isLoading</code>,{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">streamingMessageId</code>, and
        per-message retryable errors.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`'use client';

import { useChat } from '@ai-sdk/react';
import { Conversation, MessageActions, ToolCall } from '@slipstream-ui/ai';
import {
  useSlipstreamMessages,
  useSlipstreamStream,
} from '@slipstream-ui/ai';

export function AiSdkChat() {
  const { messages, status, error, reload, sendMessage } = useChat({ api: '/api/chat' });

  const { messages: slipstreamMessages } = useSlipstreamMessages({ messages });
  const stream = useSlipstreamStream({ status, error, onRetry: reload, messages });

  return (
    <Conversation
      messages={slipstreamMessages}
      {...stream}
      renderContent={(content, message) => (
        <>
          {/* Tool invocations ride along in message metadata */}
          {message.metadata?.toolCalls?.map((call) => (
            <ToolCall key={call.id} toolCall={call} />
          ))}
          {content}
        </>
      )}
    />
  );
}`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        3. What the hooks return
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left font-medium">Hook</th>
              <th className="p-3 text-left font-medium">Returns</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="p-3 font-mono text-xs">useSlipstreamMessages</td>
              <td className="p-3 text-muted-foreground">
                <code className="font-mono text-xs">messages</code> — Slipstream Message[] with tool
                calls under <code className="font-mono text-xs">metadata.toolCalls</code>
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="p-3 font-mono text-xs">useSlipstreamStream</td>
              <td className="p-3 text-muted-foreground">
                <code className="font-mono text-xs">isLoading</code> (submitted/streaming),{' '}
                <code className="font-mono text-xs">streamingMessageId</code> (last assistant message
                while streaming), <code className="font-mono text-xs">messageErrors</code> +
                <code className="font-mono text-xs"> onRetryMessage</code> (status === 'error')
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        4. Tool invocations become ToolCalls
      </h2>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`// AI SDK invocation state -> Slipstream ToolCall status
'state: call'    -> status: 'pending'
'state: result'  -> status: 'completed' (+ result)
'state: error'   -> status: 'failed'    (+ error message)

// Pure functions if you want manual control:
import { toSlipstreamMessage, toSlipstreamToolCalls } from '@slipstream-ui/ai';`}
        />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/docs/guides/streaming" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Streaming fundamentals</h3>
          <p className="mt-1 text-sm text-muted-foreground">What the adapter abstracts — raw transports.</p>
        </Link>
        <Link href="/docs/guides/state-threads" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">State &amp; threads</h3>
          <p className="mt-1 text-sm text-muted-foreground">Where conversation state should live.</p>
        </Link>
      </div>
    </div>
  );
}
