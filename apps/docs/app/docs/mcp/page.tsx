import type { Metadata } from 'next';
import { CodeBlock } from '@slipstream-ui/ai';
import { McpPlayground } from '@/components/mcp-playground';

export const metadata: Metadata = {
  title: 'MCP Server',
  description:
    'Connect Claude Code, Cursor, or any MCP client to Slipstream UI: list_components, get_component_manifest, validate_usage keep agent-generated UI honest.',
};

export default function MCPPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">MCP Server</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Set up the Slipstream UI MCP server to give AI agents validated access to component specifications.
      </p>

      <div className="mb-10">
        <McpPlayground />
      </div>


      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">What is MCP?</h2>
        <p className="text-muted-foreground mb-4">
          MCP (Model Context Protocol) is a protocol that allows AI agents to query external tools and data sources. The Slipstream UI MCP server provides tools for AI agents to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>List all available components with filters</li>
          <li>Get complete COMPONENT_MANIFEST for any component</li>
          <li>Query component properties and usage patterns</li>
          <li>Understand composition rules and relationships</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Installation</h2>
        <p className="text-muted-foreground mb-4">
          Install the MCP server package:
        </p>
        <CodeBlock language="bash" code={`pnpm add @slipstream-ui/mcp-server`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Configuration</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Claude Desktop</h3>
        <p className="text-muted-foreground mb-4">
          Add the MCP server to your Claude Desktop configuration:
        </p>
        <CodeBlock language="text" code={`// claude_desktop_config.json
{
  "mcpServers": {
    "slipstream-ui": {
      "command": "node",
      "args": ["path/to/node_modules/@slipstream-ui/mcp-server/dist/index.js"]
    }
  }
}`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Cursor</h3>
        <p className="text-muted-foreground mb-4">
          Add to your Cursor settings:
        </p>
        <CodeBlock language="text" code={`// settings.json
{
  "mcpServers": {
    "slipstream-ui": {
      "command": "node",
      "args": ["path/to/node_modules/@slipstream-ui/mcp-server/dist/index.js"]
    }
  }
}`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Windsurf</h3>
        <p className="text-muted-foreground mb-4">
          Configure in your Windsurf settings file.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">OpenCode and other stdio clients</h3>
        <p className="text-muted-foreground mb-4">
          Any client that speaks MCP over stdio can launch the published binary with
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"> npx -y @slipstream-ui/mcp-server</code>.
          OpenCode reads the server from <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">opencode.json</code>:
        </p>
        <CodeBlock language="text" code={`// opencode.json
{
  "mcp": {
    "slipstream-ui": {
      "type": "local",
      "command": ["npx", "-y", "@slipstream-ui/mcp-server"],
      "enabled": true
    }
  }
}`} />
        <p className="text-muted-foreground mb-4">
          With the package installed in the project, point at the local binary instead to skip the
          download: <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">node node_modules/@slipstream-ui/mcp-server/dist/index.js</code>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Available Tools</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">list_components</h3>
        <p className="text-muted-foreground mb-4">
          List all available Slipstream UI components with optional filters.
        </p>
        <CodeBlock language="text" code={`// List all components
list_components()

// Filter by package
list_components(package="@slipstream-ui/core")

// Filter by tier
list_components(tier="atom")

// Combine filters
list_components(package="@slipstream-ui/ai", tier="molecule")`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">search_components</h3>
        <p className="text-muted-foreground mb-4">
          Semantic-ish keyword search over components by capability — faster than browsing when the
          agent knows what the UI should <em>do</em>, not what it is called.
        </p>
        <CodeBlock language="text" code={`// Find streaming-capable components
search_components(query="streaming chat")

// Find citation components
search_components(query="citations grounding")`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">get_component_manifest</h3>
        <p className="text-muted-foreground mb-4">
          Get the complete COMPONENT_MANIFEST for a specific component.
        </p>
        <CodeBlock language="text" code={`// Get button manifest
get_component_manifest(componentId="button")

// Get message manifest
get_component_manifest(componentId="message")`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">get_usage_examples</h3>
        <p className="text-muted-foreground mb-4">
          Fetch runnable examples (basic, composition, edge cases) straight from the manifest, so the
          agent copies patterns that actually compile.
        </p>
        <CodeBlock language="text" code={`get_usage_examples(componentId="select-menu")

// Filter by example kind
get_usage_examples(componentId="dialog", kind="composition")`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">validate_usage</h3>
        <p className="text-muted-foreground mb-4">
          Validate generated JSX against the component manifests before it ships: unknown props,
          wrong enum values, missing required props and missing accessible names are reported with
          file/line context. This is the tool that makes the library hallucination-proof.
        </p>
        <CodeBlock language="text" code={`// Ask the agent to run this before emitting code
validate_usage(
  file: "app/page.tsx",
  code: '<Button variant="primry">Save</Button>'
)

// Returns errors like:
// button.props.variant: "primry" is not one of default|destructive|…`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Example Usage</h2>
        <p className="text-muted-foreground mb-4">
          Here's how an AI agent might use the MCP server:
        </p>
        <CodeBlock language="text" code={`// AI Agent Flow:

1. Agent: "I need to create a button"
   MCP: list_components(package="@slipstream-ui/core", tier="atom")
   → Returns: Button, Input, Badge, Avatar

2. Agent: "Get the button manifest"
   MCP: get_component_manifest(componentId="button")
   → Returns: Full COMPONENT_MANIFEST with props, examples, etc.

3. Agent: "Create a primary action button"
   → Uses manifest props: variant="default"
   → Uses manifest examples: <Button>Click me</Button>
   → Follows content guidelines for button text
   → Ensures accessibility requirements`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Benefits</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Zero Hallucination:</strong> AI agents get exact specifications, no guessing</li>
          <li><strong>Real-time Updates:</strong> Always reflects the latest component API</li>
          <li><strong>Complete Information:</strong> Props, examples, accessibility, all in one query</li>
          <li><strong>Consistent Patterns:</strong> All agents follow the same usage patterns</li>
          <li><strong>Reduced Context:</strong> Don't need to load entire source code</li>
          <li><strong>Filtered Queries:</strong> Get exactly what you need (package, tier, etc.)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Development</h2>
        <p className="text-muted-foreground mb-4">
          When developing the MCP server:
        </p>
        <CodeBlock language="text" code={`# Build the MCP server
cd packages/mcp-server
pnpm build

# Test locally
node dist/index.js

# The server runs on stdio and responds to MCP protocol messages`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Troubleshooting</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Server not found</h3>
        <p className="text-muted-foreground mb-4">
          Ensure the path to the MCP server executable is correct in your configuration. Use the full path to the built file:
        </p>
        <CodeBlock language="text" code={`// Instead of:
"args": ["@slipstream-ui/mcp-server"]

// Use full path:
"args": ["/absolute/path/to/node_modules/@slipstream-ui/mcp-server/dist/index.js"]`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Components not showing</h3>
        <p className="text-muted-foreground mb-4">
          The MCP server loads manifests directly from the installed packages at startup, so component IDs always match the source of truth. If a component is missing, verify it has a COMPONENT_MANIFEST in its package's src/manifests directory.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Permission errors</h3>
        <p className="text-muted-foreground mb-4">
          Ensure the MCP server has read permissions to access the manifest files in the packages directory.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Next Steps</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <a href="/docs/ai-manifests" className="text-primary underline underline-offset-2">
              Learn about COMPONENT_MANIFEST
            </a>
          </li>
          <li>
            <a href="/docs/components" className="text-primary underline underline-offset-2">
              Explore available components
            </a>
          </li>
          <li>
            <a href="/llms.txt" className="text-primary underline underline-offset-2">
              View the llms.txt for AI agents
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
