import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">Slipstream UI</div>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-foreground hover:text-primary">
                Docs
              </Link>
              <Link href="/docs/components" className="text-foreground hover:text-primary">
                Components
              </Link>
              <Link
                href="/docs"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your AI already knows your design system
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Slipstream UI is an AI-first React component library. Every component ships a
            machine-readable manifest so Claude, Cursor, and Copilot generate correct UI the
            first time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/docs/components"
              className="border border-input bg-background px-6 py-3 rounded-md hover:bg-accent text-lg"
            >
              View Components
            </Link>
          </div>
          <div className="mt-8 p-4 bg-muted rounded-md inline-block">
            <code className="text-sm">npx slipstream-ui@latest init</code>
          </div>
        </div>
      </section>

      {/* The Differentiator - COMPONENT_MANIFEST */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-4 text-center">
            AI reads the spec, not the source
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Every Slipstream UI component includes a COMPONENT_MANIFEST — a machine-readable
            contract that tells AI agents exactly how to use it.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Component Code</h3>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                <code>{`const Button = ({ variant, size, children }) => {
  return (
    <button className={cn(buttonVariants({ variant, size }))}>
      {children}
    </button>
  );
};`}</code>
              </pre>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">COMPONENT_MANIFEST</h3>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                <code>{`{
  "id": "button",
  "name": "Button",
  "tier": "atom",
  "props": [
    {
      "name": "variant",
      "type": "'default' | 'destructive' | ...",
      "description": "Visual style variant"
    }
  ],
  "examples": [...],
  "accessibility": [...]
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Built for AI-Native Development</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Fully Composable Primitives</h3>
              <p className="text-muted-foreground">
                Build complex UIs from simple, focused components. Each component has a clear
                purpose and well-defined interface.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Deep AI SDK Support</h3>
              <p className="text-muted-foreground">
                First-class support for streaming, tool calls, and generative UI patterns.
                Components work seamlessly with modern AI SDKs.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">MCP Server</h3>
              <p className="text-muted-foreground">
                Zero-hallucination surface for AI agents. Query component manifests, get
                usage examples, and understand composition rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-4 text-center">Component Showcase</h2>
          <p className="text-muted-foreground text-center mb-12">
            A preview of the components available in Slipstream UI
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="font-semibold">Button</div>
              <div className="text-sm text-muted-foreground">Atom</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="font-semibold">Message</div>
              <div className="text-sm text-muted-foreground">Molecule</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="font-semibold">Conversation</div>
              <div className="text-sm text-muted-foreground">Organism</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="font-semibold">PromptInput</div>
              <div className="text-sm text-muted-foreground">Molecule</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/docs/components"
              className="text-primary hover:underline font-semibold"
            >
              View all components →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works for AI agents */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">How it works for AI agents</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Install MCP or point agent at llms.txt</h3>
                <p className="text-muted-foreground">
                  Connect your AI agent to the Slipstream UI MCP server or provide the
                  llms.txt file for context.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Agent queries manifests</h3>
                <p className="text-muted-foreground">
                  The agent reads COMPONENT_MANIFEST files to understand component props,
                  variants, and usage patterns.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Generates correct props / layouts / content</h3>
                <p className="text-muted-foreground">
                  AI generates code that follows your design system correctly, with proper
                  accessibility and composition patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLI / Install */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Get Started</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="font-semibold mb-4">Initialize with CLI</h3>
            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-6">
              <code>npx slipstream-ui@latest init</code>
            </pre>
            <h3 className="font-semibold mb-4">Or install manually</h3>
            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
              <code>pnpm add @slipstream-ui/core @slipstream-ui/ai</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold">Slipstream UI</div>
            <div className="flex gap-6">
              <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                Docs
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                GitHub
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                License
              </a>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-sm mt-8">
            © 2024 Slipstream UI. MIT License.
          </div>
        </div>
      </footer>
    </div>
  );
}
