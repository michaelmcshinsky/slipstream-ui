import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'MCP component library: connect your AI agent',
  description:
    'Wire Claude Code, Cursor, or any MCP client to Slipstream UI: five MCP tools, validate_usage before emitting JSX, plus llms.txt and canonical markdown routes as fallbacks.',
};

const TOOLS: { name: string; purpose: string }[] = [
  { name: 'list_components', purpose: 'Browse components with package/tier filters.' },
  { name: 'search_components', purpose: 'Find components by capability keywords ("streaming", "citation").' },
  { name: 'get_component_manifest', purpose: 'Full COMPONENT_MANIFEST: props, defaults, examples, a11y.' },
  { name: 'get_usage_examples', purpose: 'Usage examples, composition rules, and anti-patterns.' },
  { name: 'validate_usage', purpose: 'Validate generated JSX against the manifest before emitting.' },
];

export default function AgentIntegrationGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        Connect an AI agent to your component library
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Slipstream is an <strong className="text-foreground">MCP component library</strong>: the spec your
        agent needs lives behind the Model Context Protocol, not in a README it has to guess from.
        Three consumption paths, pick per tool — MCP first, markdown as fallback, raw JSON when you
        want zero ceremony.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Path 1 — MCP server (recommended)</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Install <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">@slipstream-ui/mcp-server</code> and point
        your client at its <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">slipstream-mcp</code> binary
        (stdio transport).
      </p>
      <div className="mt-4">
        <CodeBlock language="bash" code={`pnpm add -D @slipstream-ui/mcp-server`} />
      </div>
      <div className="mt-4">
        <CodeBlock
          language="json"
          code={`// .mcp.json (Claude Code) or client MCP settings
{
  "mcpServers": {
    "slipstream-ui": {
      "command": "npx",
      "args": ["-y", "@slipstream-ui/mcp-server"]
    }
  }
}`}
        />
      </div>

      <h2 className="mt-10 scroll-m-20 text-2xl font-semibold tracking-tight">The five tools</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left font-medium">Tool</th>
              <th className="p-3 text-left font-medium">What it returns</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS.map((tool) => (
              <tr key={tool.name} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{tool.name}</td>
                <td className="p-3 text-muted-foreground">{tool.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        The validation loop
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        The point of the library: the agent checks itself <em>before</em> code lands in your diff.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`1. search_components("streaming chat")
     -> Conversation, PromptInput, Response, MessageActions

2. get_component_manifest("prompt-input")
     -> exact prop schema, defaults, required flags

3. agent writes JSX
     <PromptInput onSubmit={handle} isLoading={busy} onStop={stop} />

4. validate_usage({ componentId: "prompt-input", code: "<PromptInput ... />" })
     -> { valid: true, issues: [] }   (or flags hallucinated / invalid / missing props)

5. emit only after validation passes`}
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">validate_usage</code> catches invented prop
        names, values outside a documented enum, and missing required props - the three ways agents
        usually break component APIs. It also returns the manifest&apos;s anti-patterns so the agent can
        re-check intent.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Path 2 — canonical markdown routes
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        No MCP client? Every agent that can <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">fetch</code> can
        read plain markdown — same content as the manifests, no HTML scraping:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`GET /llms.txt                  -> library index for agents
GET /llm/index.md              -> all components with descriptions
GET /llm/components/<id>.md    -> props, anti-patterns, a11y, composition`}
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Point tools that support <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">llms.txt</code> at{' '}
        <a href="/llms.txt" className="font-medium text-primary underline underline-offset-2">slipstreamui.com/llms.txt</a>; per-component
        pages are generated from the manifests on every build, so they cannot drift.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Path 3 — raw registry JSON</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        For build-time tooling, fetch the static registry directly:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="bash"
          code={`curl https://slipstreamui.com/registry/all.json        # index of every component
curl https://slipstreamui.com/registry/message.json     # full manifest + shadcn payload`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Tips</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Give the agent the docs page link too — humans and agents read the same source of truth.</li>
        <li>Run <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">validate_usage</code> in CI if your pipeline generates UI code.</li>
        <li>Manifests carry anti-patterns and composition rules — surface them in your system prompt for even better output.</li>
      </ul>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Related</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/docs/mcp" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">MCP reference</Link>
          <Link href="/docs/ai-manifests" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">Manifest schema</Link>
          <Link href="/docs/installation" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">Installation</Link>
        </div>
      </div>
    </div>
  );
}
