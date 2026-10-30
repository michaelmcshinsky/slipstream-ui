import { CodeBlock } from '@slipstream-ui/ai';

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
  "version": "0.1.0",
  "sourceDir": "button",
  "exportName": "Button"
}`} language="json" />

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

# Get specific component manifest
get_component_manifest(componentId="button")

# Validate generated JSX against the manifest
validate_usage(componentId="button", code="<Button variant='default'>Click</Button>")`} language="bash" />

        <h3 className="text-xl font-semibold mt-6 mb-3">Direct File Access</h3>
        <p className="text-muted-foreground mb-4">
          Manifests are stored alongside component source code:
        </p>
        <CodeBlock code={`packages/core/src/manifests/button.manifest.json
packages/core/src/manifests/input.manifest.json
packages/ai/src/manifests/message.manifest.json
packages/ai/src/manifests/conversation.manifest.json`} language="text" />

        <h3 className="text-xl font-semibold mt-6 mb-3">llms.txt</h3>
        <p className="text-muted-foreground mb-4">
          The project includes an llms.txt file at the root that provides a curated overview for AI agents.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Creating Manifests</h2>
        <p className="text-muted-foreground mb-4">
          When adding new components to Slipstream UI:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>Create the component with proper TypeScript types and JSDoc</li>
          <li>Create a corresponding manifest file in <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">src/manifests/</code></li>
          <li>Include all required sections (props, examples, accessibility, etc.)</li>
          <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">pnpm validate:manifests</code> to validate</li>
          <li>Run <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">pnpm build</code> to regenerate the registry</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Benefits</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Zero Hallucination:</strong> AI agents have exact prop specifications</li>
          <li><strong>Consistency:</strong> All AI-generated code follows the same patterns</li>
          <li><strong>Accessibility:</strong> Built-in a11y requirements for every component</li>
          <li><strong>Documentation:</strong> Manifests serve as living documentation</li>
          <li><strong>Type Safety:</strong> Prop schemas match TypeScript definitions</li>
          <li><strong>Future-Proof:</strong> Easy to update without changing source code</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Next Steps</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <a href="/docs/mcp" className="text-primary hover:underline">
              Set up the MCP server
            </a>
          </li>
          <li>
            <a href="/docs/components" className="text-primary hover:underline">
              Explore components and their manifests
            </a>
          </li>
          <li>
            <a href="/docs/cli" className="text-primary hover:underline">
              Use the CLI to add components
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
