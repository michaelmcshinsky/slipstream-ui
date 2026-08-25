export default function DocsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Introduction</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Slipstream UI is an AI-first React component library designed for modern development
        with AI assistance.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">What makes Slipstream UI different?</h2>
        <p className="text-muted-foreground mb-4">
          Unlike traditional component libraries, Slipstream UI is built from the ground up
          with AI-assisted development in mind. Every component includes a
          <code className="bg-muted px-2 py-1 rounded">COMPONENT_MANIFEST</code> — a
          machine-readable specification that tells AI agents exactly how to use the component.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">AI-Native Design:</strong> Every component
            ships with a machine-readable manifest for AI agents
          </li>
          <li>
            <strong className="text-foreground">Composable Primitives:</strong> Build complex
            UIs from simple, focused components
          </li>
          <li>
            <strong className="text-foreground">Deep AI SDK Support:</strong> First-class
            streaming, tool calls, and generative UI patterns
          </li>
          <li>
            <strong className="text-foreground">MCP Server:</strong> Zero-hallucination
            surface for agents to query component specs
          </li>
          <li>
            <strong className="text-foreground">TypeScript:</strong> Full type safety with
            excellent IntelliSense
          </li>
          <li>
            <strong className="text-foreground">Accessible:</strong> Built on Radix UI
            primitives for WCAG compliance
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Start</h2>
        <p className="text-muted-foreground mb-4">
          Get started with Slipstream UI in your project:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>npx slipstream-ui@latest init</code>
        </pre>
        <p className="text-muted-foreground mb-4">Or install manually:</p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>pnpm add @slipstream-ui/core @slipstream-ui/ai</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Architecture</h2>
        <p className="text-muted-foreground mb-4">
          Slipstream UI is organized into several packages:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <code className="bg-muted px-2 py-1 rounded">@slipstream-ui/core</code> - Base
            atoms and molecules
          </li>
          <li>
            <code className="bg-muted px-2 py-1 rounded">@slipstream-ui/ai</code> - AI
            interaction components (Message, Conversation, Reasoning, etc.)
          </li>
          <li>
            <code className="bg-muted px-2 py-1 rounded">@slipstream-ui/themes</code> - Theming
            system with presets
          </li>
          <li>
            <code className="bg-muted px-2 py-1 rounded">@slipstream-ui/mcp-server</code> - MCP
            server for AI agents
          </li>
          <li>
            <code className="bg-muted px-2 py-1 rounded">@slipstream-ui/cli</code> - CLI tool
            for installation and management
          </li>
        </ul>
      </div>
    </div>
  );
}
