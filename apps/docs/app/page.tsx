'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@slipstream-ui/core';
import {
  Conversation,
  PromptInput,
  Response,
  type MessageData as MessageType,
} from '@slipstream-ui/ai';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { ThemeShowcase } from '@/components/theme-showcase';

const REPO_URL = 'https://github.com/slipstream-ui/slipstream-ui';

const DEMO_REPLY = `Slipstream UI ships **21 AI-native components**, each with a machine-readable \`COMPONENT_MANIFEST\`.

Your agent queries the manifest via MCP, reads the prop schema and anti-patterns — then validates its own output before emitting code. Correct UI on the first try.`;

function LandingChatDemo() {
  const [messages, setMessages] = useState<MessageType[]>([
    { id: '1', role: 'user', content: 'What makes Slipstream UI different?' },
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
          cursor += 6;
          if (cursor >= DEMO_REPLY.length) {
            setStreamingId(null);
            return;
          }
          const partial = DEMO_REPLY.slice(0, cursor);
          setMessages((prev) =>
            prev.map((message) => (message.id === replyId ? { ...message, content: partial } : message))
          );
          timers.current.push(setTimeout(tick, 24));
        };
        tick();
      }, 500)
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
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
          welcomeTitle="Ask about Slipstream"
          welcomeSuggestions={['What makes it different?', 'How does the manifest work?']}
          onWelcomeSelect={handleSubmit}
        />
      </div>
      <div className="border-t border-border p-3">
        <PromptInput onSubmit={handleSubmit} placeholder="Try me…" sendButtonText="Send" />
      </div>
    </div>
  );
}

function CopyInstallPill() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText('npx slipstream-ui@latest init');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable.
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-2.5 font-mono text-sm transition-colors hover:bg-accent"
      aria-label="Copy init command"
    >
      <span>npx slipstream-ui@latest init</span>
      <span className="text-xs text-muted-foreground">{copied ? '✓ copied' : 'copy'}</span>
    </button>
  );
}

const FEATURES = [
  {
    icon: '📋',
    title: 'Machine-readable manifests',
    body: 'Every component ships a COMPONENT_MANIFEST: exact prop schema, defaults, anti-patterns, accessibility requirements, composition rules.',
  },
  {
    icon: '🛡',
    title: 'validate_usage MCP tool',
    body: 'Agents validate generated JSX against the manifest before emitting — hallucinated props and missing requireds are caught, not shipped.',
  },
  {
    icon: '📦',
    title: 'shadcn-compatible registry',
    body: 'Install real source files through any shadcn-compatible CLI, or use packages. Your codebase, your rules.',
  },
  {
    icon: '🧩',
    title: 'Fully stateless',
    body: 'No runtime lock-in. Bring any backend — Vercel AI SDK, LangGraph, or raw streams. Components render; you own state.',
  },
  {
    icon: '♿',
    title: 'Accessibility, tested',
    body: 'jest-axe suites on every component, aria-busy streaming states, polite completion announcements, reduced-motion variants.',
  },
  {
    icon: '🎨',
    title: 'Themeable to the token',
    body: 'One createTheme() call emits every CSS variable. Multi-token radius, dark mode, instant switching — no rebuilds.',
  },
];

const AGENTS = ['Claude Code', 'Cursor', 'Copilot', 'Codex', 'Any MCP client'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]"
        />
        <div className="container relative mx-auto grid items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {/* Tiny external badge; not an LCP element, so the img-optimization cost isn't warranted. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.shields.io/npm/v/@slipstream-ui/core.svg" alt="npm version" height="20" />
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                AI-first · MIT
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              Your AI already knows{' '}
              <span className="text-primary">your design system</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Slipstream UI is the component library built for AI-assisted development. Every
              component ships a machine-readable spec, an MCP server that serves it, and a
              validator that keeps agents honest.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/docs/installation">
                <Button size="lg">Get Started</Button>
              </Link>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">Star on GitHub</Button>
              </a>
            </div>
            <div className="mt-6"><CopyInstallPill /></div>
          </div>
          <LandingChatDemo />
        </div>
      </section>

      {/* Agent strip */}
      <section className="border-b border-border bg-muted/30 py-6">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 text-sm text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Speaks fluently to</span>
          {AGENTS.map((agent) => (
            <span key={agent} className="font-medium">{agent}</span>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="container mx-auto px-4 py-14">
        <dl className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {[
            { value: '21', label: 'components' },
            { value: '21', label: 'machine-readable specs' },
            { value: '167', label: 'tests incl. jest-axe' },
            { value: '0', label: 'hallucinated props allowed' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
              <dt className="order-last mt-1 text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="text-3xl font-bold tracking-tight text-primary">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Feature bento */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight">
          Built for the way software is written now
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Half your UI is written by models. Slipstream gives them something better than docs
          scraped from training data: a spec they can query, and a guardrail they can self-check against.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div aria-hidden="true" className="mb-3 text-2xl">{feature.icon}</div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works for agents */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight">How your AI uses it</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Three steps, no fine-tuning, no prompt incantations.
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Connect',
                body: 'Point Claude Code or Cursor at the Slipstream MCP server, or serve llms.txt and the /llm markdown routes.',
              },
              {
                step: '2',
                title: 'Query the spec',
                body: 'The agent calls get_component_manifest and get_usage_examples — exact props, defaults, anti-patterns.',
              },
              {
                step: '3',
                title: 'Self-validate',
                body: 'Before emitting, validate_usage checks the generated JSX against the manifest and corrects hallucinated props.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="relative rounded-xl border border-border bg-card p-6">
                <span className="absolute -top-3 left-6 rounded-full border border-primary/40 bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  {step}
                </span>
                <h3 className="mb-2 mt-1 font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme showcase */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-20">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">Themes that ship with the library</h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Default, Violet, and Zinc presets included. Switch below — this is live theming, not a screenshot.
          </p>
          <ThemeShowcase />
        </div>
      </section>

      {/* Comparison */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight">How it compares</h2>
        <p className="mx-auto mb-10 mt-3 max-w-2xl text-center text-muted-foreground">
          Other libraries document for humans. Slipstream documents for both of you.
        </p>
        <div className="mx-auto max-w-3xl overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-medium">Capability</th>
                <th className="p-3 text-center font-medium">Slipstream</th>
                <th className="p-3 text-center font-medium text-muted-foreground">shadcn / AI Elements</th>
                <th className="p-3 text-center font-medium text-muted-foreground">assistant-ui</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Machine-readable component specs', '✅ Built-in', '❌', '❌'],
                ['Usage-validation MCP tool', '✅ validate_usage', '❌', '❌'],
                ['llms.txt + canonical .md routes', '✅', '🟡 llms.txt only', '✅ .md routes'],
                ['shadcn-compatible registry', '✅', '✅ native', '✅'],
                ['jest-axe tested components', '✅ All', '🟡 Partial', '✅'],
                ['Stateless (bring your own state)', '✅', '✅', '❌ runtime lock-in'],
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

      {/* Templates teaser */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Start from a template</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Complete, copy-paste patterns built entirely from Slipstream components.
              </p>
            </div>
            <Link href="/docs/templates" className="text-sm font-medium text-primary hover:underline">
              Browse all templates →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { name: 'Streaming chat', body: 'Markdown responses, stop-generation, scroll pinning, feedback actions.' },
              { name: 'Agent dashboard', body: 'Tool calls with human-in-the-loop approval, reasoning steps, task progress.' },
              { name: 'RAG citations', body: 'Grounded answers with inline citation chips and a sources footer.' },
            ].map((template) => (
              <Link
                key={template.name}
                href="/docs/templates"
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <h3 className="mb-2 font-semibold group-hover:text-primary">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ship AI interfaces faster</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          21 components · 21 machine-readable specs · zero hallucinated props.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/docs/installation">
            <Button size="lg">Start building</Button>
          </Link>
          <CopyInstallPill />
        </div>
      </section>

      <Footer />
    </div>
  );
}
