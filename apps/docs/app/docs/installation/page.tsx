export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Installation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Get started with Slipstream UI in your project.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Prerequisites</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Node.js 18 or higher</li>
          <li>pnpm 8 or higher (recommended)</li>
          <li>React 18 or higher</li>
          <li>TypeScript (recommended)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Start with CLI</h2>
        <p className="text-muted-foreground mb-4">
          The fastest way to get started is using the Slipstream UI CLI:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>npx slipstream-ui@latest init</code>
        </pre>
        <p className="text-muted-foreground mb-4">
          This will:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Install the required packages</li>
          <li>Set up the configuration files</li>
          <li>Add base components to your project</li>
          <li>Configure your theme</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Manual Installation</h2>
        <p className="text-muted-foreground mb-4">
          If you prefer to install manually, follow these steps:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">1. Install packages</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>pnpm add @slipstream-ui/core @slipstream-ui/ai @slipstream-ui/themes</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">2. Configure Tailwind CSS</h3>
        <p className="text-muted-foreground mb-4">
          Add the Slipstream UI Tailwind config to your project:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`// tailwind.config.js
const { slipstreamUI } = require('@slipstream-ui/tailwind-config')

module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@slipstream-ui/**/*.{ts,tsx}',
  ],
  theme: {
    extend: slipstreamUI.theme,
  },
  plugins: [...slipstreamUI.plugins],
}`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">3. Add CSS variables</h3>
        <p className="text-muted-foreground mb-4">
          Add the CSS variables to your global CSS file:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 210 100% 50%;
    --primary-foreground: 0 0% 100%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 100% 50%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }
}`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">4. Import components</h3>
        <p className="text-muted-foreground mb-4">
          Start using components in your app:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>{`import { Button } from '@slipstream-ui/core'
import { Message, Conversation } from '@slipstream-ui/ai'

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Conversation messages={messages} />
    </div>
  )
}`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Package Managers</h2>
        <p className="text-muted-foreground mb-4">
          Slipstream UI works with all major package managers:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">pnpm (recommended)</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>pnpm add @slipstream-ui/core @slipstream-ui/ai</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">npm</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>npm install @slipstream-ui/core @slipstream-ui/ai</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">yarn</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>yarn add @slipstream-ui/core @slipstream-ui/ai</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Next Steps</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <a href="/docs/theming" className="text-primary hover:underline">
              Configure your theme
            </a>
          </li>
          <li>
            <a href="/docs/components" className="text-primary hover:underline">
              Explore available components
            </a>
          </li>
          <li>
            <a href="/docs/ai-manifests" className="text-primary hover:underline">
              Learn about COMPONENT_MANIFEST
            </a>
          </li>
          <li>
            <a href="/docs/mcp" className="text-primary hover:underline">
              Set up the MCP server
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
