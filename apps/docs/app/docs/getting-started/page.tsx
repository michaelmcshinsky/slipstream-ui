import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';
import { COMPONENT_COUNT } from '@/lib/component-count';

export const metadata: Metadata = {
  title: 'Quickstart',
  description:
    'Go from an empty React app to a themed Slipstream UI screen and a working agent loop in five steps: install, theme, compose, verify, and connect the manifest tools.',
};

const TROUBLESHOOTING = [
  {
    symptom: 'Components render unstyled',
    fix: 'Tailwind did not scan the package output, or the CSS variables are missing. Add the @slipstream-ui dist folders to your content/@source paths and load the theme variables. See Installation and Tailwind v4.',
  },
  {
    symptom: 'Theme variables apply to the whole document',
    fix: 'Do not set theme variables on document.documentElement from a demo or component. Scope them to your app root or a wrapper. The ThemeShowcase component is the reference for scoped previews.',
  },
  {
    symptom: 'A client hook errors in a server component',
    fix: 'Interactive components (RangeSlider, TableOfContents, Stepper with onStepClick) are client components. Put them in a file with "use client" or import them from a client boundary.',
  },
  {
    symptom: 'The agent still invents props',
    fix: 'Confirm the MCP server is running and expose its five tools. Add a rules-file instruction that requires get_component_manifest and validate_usage before emitting JSX.',
  },
  {
    symptom: 'Dark mode flashes the wrong theme',
    fix: 'Add a pre-paint theme script in the document head that reads the stored preference and toggles the dark class before React hydrates.',
  },
];

export default function GettingStartedPage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">Quickstart</h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Five steps from an empty React app to a themed screen and a working agent loop. Slipstream
        ships {COMPONENT_COUNT} components; this page wires one, then shows where the rest live.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/docs/installation" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          Full installation reference →
        </Link>
        <Link href="/docs/ai-first" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          Why the manifest matters →
        </Link>
        <Link href="/docs/components" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          Browse components →
        </Link>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">1. Check the requirements</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Node.js 20.9 or newer, and pnpm 8 or newer (npm and yarn also work).</li>
        <li>React 18 or 19.</li>
        <li>Tailwind CSS 3.4 or 4.x, or the prebuilt stylesheets when the app does not run Tailwind.</li>
        <li>TypeScript is recommended; every package ships types.</li>
      </ul>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">2. Install</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        The CLI is the shortest path: it detects Next.js or Vite, writes <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">slipstream.config.json</code>,
        creates the component directory, and injects the theme variables.
      </p>
      <div className="mt-4">
        <CodeBlock language="bash" code={`npx @slipstream-ui/cli@latest init`} />
      </div>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Prefer package imports or want to copy source into your repository? Both paths are
        supported and can coexist:
      </p>
      <div className="mt-4">
        <CodeBlock language="bash" code={`# Package imports
pnpm add @slipstream-ui/core @slipstream-ui/ai @slipstream-ui/themes

# Copy one component's source into your own tree
npx @slipstream-ui/cli@latest add message

# Or use the shadcn-compatible registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json`} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Use package imports for a quick client-side integration. Use registry or CLI copies when the
        host renders server components or needs editable source. The{' '}
        <Link href="/docs/installation" className="font-medium text-primary underline underline-offset-2">
          installation guide
        </Link>{' '}
        has the full comparison, including the server-component boundary behavior.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">3. Add the theme</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Tailwind 3 users can use the published preset; Tailwind 4 users import the CSS-first theme
        contract. Both map the same semantic tokens, and both support a custom{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">createTheme()</code>.
      </p>
      <div className="mt-4">
        <CodeBlock language="js" code={`// tailwind.config.js - Tailwind 3
module.exports = {
  presets: [require('@slipstream-ui/themes/tailwind-preset')],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@slipstream-ui/**/*.{js,ts,tsx}',
  ],
};`} />
      </div>
      <div className="mt-4">
        <CodeBlock language="css" code={`/* Tailwind 4 */
@import "tailwindcss";
@import "@slipstream-ui/themes/tailwind-v4.css";

@source "../../node_modules/@slipstream-ui/core/dist";
@source "../../node_modules/@slipstream-ui/ai/dist";`} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Not running Tailwind? Import the prebuilt sheets instead:
      </p>
      <div className="mt-3">
        <CodeBlock language="tsx" code={`import '@slipstream-ui/themes/styles.css';
import '@slipstream-ui/core/styles.css';`} />
      </div>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        To brand the components, pass your colors to{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">createTheme()</code> and emit the
        CSS variables once. The{' '}
        <Link href="/docs/theming" className="font-medium text-primary underline underline-offset-2">
          theming guide
        </Link>{' '}
        covers presets, dark mode, and radius.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">4. Compose a screen</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Start with a page structure: a Section owns the band, a Hero owns the headline, and Card plus
        Button handle the content. No providers or global state are required.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`import { Button, Card, CardContent, Hero, Section } from '@slipstream-ui/core';

export function Home() {
  return (
    <Section tone="inverse" padding="lg">
      <Hero
        badge="Now booking"
        title="Find your next dance"
        description="Competitions, socials, and studios across Utah."
        actions={<Button>Browse events</Button>}
        media={<Card><CardContent>Season line-up</CardContent></Card>}
      />
    </Section>
  );
}`}
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Need a different shape? Hero has split, centered, stacked, and overlay layouts; see the{' '}
        <Link href="/docs/components/hero" className="font-medium text-primary underline underline-offset-2">
          Hero page
        </Link>{' '}
        for live previews. Every component page follows the same Preview / Code / Usage / Types
        structure.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">5. Verify, then connect your agent</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Run your normal checks first: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">typecheck</code>,{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">lint</code>, and a production build.
        Then give your coding agent the same source of truth:
      </p>
      <div className="mt-4">
        <CodeBlock language="bash" code={`pnpm add -D @slipstream-ui/mcp-server

# .mcp.json (Claude Code) or your client's MCP settings
{
  "mcpServers": {
    "slipstream-ui": {
      "command": "npx",
      "args": ["-y", "@slipstream-ui/mcp-server"]
    }
  }
}`} />
      </div>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The loop is <em>search, read the manifest, write JSX, validate</em>. The validator catches
        hallucinated props, invalid enum values, and missing required props before the diff reaches
        your editor.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`search_components("chat input")
  -> Conversation, PromptInput, Response

get_component_manifest("prompt-input")
  -> exact props, defaults, required flags

validate_usage({
  componentId: "prompt-input",
  code: "<PromptInput onSubmit={send} isLoading={busy} onStop={stop} />"
})
  -> { valid: true, issues: [] }`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Troubleshooting</h2>
      <div className="mt-4 space-y-4">
        {TROUBLESHOOTING.map((entry) => (
          <div key={entry.symptom} className="rounded-xl border border-border bg-card p-4">
            <p className="font-medium">{entry.symptom}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{entry.fix}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Next</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link href="/docs/components" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Components</h3>
          <p className="mt-1 text-sm text-muted-foreground">Browse every component with live previews and prop tables.</p>
        </Link>
        <Link href="/docs/guides/react-hook-form" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Forms</h3>
          <p className="mt-1 text-sm text-muted-foreground">Wire FormField and validation with React Hook Form.</p>
        </Link>
        <Link href="/docs/guides/ai-chat-ui" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">AI chat UI</h3>
          <p className="mt-1 text-sm text-muted-foreground">Build a streaming assistant surface end to end.</p>
        </Link>
        <Link href="/docs/ai-first" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">AI-first model</h3>
          <p className="mt-1 text-sm text-muted-foreground">How manifests, MCP, and validation fit together.</p>
        </Link>
      </div>
    </div>
  );
}
