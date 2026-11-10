import type { Metadata } from 'next';
import { CodeBlock } from '@slipstream-ui/ai';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/ai-manifests', {
  title: 'COMPONENT_MANIFEST',
  description:
    'The machine-readable spec every Slipstream component ships: exact prop schema, defaults, anti-patterns, accessibility requirements, and composition rules for AI coding agents.',
});

export default function AIManifestsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">COMPONENT_MANIFEST</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Every Slipstream UI component ships a machine-readable manifest that tells AI agents exactly how to use it.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">What is COMPONENT_MANIFEST?</h2>
        <p className="text-muted-foreground mb-4">
          The COMPONENT_MANIFEST is a JSON file that accompanies every component. It contains structured information about the component that AI agents can read to understand:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Component metadata (id, name, tier)</li>
          <li>Design intent and purpose</li>
          <li>Full prop schema with types, defaults, and constraints</li>
          <li>Usage examples (good and anti-patterns)</li>
          <li>Accessibility requirements</li>
          <li>Content guidelines for AI text generation</li>
          <li>Composition rules with other components</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Why COMPONENT_MANIFEST?</h2>
        <p className="text-muted-foreground mb-4">
          Traditional component libraries rely on source code and documentation. AI agents reading source code often:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Misunderstand component intent</li>
          <li>Generate incorrect prop combinations</li>
          <li>Create anti-patterns that break the design system</li>
          <li>Miss accessibility requirements</li>
          <li>Generate inappropriate content</li>
        </ul>

        <p className="text-muted-foreground mb-4">
          COMPONENT_MANIFEST solves this by providing a <strong>contract</strong> that explicitly states how the component should be used.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Manifest Structure</h2>
        <p className="text-muted-foreground mb-4">
          Every manifest follows this schema. Here is the <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">button</code> manifest as a reference:
        </p>
        <CodeBlock code={`{
  "id": "button",
  "name": "Button",
  "tier": "atom",
  "description": "A clickable button component...",
  "designIntent": "The Button component is a fundamental...",
  "props": [
    {
      "name": "variant",
      "type": "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
      "defaultValue": "default",
      "required": false,
      "description": "Visual style variant",
      "enum": ["default", "destructive", "outline", "secondary", "ghost", "link"],
      "examples": ["default", "destructive", "outline"]
    },
    {
      "name": "size",
      "type": "'sm' | 'default' | 'lg' | 'icon'",
      "defaultValue": "default",
      "required": false,
      "description": "Button size"
    }
  ],
  "examples": [
    {
      "title": "Primary action button",
      "code": "<Button>Click me</Button>",
      "description": "Default variant for primary actions"
    },
    {
      "title": "Destructive action",
      "code": "<Button variant=\\"destructive\\">Delete</Button>",
      "description": "Use for irreversible actions"
    }
  ],
  "antiPatterns": [
    {
      "title": "Don't use for navigation alone",
      "explanation": "Buttons should trigger actions, not just navigate. Use a Link for pure navigation.",
      "example": "// Avoid\\n<Button onClick={() => router.push('/home')}>Home</Button>\\n\\n// Prefer\\n<Link href=\\"/home\\">Home</Link>"
    }
  ],
  "accessibility": [
    {
      "feature": "Keyboard navigation",
      "implementation": "Button is natively focusable and activates on Enter/Space",
      "userRequirements": "Ensure visible focus indicator"
    },
    {
      "feature": "Screen reader support",
      "implementation": "Button text is announced as the accessible name",
      "userRequirements": "For icon-only buttons, provide aria-label"
    }
  ],
  "contentGuidelines": [
    {
      "contentType": "Button text",
      "guidelines": [
        "Use action verbs (Submit, Save, Delete)",
        "Keep text short and concise",
        "Be specific about what will happen"
      ],
      "goodExamples": ["Submit form", "Save changes", "Delete account"],
      "badExamples": ["Click here", "OK", "Do it"]
    }
  ],
  "compositionRules": [
    {
      "component": "Icon",
      "relationship": "Buttons can contain icons before or after text",
      "example": "<Button><Icon />Text</Button>"
    },
    {
      "component": "Tooltip",
      "relationship": "Wrap icon-only buttons with a Tooltip to name them",
      "example": "<Tooltip content=\\"Close\\"><Button aria-label=\\"Close\\">×</Button></Tooltip>"
    }
  ],
  "relatedComponents": ["Badge", "Link", "Tooltip"],
  "package": "@slipstream-ui/core",
  "importPath": "@slipstream-ui/core",
  "version": "0.5.0",
  "sourceDir": "button",
  "exportName": "Button"
}`} language="json" />
        <p className="mt-3 text-sm text-muted-foreground">
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">version</code> tracks the
          published package version; <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">sourceDir</code> and{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">exportName</code> let the drift checker
          find the TypeScript declaration that this manifest must match.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Required sections</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-medium">Section</th>
                <th className="p-3 text-left font-medium">What it carries</th>
                <th className="p-3 text-left font-medium">Why an agent needs it</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['id, name, tier, package', 'Identity and import path', 'Find the component and the package to import.'],
                ['description, designIntent', 'What it is and when to reach for it', 'Pick the right component instead of a near neighbor.'],
                ['props', 'Type, required, default, enum, description', 'Write real props and valid enum values.'],
                ['examples', 'Runnable JSX with titles', 'Copy a pattern that compiles.'],
                ['antiPatterns', 'Wrong usage plus the preferred code', 'Avoid the predictable mistakes.'],
                ['accessibility', 'Feature, implementation, user requirements', 'Keep generated UI accessible.'],
                ['contentGuidelines', 'Tone, length, good/bad examples', 'Generate appropriate copy, not lorem ipsum.'],
                ['compositionRules', 'Related components and example wiring', 'Compose instead of duplicating.'],
                ['relatedComponents', 'Adjacent component ids', 'Walk to the next component in the flow.'],
              ].map(([section, carries, why]) => (
                <tr key={section} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{section}</td>
                  <td className="p-3 text-muted-foreground">{carries}</td>
                  <td className="p-3 text-muted-foreground">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Key Sections</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Props Schema</h3>
        <p className="text-muted-foreground mb-4">
          The props section provides complete type information for every prop, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Type definitions with TypeScript syntax</li>
          <li>Default values</li>
          <li>Whether the prop is required</li>
          <li>Clear descriptions</li>
          <li>Allowed values for enums</li>
          <li>Example values</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Examples &amp; Anti-Patterns</h3>
        <p className="text-muted-foreground mb-4">
          Each manifest includes both good usage examples and anti-patterns to avoid. This helps AI agents:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Generate correct usage patterns</li>
          <li>Avoid common mistakes</li>
          <li>Understand the component&apos;s intended use cases</li>
          <li>Learn from best practices</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Accessibility Requirements</h3>
        <p className="text-muted-foreground mb-4">
          Accessibility is built into every manifest with:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Keyboard navigation requirements</li>
          <li>Screen reader support details</li>
          <li>Focus management guidelines</li>
          <li>Color contrast requirements</li>
          <li>Form validation accessibility</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Content Guidelines</h3>
        <p className="text-muted-foreground mb-4">
          For components that display text (buttons, inputs, messages), the manifest includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Guidelines for AI when generating text content</li>
          <li>Good examples of appropriate content</li>
          <li>Bad examples to avoid</li>
          <li>Tone and style recommendations</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Composition Rules</h3>
        <p className="text-muted-foreground mb-4">
          Manifests specify how components work together:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Related components that compose well</li>
          <li>Relationship descriptions</li>
          <li>Example compositions</li>
          <li>Patterns to follow</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">For AI Agents</h2>
        <p className="text-muted-foreground mb-4">
          AI agents can access COMPONENT_MANIFEST files through:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">MCP Server</h3>
        <p className="text-muted-foreground mb-4">
          The Slipstream UI MCP server provides tools to query manifests:
        </p>
        <CodeBlock code={`# List all components
list_components()

# Search by capability
search_components(query="streaming chat")

# Get specific component manifest
get_component_manifest(componentId="button")

# Get examples and composition rules
get_usage_examples(componentId="button")

# Validate generated JSX against the manifest
validate_usage(
  componentId="button",
  code="<Button variant='primry'>Save</Button>"
)
# -> { valid: false, issues: [{ severity: "error", message: "Invalid value ..." }] }`} language="bash" />

        <h3 className="text-xl font-semibold mt-6 mb-3">Canonical markdown routes</h3>
        <p className="text-muted-foreground mb-4">
          Any client that can fetch a URL gets the same contract without an MCP connection:
        </p>
        <CodeBlock code={`GET /llms.txt                      # curated agent index
GET /llms-full.txt                 # every component in one file
GET /llm/index.md                  # overview plus component index
GET /llm/components/<id>.md        # full reference generated from the manifest`} language="text" />

        <h3 className="text-xl font-semibold mt-6 mb-3">Registry JSON</h3>
        <p className="text-muted-foreground mb-4">
          Build tools and shadcn-compatible installers read the generated registry. It carries the
          manifest plus the component source payload:
        </p>
        <CodeBlock code={`GET /registry/all.json        # index of every component
GET /registry/<id>.json       # manifest + shadcn installer payload`} language="text" />

        <h3 className="text-xl font-semibold mt-6 mb-3">Direct file access</h3>
        <p className="text-muted-foreground mb-4">
          In a checkout, manifests are stored alongside component source code:
        </p>
        <CodeBlock code={`packages/core/src/manifests/button.manifest.json
packages/core/src/manifests/input.manifest.json
packages/ai/src/manifests/message.manifest.json
packages/ai/src/manifests/conversation.manifest.json`} language="text" />

        <h3 className="text-xl font-semibold mt-6 mb-3">llms.txt</h3>
        <p className="text-muted-foreground mb-4">
          The repository includes <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">llms.txt</code> at
          the root and serves the same file at{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">https://slipstreamui.com/llms.txt</code>.
          The component lists inside it are generated between marker comments, so the index cannot
          drift from the real manifest set.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Creating Manifests</h2>
        <p className="text-muted-foreground mb-4">
          When adding new components to Slipstream UI:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>Create the component with proper TypeScript types and JSDoc</li>
          <li>Create a corresponding manifest file in <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">src/manifests/</code></li>
          <li>Document every non-inherited prop declared by any <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">*Props</code> type in that directory</li>
          <li>Include all required sections (props, examples, accessibility, anti-patterns, composition)</li>
          <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">pnpm validate:manifests</code> to validate schema and TypeScript drift</li>
          <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">pnpm generate:registry</code> and <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">pnpm generate:llm-docs</code></li>
          <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">pnpm check:llm</code> so stale generated docs fail early</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Keeping the contract honest</h2>
        <p className="text-muted-foreground mb-4">
          Four checks run in CI, each covering a different kind of drift:
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-medium">Command</th>
                <th className="p-3 text-left font-medium">Catches</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['pnpm validate:manifests', 'Schema errors, TypeScript ↔ manifest prop drift, version and component-count mismatches.'],
                ['pnpm generate:registry', 'Regenerates /registry; a diff means the published contract is stale.'],
                ['pnpm generate:llm-docs', 'Regenerates /llm, llms.txt, llms-full.txt, and README stats from manifests.'],
                ['pnpm check:llm', 'Fails when generated markdown no longer matches the manifests.'],
              ].map(([command, catches]) => (
                <tr key={command} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{command}</td>
                  <td className="p-3 text-muted-foreground">{catches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          The validator is a contract check, not a compiler. It reports unknown props, invalid enum
          values, and missing required props. Pair it with <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">tsc</code>{' '}
          and your test suite for everything else.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Benefits</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Validated usage:</strong> AI agents get exact prop specifications and a validator that checks generated JSX</li>
          <li><strong>Consistency:</strong> All AI-generated code follows the same patterns</li>
          <li><strong>Accessibility:</strong> Built-in a11y requirements for every component</li>
          <li><strong>Documentation:</strong> Manifests serve as living documentation</li>
          <li><strong>Type Safety:</strong> Prop schemas match TypeScript definitions</li>
          <li><strong>Future-Proof:</strong> Easy to update without changing source code</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Next Steps</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <a href="/docs/mcp" className="text-primary underline underline-offset-2">
              Set up the MCP server
            </a>
          </li>
          <li>
            <a href="/docs/components" className="text-primary underline underline-offset-2">
              Explore components and their manifests
            </a>
          </li>
          <li>
            <a href="/docs/cli" className="text-primary underline underline-offset-2">
              Use the CLI to add components
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
