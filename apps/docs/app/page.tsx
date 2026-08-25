'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Conversation,
  PromptInput,
  Response,

  type MessageData as MessageType,
} from '@slipstream-ui/ai';

const REPO_URL = 'https://github.com/slipstream-ui/slipstream-ui';

const DEMO_REPLY = `Slipstream UI ships **16 AI-native components**, each with a machine-readable \`COMPONENT_MANIFEST\`.

Your agent queries the manifest, reads the prop schema and anti-patterns, and generates correct UI on the first try — no source-diving, no hallucinated props.`;

function LandingChatDemo() {
  const [messages, setMessages] = useState<MessageType[]>([
    { id: '1', role: 'user', content: 'What makes Slipstream UI different?' },
  ]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleSubmit = (value: string) => {
    const userId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userId, role: 'user', content: value }]);

    const replyId = (Date.now() + 1).toString();
    const fullText = DEMO_REPLY;
    timers.current.push(
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: replyId, role: 'assistant', content: '' },
        ]);
        setStreamingId(replyId);

        let cursor = 0;
        const tick = () => {
          cursor += 6;
          if (cursor >= fullText.length) {
            setStreamingId(null);
            return;
          }
          const partial = fullText.slice(0, cursor);
          setMessages((prev) =>
            prev.map((m) => (m.id === replyId ? { ...m, content: partial } : m))
          );
          timers.current.push(setTimeout(tick, 24));
        };
        tick();
      }, 500)
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden text-left">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/50">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-muted-foreground">live demo — built entirely from Slipstream UI</span>
      </div>
      <div className="h-[340px]">
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
        <PromptInput onSubmit={handleSubmit} placeholder="Ask something..." />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">Slipstream UI</Link>
          <div className="flex items-center gap-6 text-sm">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">GitHub</a>
            <Link href="/docs/components" className="text-muted-foreground hover:text-foreground">Components</Link>
            <Link href="/docs/templates" className="text-muted-foreground hover:text-foreground">Templates</Link>
            <Link href="/docs" className="text-foreground hover:text-primary font-medium">Docs</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img src="https://img.shields.io/npm/v/@slipstream-ui/core.svg" alt="npm version" height="20" />
            <img src={`https://img.shields.io/github/stars/slipstream-ui/slipstream-ui.svg?style=social`} alt="GitHub stars" height="20" />
            <span className="text-xs px-2 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary font-medium">AI-first</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Your AI already knows your design system
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Every Slipstream UI component ships a machine-readable{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-base">COMPONENT_MANIFEST</code>.
            Claude, Cursor, and Copilot generate correct UI the first time — because they read
            the spec, not the source.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link href="/docs/installation" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium hover:bg-accent transition-colors">
              Star on GitHub
            </a>
          </div>
          <code className="inline-block bg-muted px-4 py-2.5 rounded-md text-sm font-mono">
            npx slipstream-ui@latest init
          </code>
        </div>
        <LandingChatDemo />
      </section>

      {/* Differentiator */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-10 text-center">The spec is the API</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-lg border border-destructive/40 p-6 bg-card">
              <h3 className="font-semibold text-destructive mb-4">❌ Without a manifest</h3>
              <p className="text-sm text-muted-foreground mb-3">Agents guess props from training data and hallucinate:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto"><code>{`<Message author role="bot"
  avatar animate />  // ❌ invented`}</code></pre>
            </div>
            <div className="rounded-lg border border-green-500/40 p-6 bg-card">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-4">✅ With COMPONENT_MANIFEST</h3>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto"><code>{`{
  "id": "message",
  "props": [{ "name": "message",
    "type": "Message", "required": true }],
  "antiPatterns": [...],
  "accessibility": [...]
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-4 text-center">How it compares</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Other libraries document for humans. Slipstream documents for both of you.
        </p>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Capability</th>
                <th className="text-center p-3">Slipstream</th>
                <th className="text-center p-3">shadcn / AI Elements</th>
                <th className="text-center p-3">assistant-ui</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Machine-readable component specs', '✅ Built-in', '❌', '❌'],
                ['MCP server for agents', '✅ 3 tools', '❌', '❌'],
                ['llms.txt surface', '✅', '❌', '❌'],
                ['jest-axe tested components', '✅ All', '🟡 Partial', '✅'],
                ['Stateless (bring your own state)', '✅', '✅', '❌ runtime lock-in'],
                ['Copy-paste registry install', '🟡 Coming', '✅', '✅'],
              ].map(([capability, slipstream, shadcn, assistantUi]) => (
                <tr key={capability} className="border-t border-border">
                  <td className="p-3">{capability}</td>
                  <td className="p-3 text-center">{slipstream}</td>
                  <td className="p-3 text-center text-muted-foreground">{shadcn}</td>
                  <td className="p-3 text-center text-muted-foreground">{assistantUi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How it works for agents */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-10 text-center">How your AI uses it</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Connect', body: 'Point Claude Desktop or Cursor at the Slipstream MCP server, or serve llms.txt.' },
              { step: '2', title: 'Query', body: 'The agent calls get_component_manifest and get_usage_examples for the components it needs.' },
              { step: '3', title: 'Generate', body: 'Correct props, correct composition, accessibility handled — on the first attempt.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{step}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ship AI interfaces faster</h2>
        <p className="text-muted-foreground mb-8">16 components. 21 manifests. Zero hallucinated props.</p>
        <Link href="/docs/installation" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Start building
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Slipstream UI · MIT License</span>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-foreground">Docs</Link>
            <Link href="/changelog" className="hover:text-foreground">Changelog</Link>
            <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">License</a>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
            <a href="/registry/all.json" className="hover:text-foreground">Registry</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
