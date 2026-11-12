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
import { ThemeShowcase } from '@/components/theme-showcase';
import { LiveLab } from '@/components/site/live-lab';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from '@/lib/component-count';
import { VERSION } from '@/lib/version';
import { track } from '@/lib/analytics';
import type { HomeCopy } from '@/lib/marketing';

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

function LandingChatDemo({ copy }: { copy: HomeCopy }) {
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
        <span className="ml-3 text-xs text-muted-foreground">{copy.liveDemoNote}</span>
      </div>
      <div className="h-[340px]">
        <Conversation
          messages={messages}
          renderContent={(content) => (
            <Response parseIncompleteMarkdown>{content}</Response>
          )}
          streamingMessageId={streamingId ?? undefined}
          showScrollButton={false}
          welcomeTitle={copy.welcomeTitle}
          welcomeSuggestions={copy.welcomeSuggestions}
          onWelcomeSelect={handleSubmit}
        />
      </div>
      <div className="border-t border-border p-3">
        <PromptInput onSubmit={handleSubmit} placeholder={copy.promptPlaceholder} sendButtonText={copy.send} />
      </div>
    </div>
  );
}

function CopyInstallPill({ copy }: { copy: HomeCopy }) {
  const [copied, setCopied] = useState(false);
  async function copyCommand() {
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
      onClick={copyCommand}
      className="inline-flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-2.5 font-mono text-sm transition-colors hover:bg-accent"
    >
      <span>npx @slipstream-ui/cli@latest init</span>
      <span className="text-xs text-muted-foreground">{copied ? copy.copied : copy.copy}</span>
    </button>
  );
}

const AGENTS = ['Claude Code', 'Cursor', 'Copilot', 'Codex', 'Any MCP client'];

export default function LandingPage({ copy }: { copy: HomeCopy }) {
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
                v{VERSION} <span className="ml-1.5 text-primary">{copy.whatsNew}</span>
              </Link>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {copy.aiFirstBadge}
              </span>
              <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs font-medium">
                {copy.reactBadge}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              {copy.heroTitleLead}{' '}
              <span className="text-primary">{copy.heroTitleHighlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{copy.heroDescription}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/docs/installation"
                onClick={() => track('cta_click', { cta: 'get_started', location: 'hero' })}
              >
                <Button size="lg">{copy.getStarted}</Button>
              </Link>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('github_click', { location: 'hero' })}
              >
                <Button size="lg" variant="outline">{copy.starOnGithub}</Button>
              </a>
            </div>
            <div className="mt-6"><CopyInstallPill copy={copy} /></div>
          </div>
          <LandingChatDemo copy={copy} />
        </div>
      </section>

      {/* Agent strip */}
      <section className="border-b border-border bg-muted/30 py-6">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 text-sm text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">{copy.agentStripLabel}</span>
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
            { value: String(COMPONENT_COUNT), label: copy.stats[0] },
            { value: String(COMPONENT_COUNT), label: copy.stats[1] },
            { value: '5', label: copy.stats[2] },
            { value: '0', label: copy.stats[3] },
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
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight">{copy.featuresHeading}</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{copy.featuresIntro}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {copy.features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div aria-hidden="true" className="mb-3 font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works for agents */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight">{copy.howHeading}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">{copy.howIntro}</p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-3">
            {copy.steps.map(({ title, body }, index) => (
              <div key={title} className="relative rounded-xl border border-border bg-card p-6">
                <span className="absolute -top-3 left-6 rounded-full border border-primary/40 bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  {index + 1}
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
        <h2 className="text-center text-3xl font-bold tracking-tight">{copy.validatorHeading}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          {copy.validatorIntroBefore} <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">onSend</code>{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">validate_usage</code>{' '}
          {copy.validatorIntroAfter}
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-destructive/30 bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-destructive">{copy.validatorCards[0].title}</p>
            <CodeBlock
              language="tsx"
              showCopyButton={false}
              code={`<PromptInput
  onSend={handleSend}
  placeholder="Ask anything"
/>`}
            />
            <p className="mt-3 text-xs text-muted-foreground">{copy.validatorCards[0].note}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold">{copy.validatorCards[1].title}</p>
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
            <p className="mt-3 text-xs text-muted-foreground">{copy.validatorCards[1].note}</p>
          </div>
          <div className="rounded-xl border border-success/30 bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-success">{copy.validatorCards[2].title}</p>
            <CodeBlock
              language="tsx"
              showCopyButton={false}
              code={`<PromptInput
  onSubmit={handleSend}
  placeholder="Ask anything"
/>`}
            />
            <p className="mt-3 text-xs text-muted-foreground">{copy.validatorCards[2].note}</p>
          </div>
        </div>
      </section>

      {/* Theme showcase */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-20">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">{copy.themesHeading}</h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">{copy.themesIntro}</p>
          <ThemeShowcase />
        </div>
      </section>

      {/* Comparison */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight">{copy.comparisonHeading}</h2>
        <p className="mx-auto mb-10 mt-3 max-w-2xl text-center text-muted-foreground">{copy.comparisonIntro}</p>
        <div className="mx-auto max-w-5xl overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-medium">{copy.comparisonCapability}</th>
                <th className="p-3 text-center font-medium">Slipstream</th>
                <th className="p-3 text-center font-medium text-muted-foreground">shadcn/ui + AI Elements</th>
                <th className="p-3 text-center font-medium text-muted-foreground">assistant-ui</th>
                <th className="p-3 text-center font-medium text-muted-foreground">MUI</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, index) => (
                <tr key={row.capability} className="border-t border-border">
                  <td className="p-3">{copy.comparisonCapabilities[index] ?? row.capability}</td>
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
          {copy.comparisonFootnote}
        </p>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
          {copy.comparisonCards.map((card, index) => {
            const accent = index === 0;
            return (
              <div
                key={card.title}
                className={`rounded-xl border p-5 ${
                  accent ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <h3 className={`text-sm font-semibold ${accent ? 'text-primary' : 'text-foreground'}`}>
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Templates teaser */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{copy.templatesHeading}</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">{copy.templatesIntro}</p>
            </div>
            <Link href="/docs/templates" className="text-sm font-medium text-primary hover:underline">
              {copy.browseTemplates}
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {copy.templates.map((template) => (
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
            <h3 className="font-semibold group-hover:text-primary">{copy.agentPathTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.agentPathBody}</p>
          </Link>
          <Link
            href="/docs/guides/ai-chat-ui"
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <h3 className="font-semibold group-hover:text-primary">{copy.productPathTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.productPathBody}</p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.ctaHeading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {copy.ctaBody.replaceAll('{componentCount}', String(COMPONENT_COUNT))}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs/installation"
            onClick={() => track('cta_click', { cta: 'start_building', location: 'footer' })}
          >
            <Button size="lg">{copy.startBuilding}</Button>
          </Link>
          <CopyInstallPill copy={copy} />
        </div>
      </section>

      <Footer />
      <StickyCta />
    </main>
  );
}
