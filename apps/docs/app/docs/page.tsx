import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

const QUICK_LINKS = [
  {
    href: '/docs/installation',
    title: 'Installation',
    body: 'Packages, CLI, or shadcn-compatible registry — pick your workflow.',
    icon: '⚡',
  },
  {
    href: '/docs/ai-manifests',
    title: 'COMPONENT_MANIFEST',
    body: 'The machine-readable spec behind every component: props, anti-patterns, a11y.',
    icon: '📋',
  },
  {
    href: '/docs/components',
    title: 'Components',
    body: '21 atoms and molecules across core and AI interaction surfaces.',
    icon: '🧩',
  },
  {
    href: '/docs/templates',
    title: 'Templates',
    body: 'Complete copy-paste patterns: streaming chat, agent dashboard, RAG citations.',
    icon: '📦',
  },
];

export default function DocsPage() {
    return (
      <div>
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

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Quick start</h2>
      <div className="mt-4">
        <CodeBlock language="bash" className="mb-4" code={`# Packages
pnpm add @slipstream-ui/core @slipstream-ui/ai

# Or install source copies via the registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json`} />
        <p className="text-sm text-muted-foreground">
          Full setup instructions live under <Link href="/docs/installation" className="font-medium text-primary hover:underline">Installation</Link>.
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
            <div aria-hidden="true" className="mb-2 text-xl">{link.icon}</div>
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
            <strong className="text-foreground">Patch (0.1.x):</strong> Bug fixes, accessibility improvements,
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
        <Link href="/docs/mcp" className="font-medium text-primary hover:underline">the MCP server</Link>, the{' '}
        <a href="/llm/index.md" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">canonical markdown index</a>, or{' '}
        <Link href="/docs/ai-manifests" className="font-medium text-primary hover:underline">the manifest schema</Link>. Every
        component page also links its own markdown reference in the header.
      </p>
    </div>
  );
}
