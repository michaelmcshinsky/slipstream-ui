import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from '@/lib/component-count';

export const metadata: Metadata = {
  title: 'AI-first by design',
  description:
    'How Slipstream UI keeps AI-generated UI correct: one COMPONENT_MANIFEST per component, an MCP server with validate_usage, canonical markdown routes, and a registry that all derive from the same source.',
};

const LAYERS = [
  {
    title: 'COMPONENT_MANIFEST',
    body: 'A JSON contract beside every component: prop schema, defaults, enums, examples, anti-patterns, accessibility, content, and composition rules.',
    href: '/docs/ai-manifests',
    cta: 'Manifest schema',
  },
  {
    title: 'MCP server',
    body: 'Five tools let an agent search, read, and validate against the manifests at authoring time. No source scraping, no guessed props.',
    href: '/docs/mcp',
    cta: 'MCP reference',
  },
  {
    title: 'Canonical markdown',
    body: 'Every manifest is also served as clean markdown and a single-file corpus, so any agent that can fetch works without an MCP client.',
    href: '/docs/guides/agent-integration',
    cta: 'Agent integration',
  },
  {
    title: 'Registry + CLI',
    body: 'The same data powers the shadcn-compatible registry and the CLI, so humans and agents install the exact source the docs describe.',
    href: '/docs/cli',
    cta: 'CLI reference',
  },
];

export default function AiFirstPage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">AI-first by design</h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Slipstream treats an AI coding agent as a first-class consumer. Instead of hoping a model
        infers the API from source, every component publishes a contract and a validator checks the
        generated JSX before it ships. {COMPONENT_COUNT} components ({CORE_COMPONENT_COUNT} core,{' '}
        {AI_COMPONENT_COUNT} AI) ship that contract today.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/docs/getting-started" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          Quickstart →
        </Link>
        <Link href="/docs/ai-manifests" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          Read a manifest →
        </Link>
        <Link href="/docs/mcp" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          Connect an agent →
        </Link>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">The problem</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Agents trained on the open web guess at component APIs. The result is usually the same three
        failures: a prop that does not exist, an enum value that was never in the type, or a
        required prop that never appears. Documentation written for humans does not close that gap,
        because the model never sees it at the moment it writes the code.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">The contract</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Each component directory ships a manifest beside its source. The manifest is small enough to
        load into a prompt and explicit enough to validate against:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="json"
          code={`{
  "id": "stepper",
  "name": "Stepper",
  "tier": "molecule",
  "description": "Multi-step flow indicator...",
  "props": [
    { "name": "current", "type": "number", "required": true },
    { "name": "orientation", "type": "'horizontal' | 'vertical'",
      "defaultValue": "horizontal", "enum": ["horizontal", "vertical"] },
    { "name": "variant", "type": "'numbered' | 'dots'",
      "defaultValue": "numbered", "enum": ["numbered", "dots"] }
  ],
  "examples": [{ "title": "Onboarding wizard", "code": "<Stepper ... />" }],
  "antiPatterns": [{ "title": "Don't use it for progress percentage", ... }],
  "accessibility": [{ "feature": "Sequence + state", ... }],
  "compositionRules": [{ "component": "Form", ... }],
  "relatedComponents": ["Progress", "Tabs", "Form"]
}`}
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        The manifest is not a copy of the TypeScript types. It adds intent, anti-patterns, and
        accessibility requirements that types cannot express. A drift checker compares the two on
        every run, so the contract cannot silently fall behind the code.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">The loop</h2>
      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`1. search_components("multi-step form")
     -> Stepper, Progress, Tabs

2. get_component_manifest("stepper")
     -> exact props, defaults, required flags, examples

3. the agent writes JSX
     <Stepper current={step} orientation="vertical" steps={steps} />

4. validate_usage({
     componentId: "stepper",
     code: "<Stepper current={step} orientation='vertical' steps={steps} />"
   })
     -> { valid: true, issues: [] }

5. emit only after validation passes`}
        />
      </div>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The validator reports unknown props, values outside a documented enum, and missing required
        props. It also returns the manifest&apos;s anti-patterns so the agent can re-check intent,
        not only syntax.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Four surfaces, one source</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {LAYERS.map((layer) => (
          <Link
            key={layer.title}
            href={layer.href}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40"
          >
            <h3 className="font-semibold">{layer.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{layer.body}</p>
            <p className="mt-3 text-sm font-medium text-primary">{layer.cta} →</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Pick your entry point</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left font-medium">You have</th>
              <th className="p-3 text-left font-medium">Start with</th>
              <th className="p-3 text-left font-medium">Then</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="p-3">An MCP-capable IDE (Claude Code, Cursor, Windsurf, OpenCode)</td>
              <td className="p-3 text-muted-foreground">The MCP server</td>
              <td className="p-3 text-muted-foreground">Add a rules-file instruction that requires validate_usage.</td>
            </tr>
            <tr className="border-t border-border">
              <td className="p-3">Any agent that can fetch a URL</td>
              <td className="p-3 text-muted-foreground"><code className="font-mono text-xs">/llms.txt</code></td>
              <td className="p-3 text-muted-foreground">Read the per-component markdown for props and anti-patterns.</td>
            </tr>
            <tr className="border-t border-border">
              <td className="p-3">A build pipeline or codegen tool</td>
              <td className="p-3 text-muted-foreground">The registry JSON</td>
              <td className="p-3 text-muted-foreground">Read manifests at build time; copy source with the CLI or shadcn.</td>
            </tr>
            <tr className="border-t border-border">
              <td className="p-3">A human writing the first screen</td>
              <td className="p-3 text-muted-foreground">The quickstart</td>
              <td className="p-3 text-muted-foreground">Read one manifest so you know what your agent will see.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">What stays in sync</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
        <li><strong className="text-foreground">TypeScript ↔ manifest:</strong> prop names, optionality, and enums are compared; drift fails CI.</li>
        <li><strong className="text-foreground">Manifest ↔ registry:</strong> the registry is generated from manifests, so a published component cannot omit its contract.</li>
        <li><strong className="text-foreground">Manifest ↔ markdown:</strong> the LLM index and per-component pages are generated, and a check gate fails when they are stale.</li>
        <li><strong className="text-foreground">Manifest ↔ MCP:</strong> the server loads the installed manifests at startup, not a cached snapshot.</li>
      </ul>
      <div className="mt-4">
        <CodeBlock language="bash" code={`pnpm validate:manifests   # schema + TS drift + versions + counts
pnpm generate:registry    # /registry/*.json
pnpm generate:llm-docs    # /llm/*.md, llms.txt, llms-full.txt
pnpm check:llm            # fail if generated docs are stale`} />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">What the validator does not do</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">validate_usage</code> is a
        contract check, not a compiler or a design review. It does not type-check expressions, run
        your app, or judge visual composition. Keep your normal{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">tsc</code>, tests, and axe
        runs in the loop; the validator catches the class of mistakes that type-checking never sees
        because the generated code imports the real types only after it is emitted.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Next</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link href="/docs/guides/ide-setup" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Wire your IDE</h3>
          <p className="mt-1 text-sm text-muted-foreground">Concrete configs for Claude Code, Cursor, Windsurf, and OpenCode.</p>
        </Link>
        <Link href="/docs/guides/testing" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Gate it in CI</h3>
          <p className="mt-1 text-sm text-muted-foreground">Run validate_usage and manifest checks on every pull request.</p>
        </Link>
        <Link href="/docs/templates" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Start from a template</h3>
          <p className="mt-1 text-sm text-muted-foreground">Streaming chat, agent dashboard, RAG citations, and more.</p>
        </Link>
        <Link href="/llms.txt" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Read the agent index</h3>
          <p className="mt-1 text-sm text-muted-foreground">The same overview an agent fetches before writing code.</p>
        </Link>
      </div>
    </div>
  );
}
