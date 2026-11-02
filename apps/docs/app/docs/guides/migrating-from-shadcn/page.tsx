import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'Migrating from shadcn to AI-ready components',
  description:
    'How Slipstream UI fits next to (or replaces) shadcn/ui: shadcn-compatible registry, stateless AI components, machine-readable manifests, and an MCP validator your coding agent can check against.',
};

export default function ShadcnMigrationGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        Migrating from shadcn + custom AI components
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        You do not have to choose. Slipstream uses the <strong className="text-foreground">same registry
        convention</strong> as shadcn, so the two coexist in one codebase — adopt Slipstream where AI
        surfaces need more than primitives, keep shadcn where it already works.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Why teams add Slipstream
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: 'Your agent reads a spec, not guesses',
            body: 'Every component ships a COMPONENT_MANIFEST; the MCP validate_usage tool checks generated JSX before it hits your diff. shadcn documents for humans only.',
          },
          {
            title: 'AI surfaces are already built',
            body: 'Conversation, PromptInput, streaming-safe Response, ToolCall, Confirmation, citations — the parts you would otherwise hand-roll per project.',
          },
          {
            title: 'Same install ergonomics',
            body: 'npx shadcn add works with Slipstream registry URLs — real source files in components/, yours to edit, exactly like shadcn.',
          },
          {
            title: 'Still stateless and accessible',
            body: 'No runtime lock-in, jest-axe on every component, dark mode through CSS variables — the standards you already hold shadcn to.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Strategy A — side-by-side (start here)</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Add Slipstream next to your existing shadcn components. Nothing is renamed or removed.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="bash"
          code={`# packages for your app code
pnpm add @slipstream-ui/core @slipstream-ui/ai

# or copy source into your components dir (shadcn-compatible)
npx shadcn@latest add https://slipstreamui.com/registry/conversation.json
npx shadcn@latest add https://slipstreamui.com/registry/prompt-input.json

# give your coding agent the spec
pnpm add -D @slipstream-ui/mcp-server`}
        />
      </div>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`// Before: shadcn primitives + your hand-rolled chat glue
// After: Slipstream owns the AI surface, shadcn keeps the rest
import { Conversation, PromptInput, Response } from '@slipstream-ui/ai';
import { Button } from '@/components/ui/button'; // still shadcn

export function Assistant() {
  /* your state */
}`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Strategy B — converge shared primitives</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Where a Slipstream primitive overlaps yours (Button, Input, Dialog…), you can either keep
        yours and map props, or copy the Slipstream source in and delete yours. The registry gives
        you the same source-copy workflow shadcn users expect — including the manifest JSON that
        travels with each component.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Strategy C — AI surfaces first</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Short on time? Ship only the AI-facing pieces —{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">Conversation</code>,{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">PromptInput</code>,{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">Response</code>,{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">MessageActions</code> — and revisit the rest
        later. Migration is per-component by design: there is no global swap step to get wrong.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">When to stay on shadcn alone</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        If your product has no generative surfaces and no agents writing UI, shadcn plus your own
        docs is a perfectly good system. Slipstream earns its place when code is generated by models
        or your UI is chat-shaped — that is where manifests, validation, and AI primitives pay off.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/docs/installation" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Installation paths</h3>
          <p className="mt-1 text-sm text-muted-foreground">Packages, CLI, or registry — all three explained.</p>
        </Link>
        <Link href="/docs/guides/agent-integration" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Agent integration</h3>
          <p className="mt-1 text-sm text-muted-foreground">Wire validate_usage into your coding agent.</p>
        </Link>
      </div>
    </div>
  );
}
