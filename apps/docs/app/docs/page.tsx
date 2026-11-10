import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from '@/lib/component-count';
import { VERSION } from '@/lib/version';
import { PackageLink } from '@/components/package-link';

export const metadata: Metadata = {
  title: 'Documentation',
  description: `Slipstream UI documentation: the AI-first React component library where every one of ${COMPONENT_COUNT} components ships a machine-readable COMPONENT_MANIFEST, an MCP server, and a usage validator.`,
};

const QUICK_LINKS = [
  {
    href: '/docs/installation',
    title: 'Installation',
    body: 'Packages, CLI, or shadcn-compatible registry — pick your workflow.',
    index: '01',
  },
  {
    href: '/docs/ai-manifests',
    title: 'COMPONENT_MANIFEST',
    body: 'The machine-readable spec behind every component: props, anti-patterns, a11y.',
    index: '02',
  },
  {
    href: '/docs/components',
    title: 'Components',
    body: `${COMPONENT_COUNT} components across core and AI interaction surfaces.`,
    index: '03',
  },
  {
    href: '/docs/templates',
    title: 'Templates',
    body: 'Complete copy-paste patterns: streaming chat, agent dashboard, RAG citations.',
    index: '04',
  },
];

export default function DocsPage() {
    return (
      <div>
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
          v{VERSION}
        </span>
        <span className="text-muted-foreground">
          {COMPONENT_COUNT} components, MCP{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">validate_usage</code>, streaming-safe
          Response, and a shadcn-compatible registry.
        </span>
        <Link href="/changelog" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
          What&apos;s new →
        </Link>
      </div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">Introduction</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Slipstream UI is an AI-first React component library. Every component ships with a{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-base">COMPONENT_MANIFEST</code> — a
        machine-readable specification that lets coding agents like Claude, Cursor, and Copilot
        generate correct UI the first time.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        What makes it different?
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Traditional libraries document for humans and hope models figure it out from training
        data — which is where hallucinated props come from. Slipstream documents for both of you:
        humans get this site, agents get manifests over MCP, canonical markdown routes, and a{' '}
        <code className="rounded bg-muted px-1.5 py-0.5">validate_usage</code> tool that checks
        their output before it ships.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Architecture</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        One monorepo ships seven published packages and two reference apps. Components live in
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-sm">packages/core</code> and
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-sm">packages/ai</code>; theming lives in
        <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-sm">@slipstream-ui/themes</code>. Every component
        flows through the same pipeline, and CI enforces it:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`source + manifest + tests
      │
      ├─ pnpm validate:manifests   # schema + TypeScript↔manifest drift
      ├─ pnpm generate:registry    # /registry/*.json (shadcn-compatible)
      ├─ pnpm generate:llm-docs    # /llm/*.md, llms.txt, README stats
      └─ MCP server                # queries the same manifests at runtime`}
        />
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
        <li><PackageLink name="@slipstream-ui/core" /> — {CORE_COMPONENT_COUNT} components: atoms, molecules, overlays, forms, data display, app/marketing chrome, content typography</li>
        <li><PackageLink name="@slipstream-ui/ai" /> — {AI_COMPONENT_COUNT} AI chat and agent components (stateless; you own state and transport)</li>
        <li><PackageLink name="@slipstream-ui/themes" /> — createTheme() and presets over a CSS-variable token contract</li>
        <li><PackageLink name="@slipstream-ui/cli" />, <PackageLink name="@slipstream-ui/registry" />, <PackageLink name="@slipstream-ui/mcp-server" />, <PackageLink name="@slipstream-ui/i18n" /> — install, registry, agent, and locale helpers sharing the same manifests</li>
        <li><strong className="text-foreground">apps/docs · apps/app · apps/playground</strong> — the docs you are reading and a reference dashboard, both built with this library</li>
      </ul>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Start here</h2>
      <ol className="mt-4 space-y-3 text-muted-foreground">
        <li>
          <strong className="text-foreground">1. Install.</strong> Follow the five-step{' '}
          <Link href="/docs/getting-started" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
            quickstart
          </Link>{' '}
          for a themed screen, or read the{' '}
          <Link href="/docs/installation" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
            installation guide
          </Link>{' '}
          for packages, CLI, and registry tradeoffs.
        </li>
        <li>
          <strong className="text-foreground">2. Read one manifest.</strong> Open{' '}
          <Link href="/docs/ai-manifests" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
            COMPONENT_MANIFEST
          </Link>{' '}
          to see the prop schema, anti-patterns, and accessibility rules your agent will read.
        </li>
        <li>
          <strong className="text-foreground">3. Wire up the agent loop.</strong> Connect the{' '}
          <Link href="/docs/mcp" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
            MCP server
          </Link>{' '}
          and call <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">validate_usage</code> before
          generated JSX reaches your editor.
        </li>
      </ol>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Quick start</h2>
      <div className="mt-4">
        <CodeBlock language="bash" className="mb-4" code={`# Packages
pnpm add @slipstream-ui/core @slipstream-ui/ai

# Or install source copies via the registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json`} />
        <p className="text-sm text-muted-foreground">
          Full setup instructions live under <Link href="/docs/installation" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">Installation</Link>.
        </p>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Explore</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <div aria-hidden="true" className="mb-2 font-mono text-sm text-muted-foreground">{link.index}</div>
            <h3 className="font-semibold group-hover:text-primary">{link.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{link.body}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Versioning &amp; Stability</h2>
      <div className="mt-4 space-y-3 text-muted-foreground">
        <p className="leading-relaxed">
          Slipstream UI follows <strong className="text-foreground">semantic versioning</strong>. The current major
          version is <strong className="text-foreground">0.x</strong>, meaning the API may change between minor
          releases as the library matures toward 1.0.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Patch (0.x.y):</strong> Bug fixes, accessibility improvements,
            documentation updates. No API changes.
          </li>
          <li>
            <strong className="text-foreground">Minor (0.x.0):</strong> New components, new props, new tokens.
            Existing props and components remain backward-compatible unless marked deprecated.
          </li>
          <li>
            <strong className="text-foreground">Major (1.0.0):</strong> Stable API guarantee. After 1.0,
            breaking changes only in major releases with a migration guide.
          </li>
        </ul>
        <p className="leading-relaxed">
          Every component ships a <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">COMPONENT_MANIFEST</code>{' '}
          with a <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">version</code> field. The manifest
          schema is validated in CI — prop schemas, TypeScript types, and manifests are checked for drift on every
          commit.
        </p>
        <p className="leading-relaxed">
          <strong className="text-foreground">Accessibility:</strong> All components pass <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">jest-axe</code>{' '}
          automated checks and support keyboard navigation, screen readers, and reduced-motion preferences.
          Accessibility regressions are treated as bugs.
        </p>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">For agent builders</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        If you are wiring an agent into Slipstream, start with{' '}
        <Link href="/docs/mcp" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">the MCP server</Link>, the{' '}
        <a href="/llm/index.md" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">canonical markdown index</a>, or{' '}
        <Link href="/docs/ai-manifests" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">the manifest schema</Link>. Every
        component page also links its own markdown reference in the header.
      </p>
    </div>
  );
}
