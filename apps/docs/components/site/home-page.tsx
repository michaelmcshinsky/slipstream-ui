'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@slipstream-ui/core';
import {
  CodeBlock,
  Conversation,
  PromptInput,
  Response,
  type MessageData as MessageType,
} from '@slipstream-ui/ai';
import { Navbar } from '@/components/site/navbar';
import { StickyCta } from '@/components/site/sticky-cta';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';
import { GitHubStars } from '@/components/site/github-stars';
import { ThemeShowcase } from '@/components/theme-showcase';
import { LiveLab } from '@/components/site/live-lab';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from '@/lib/component-count';
import { VERSION } from '@/lib/version';
import { track } from '@/lib/analytics';

const REPO_URL = 'https://github.com/michaelmcshinsky/slipstream-ui';

const DEMO_REPLY = `Slipstream UI ships **${COMPONENT_COUNT} production-ready components** (${CORE_COMPONENT_COUNT} core + ${AI_COMPONENT_COUNT} AI), each with a machine-readable \`COMPONENT_MANIFEST\`.

The live lab on this page runs the real library: DataTable selection + pagination, MetricCard, SelectMenu, InputGroup, ButtonGroup, ConfirmDialog, Drawer, imperative toasts and the Stepper.

Your agent queries the same manifests over MCP, reads the prop schema and anti-patterns — then validates its own output before emitting code. Correct UI on the first try.`;

/**
 * Facts below reflect each project's public documentation and published
 * packages as checked in November 2026. Key: ✅ provided · 🟡 partial or a
 * different model · — not provided for this purpose.
 */
const COMPARISON: {
  capability: string;
  slipstream: string;
  shadcn: string;
  assistantUi: string;
  mui: string;
}[] = [
  { capability: 'Distribution model', slipstream: 'npm packages (ESM + CJS)', shadcn: 'copy-in source via CLI', assistantUi: 'npm packages', mui: 'npm packages' },
  { capability: 'Components shipped', slipstream: `${COMPONENT_COUNT} (${CORE_COMPONENT_COUNT} UI + ${AI_COMPONENT_COUNT} AI)`, shadcn: 'UI primitives + AI Elements', assistantUi: 'Chat surface + primitives', mui: 'Broad UI set, no chat' },
  { capability: 'Per-component machine-readable spec', slipstream: 'Yes — props, a11y, anti-patterns', shadcn: 'Partial — registry.json (files, deps)', assistantUi: 'No', mui: 'No' },
  { capability: 'MCP server', slipstream: 'Yes — 5 tools incl. validate_usage', shadcn: 'Partial — browse/search/install', assistantUi: 'No', mui: 'Partial — agent skills' },
  { capability: 'Validates generated JSX against the spec', slipstream: 'Yes — validate_usage', shadcn: 'No', assistantUi: 'No', mui: 'No' },
  { capability: 'llms.txt', slipstream: 'Yes', shadcn: 'Yes', assistantUi: 'Yes', mui: 'No' },
  { capability: 'Canonical markdown per component/page', slipstream: 'Yes — /llm/*.md', shadcn: 'Partial — MDX in repo', assistantUi: 'Yes — .md pages', mui: 'No' },
  { capability: 'AI chat components', slipstream: `Yes — ${AI_COMPONENT_COUNT} built-in`, shadcn: 'Yes — AI Elements (separate)', assistantUi: 'Yes — core focus', mui: 'No' },
  { capability: 'State & transport', slipstream: 'Stateless — bring your own', shadcn: 'Components only', assistantUi: 'Runtime adapters (AI SDK, LangGraph, custom)', mui: 'n/a — no chat components' },
  { capability: 'Styling', slipstream: 'Tailwind + CSS variables', shadcn: 'Tailwind + CSS variables', assistantUi: 'Tailwind', mui: 'Emotion + theme object' },
  { capability: 'Theme presets', slipstream: '4 (Default, Dark, Violet, Zinc)', shadcn: 'CSS-variable themes', assistantUi: 'CSS variables', mui: 'theme object' },
  { capability: 'Peer dependencies', slipstream: 'react, react-dom', shadcn: 'react', assistantUi: 'react', mui: 'react, @emotion/react, @emotion/styled' },
  { capability: 'License', slipstream: 'MIT', shadcn: 'MIT', assistantUi: 'MIT', mui: 'MIT' },
];

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
      await navigator.clipboard.writeText('npx @slipstream-ui/cli@latest init');
      track('install_copy', { command: 'init', location: 'home' });
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
    >
      <span>npx @slipstream-ui/cli@latest init</span>
      <span className="text-xs text-muted-foreground">{copied ? 'copied' : 'copy'}</span>
    </button>
  );
}

const FEATURES = [
  { index: '01', title: 'Machine-readable manifests', body: 'Every component ships a COMPONENT_MANIFEST: exact prop schema, defaults, anti-patterns, accessibility requirements, composition rules.' },
  { index: '02', title: 'validate_usage MCP tool', body: 'Agents validate generated JSX against the manifest before emitting — hallucinated props and missing requireds can be caught, not shipped.' },
  { index: '03', title: 'shadcn-compatible registry', body: 'Install real source files through any shadcn-compatible CLI, or use packages. Your codebase, your rules.' },
  { index: '04', title: 'Fully stateless', body: 'No runtime lock-in. Bring any backend — Vercel AI SDK, LangGraph, or raw streams. Components render; you own state.' },
  { index: '05', title: 'Accessibility, tested', body: 'jest-axe suites on every component, aria-busy streaming states, polite completion announcements, reduced-motion variants.' },
  { index: '06', title: 'Themeable to the token', body: 'One createTheme() call emits every CSS variable. Radius, dark mode, instant switching — no rebuilds.' },
];

const AGENTS = ['Claude Code', 'Cursor', 'Copilot', 'Codex', 'Any MCP client'];

export default function LandingPage() {
  return (
    <main id="main" className="min-h-screen bg-background">
      <Navbar />
      {/* Docs links live in the navbar only from md up; below that the pills
          row keeps marketing pages navigable on phones. The px-4 wrapper
          absorbs the bar's -mx-4 bleed so no viewport overflow appears. */}
      <div className="px-4">
        <MobileNav />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]"
        />
        <div className="container relative mx-auto grid items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Link
                href="/changelog"
                title={`See what's new in v${VERSION}`}
                className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs font-medium transition-colors hover:border-primary/40"
              >
                v{VERSION} <span className="ml-1.5 text-primary">what&apos;s new →</span>
              </Link>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                AI-first · MIT
              </span>
              <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs font-medium">
                React 18+
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              Your AI already knows{' '}
              <span className="text-primary">your design system</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Slipstream UI is the AI-first component system built for AI-assisted development. Every
              component ships a machine-readable spec, an MCP server that serves it, and a
              validator that keeps agents honest.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/docs/installation"
                onClick={() => track('cta_click', { cta: 'get_started', location: 'hero' })}
              >
                <Button size="lg">Get Started</Button>
              </Link>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('github_click', { location: 'hero' })}
              >
                <Button size="lg" variant="outline">Star on GitHub</Button>
              </a>
            </div>
            <div className="mt-6"><CopyInstallPill /></div>
            <div className="mt-4"><GitHubStars /></div>
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

      <LiveLab />

      {/* Stats band */}
      <section className="container mx-auto px-4 py-14">
        <dl className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {[
            { value: String(COMPONENT_COUNT), label: 'components' },
            { value: String(COMPONENT_COUNT), label: 'machine-readable specs' },
            { value: '5', label: 'MCP tools for agents' },
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
              <div aria-hidden="true" className="mb-3 font-mono text-sm text-muted-foreground">{feature.index}</div>
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

      {/* What the validator actually catches - real manifest, real output. */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight">The failure mode, caught</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          An agent guesses <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onSend</code> because that
          is what other chat libraries call it. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">validate_usage</code>{' '}
          checks the manifest and refuses the snippet before it is written.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-destructive/30 bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-destructive">1. Hallucinated usage</p>
            <CodeBlock
              language="tsx"
              showCopyButton={false}
              code={`<PromptInput
  onSend={handleSend}
  placeholder="Ask anything"
/>`}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              The prop does not exist, and the required <code className="font-mono">onSubmit</code> is missing.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold">2. validate_usage response</p>
            <CodeBlock
              language="json"
              showCopyButton={false}
              code={`{
  "componentId": "prompt-input",
  "valid": false,
  "usageCount": 1,
  "issues": [
    {
      "severity": "error",
      "message": "Unknown prop \\"onSend\\" on <PromptInput> (usage). This prop does not exist in the manifest."
    },
    {
      "severity": "error",
      "message": "Missing required prop(s) on <PromptInput> (usage): \\"onSubmit\\"."
    }
  ]
}`}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Trimmed for display; the tool also returns the manifest&apos;s anti-patterns.
            </p>
          </div>
          <div className="rounded-xl border border-success/30 bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-success">3. Correct usage</p>
            <CodeBlock
              language="tsx"
              showCopyButton={false}
              code={`<PromptInput
  onSubmit={handleSend}
  placeholder="Ask anything"
/>`}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Validated against the same contract your docs, MCP server, and registry serve.
            </p>
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
        <div className="mx-auto max-w-5xl overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-medium">Capability</th>
                <th className="p-3 text-center font-medium">Slipstream</th>
                <th className="p-3 text-center font-medium text-muted-foreground">shadcn/ui + AI Elements</th>
                <th className="p-3 text-center font-medium text-muted-foreground">assistant-ui</th>
                <th className="p-3 text-center font-medium text-muted-foreground">MUI</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.capability} className="border-t border-border">
                  <td className="p-3">{row.capability}</td>
                  <td className="p-3 text-center">{row.slipstream}</td>
                  <td className="p-3 text-center text-muted-foreground">{row.shadcn}</td>
                  <td className="p-3 text-center text-muted-foreground">{row.assistantUi}</td>
                  <td className="p-3 text-center text-muted-foreground">{row.mui}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-muted-foreground">
          Reflects each project&apos;s public documentation and published packages as of November 2026 ·
          ✅ provided · 🟡 partial or a different model · — not provided for this purpose
        </p>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Choose Slipstream',
              body: 'When agents must generate correct, design-system-compliant code and you want a validator in the loop before code ships.',
              accent: true,
            },
            {
              title: 'Choose shadcn/ui + AI Elements',
              body: 'When maximum ecosystem gravity and copy-in ownership of a very large primitive base matter most.',
            },
            {
              title: 'Choose assistant-ui',
              body: 'When you need a battle-tested chat runtime: streaming, tools, and generative UI as the core product.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`rounded-xl border p-5 ${
                card.accent ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'
              }`}
            >
              <h3 className={`text-sm font-semibold ${card.accent ? 'text-primary' : 'text-foreground'}`}>
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </div>
          ))}
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

      {/* Paths */}
      <section className="container mx-auto px-4 pb-6 pt-4">
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/docs/guides/agent-integration"
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <h3 className="font-semibold group-hover:text-primary">For agent builders →</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Wire the MCP server into Claude Code or Cursor, run{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">validate_usage</code> before emit, or
              serve llms.txt and markdown routes — five tools, three consumption paths.
            </p>
          </Link>
          <Link
            href="/docs/guides/ai-chat-ui"
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <h3 className="font-semibold group-hover:text-primary">For product teams →</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ship the production chat surface — streaming markdown, stop-generation, citations,
              approvals — with stateless components, jest-axe coverage, and your own backend.
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ship AI interfaces faster</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {COMPONENT_COUNT} components · {COMPONENT_COUNT} machine-readable specs · validate generated usage before it ships.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs/installation"
            onClick={() => track('cta_click', { cta: 'start_building', location: 'footer' })}
          >
            <Button size="lg">Start building</Button>
          </Link>
          <CopyInstallPill />
        </div>
      </section>

      <Footer />
      <StickyCta />
    </main>
  );
}
