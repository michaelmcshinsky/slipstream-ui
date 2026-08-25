export default function ThemingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Theming</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Customize Slipstream UI to match your brand with the theming system.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          Slipstream UI uses CSS variables for theming, making it easy to customize colors, spacing, and other design tokens. The theming system is built on HSL color values for easy manipulation and consistent results.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Using createTheme()</h2>
        <p className="text-muted-foreground mb-4">
          The <code className="bg-muted px-2 py-1 rounded">createTheme()</code> function lets you create custom themes from brand colors:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`import { createTheme } from '@slipstream-ui/themes'

const customTheme = createTheme({
  brandColor: '210 100% 50%',  // HSL values
  borderRadius: '0.5rem',
  darkMode: false
})`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Preset Themes</h2>
        <p className="text-muted-foreground mb-4">
          Slipstream UI includes several preset themes:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Default (Blue)</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`import { defaultTheme } from '@slipstream-ui/themes'`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Dark</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`import { darkTheme } from '@slipstream-ui/themes'`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Zinc (Neutral)</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`import { zincTheme, zincDarkTheme } from '@slipstream-ui/themes'`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Violet (Purple)</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`import { violetTheme, violetDarkTheme } from '@slipstream-ui/themes'`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">CSS Variables</h2>
        <p className="text-muted-foreground mb-4">
          The theme system uses CSS variables that you can override in your global CSS:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
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
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 100% 50%;
  --primary-foreground: 210 40% 98%;
  /* ... and so on */
}`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Dark Mode</h2>
        <p className="text-muted-foreground mb-4">
          To enable dark mode, add the <code className="bg-muted px-2 py-1 rounded">dark</code> class to a parent element (typically the <code className="bg-muted px-2 py-1 rounded">html</code> or <code className="bg-muted px-2 py-1 rounded">body</code> tag):
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`// Toggle dark mode
document.documentElement.classList.toggle('dark')`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Custom Brand Colors</h2>
        <p className="text-muted-foreground mb-4">
          When creating a custom theme, provide your brand color in HSL format:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
          <code>{`// Convert your brand color to HSL
// Example: #3B82F6 (blue) → 217 91% 60%
const brandTheme = createTheme({
  brandColor: '217 91% 60%',
  borderRadius: '0.75rem'
})`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Converting Colors to HSL</h2>
        <p className="text-muted-foreground mb-4">
          You can use online tools or CSS to convert your brand colors to HSL:
        </p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>{`/* In CSS */
:root {
  --brand: 217 91% 60%;  /* #3B82F6 */
}`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Next Steps</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <a href="/docs/components" className="text-primary hover:underline">
              Explore components
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
