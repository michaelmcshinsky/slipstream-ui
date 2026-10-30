export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Installation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Get started with Slipstream UI in your project.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="mb-6 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          <strong className="text-warning-foreground">Migrating from the old slipstream-ui package?</strong>
          <p className="mt-1 text-muted-foreground">
            The original <code>slipstream-ui</code> npm package (v3.x, Tailwind 2/3 era) is deprecated and no longer maintained.
            Use <code>@slipstream-ui/core</code> and <code>@slipstream-ui/ai</code> instead — they are unrelated to the old package
            and ship with machine-readable manifests, an MCP server, and a shadcn-compatible registry.
          </p>
        </div>

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
          Extend your Tailwind config with the Slipstream UI theme:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@slipstream-ui/**/*.{js,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
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
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 210 100% 50%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 210 100% 50%;
    --radius: 0.5rem;
  }

  .dark {
    color-scheme: dark;
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 100% 50%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 210 100% 50%;
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
