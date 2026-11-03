import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'Set up Claude Code, Cursor & Windsurf',
  description:
    'Step-by-step MCP wiring for AI coding IDEs: .mcp.json for Claude Code, mcp.json for Cursor, Windsurf config, plus rules-file patterns that make agents reach for Slipstream first.',
};

export default function IdeSetupGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        Set up Claude Code, Cursor &amp; Windsurf
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Five minutes to give every agent in your toolchain the same component truth: install the MCP
        server, add a rules file so it <em>knows</em> to call the tools, and verify with one prompt.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">0. Install</h2>
      <div className="mt-4">
        <CodeBlock language="bash" code={`# In your project (dev dependency — agents run it locally)
pnpm add -D @slipstream-ui/mcp-server

# Verify the binary answers on stdio
npx -y @slipstream-ui/mcp-server </dev/null || true   # starts and waits for MCP input`} />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">1. Claude Code</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Project-scoped config lives in <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">.mcp.json</code>{' '}
        at the repo root (commit it — teammates and CI share it):
      </p>
      <div className="mt-4">
        <CodeBlock
          language="json"
          code={`{
  "mcpServers": {
    "slipstream-ui": {
      "command": "npx",
      "args": ["-y", "@slipstream-ui/mcp-server"]
    }
  }
}`}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Verify inside Claude Code with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/mcp</code> — the
        server should list five tools (list_components, search_components, get_component_manifest,
        get_usage_examples, validate_usage).
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">2. Cursor</h2>
      <div className="mt-4">
        <CodeBlock
          language="json"
          code={`// .cursor/mcp.json  (project)  — or ~/.cursor/mcp.json (global)
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
      <p className="mt-3 text-sm text-muted-foreground">
        Settings → MCP shows the server status. Green = the five tools are available to Cursor&apos;s agent.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">3. Windsurf</h2>
      <div className="mt-4">
        <CodeBlock
          language="json"
          code={`// ~/.codeium/windsurf/mcp_config.json
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

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        4. Teach the agent to <em>reach</em> for the tools
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        MCP availability is not a habit. Add two sentences to your rules file
        (<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">CLAUDE.md</code>,{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">.cursorrules</code>, or{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">AGENTS.md</code>):
      </p>
      <div className="mt-4">
        <CodeBlock
          language="markdown"
          code={`# UI components
This project uses Slipstream UI. Before writing any component JSX:
1. search_components / get_component_manifest for the component you need.
2. Follow its props exactly — never invent prop names.
3. Run validate_usage on the generated JSX before finishing.
4. Respect anti-patterns and composition rules from the manifest.`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">5. Verify with one prompt</h2>
      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`Ask your agent: "Add a prompt input with stop-generation to our chat page,
then validate the JSX before showing me the diff."

Healthy run:  search_components("chat input")
              get_component_manifest("prompt-input")
              validate_usage(...)  -> ok
              diff shown

Unhealthy run: props like onSubmitChat / isBusy appear — the agent skipped
the tools. Strengthen the rules file, then re-ask.`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Troubleshooting</h2>
      <div className="mt-4 space-y-4">
        {[
          ['Server shows "failed to start"', 'Use the full local path to node_modules/@slipstream-ui/mcp-server/dist/index.js instead of npx if your sandbox blocks npx downloads.'],
          ['Tools listed but always error', 'The server reads manifests from the installed packages — run pnpm install and confirm @slipstream-ui/core is present.'],
          ['Agent never calls the tools', 'Rules file missing or too weak; name the tools explicitly (see step 4). Also check the agent has MCP permission enabled.'],
          ['Global vs project scope', 'Project-scoped configs (committed) beat global ones — they version the tool access with the codebase.'],
        ].map(([symptom, fix]) => (
          <div key={symptom} className="rounded-xl border border-border bg-card p-4">
            <p className="font-medium">{symptom}</p>
            <p className="mt-1 text-sm text-muted-foreground">{fix}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Related</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/docs/guides/agent-integration" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">Agent integration</Link>
          <Link href="/docs/mcp" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">MCP reference</Link>
          <Link href="/llms.txt" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">llms.txt fallback</Link>
        </div>
      </div>
    </div>
  );
}
