import type { Metadata } from 'next';
import { CodeBlock } from '@slipstream-ui/ai';
import { ThemeShowcase } from '@/components/theme-showcase';

export const metadata: Metadata = {
  title: 'Theming',
  description:
    'Theme Slipstream UI with one createTheme() call: CSS variable emission, dark mode, multi-token radius, and violet/zinc presets that switch instantly without rebuilds.',
};

export default function ThemingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Theming</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Customize Slipstream UI to match your brand with the theming system.
      </p>

      <div className="mb-10 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold mb-1">Live switcher</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Default, Violet, and Zinc presets below are applied through CSS variables in real time —
          no rebuilds, no screenshots.
        </p>
        <ThemeShowcase />
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          Slipstream UI uses CSS variables for theming, making it easy to customize colors, spacing, and other design tokens. The theming system is built on HSL color values for easy manipulation and consistent results.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Using createTheme()</h2>
        <p className="text-muted-foreground mb-4">
          The <code className="bg-muted px-2 py-1 rounded">createTheme()</code> function lets you create custom themes from brand colors:
        </p>
        <CodeBlock language="tsx" code={`import { createTheme } from '@slipstream-ui/themes'

const customTheme = createTheme({
  brandColor: '224 89% 58%',  // HSL values
  borderRadius: '0.5rem',
  darkMode: false
})`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Preset Themes</h2>
        <p className="text-muted-foreground mb-4">
          Slipstream UI includes several preset themes:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Default (Blue)</h3>
        <CodeBlock language="tsx" code={`import { defaultTheme } from '@slipstream-ui/themes'`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Dark</h3>
        <CodeBlock language="tsx" code={`import { darkTheme } from '@slipstream-ui/themes'`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Zinc (Neutral)</h3>
        <CodeBlock language="tsx" code={`import { zincTheme, zincDarkTheme } from '@slipstream-ui/themes'`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Violet (Purple)</h3>
        <CodeBlock language="tsx" code={`import { violetTheme, violetDarkTheme } from '@slipstream-ui/themes'`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">CSS Variables</h2>
        <p className="text-muted-foreground mb-4">
          The theme system uses CSS variables that you can override in your global CSS:
        </p>
        <CodeBlock language="css" code={`:root {
  --background: 0 0% 100%;
  --foreground: 222 85% 7%;
  --primary: 224 89% 58%;
  --primary-foreground: 0 0% 100%;
  --secondary: 214 45% 96%;
  --secondary-foreground: 222 47% 11%;
  --muted: 214 40% 96%;
  --muted-foreground: 219 12% 42%;
  --accent: 214 45% 96%;
  --accent-foreground: 222 47% 11%;
  --destructive: 348 68% 44%;
  --destructive-foreground: 0 0% 100%;
  --border: 214 28% 89%;
  --input: 214 28% 89%;
  --ring: 224 89% 58%;
  --radius: 0.375rem;
}

.dark {
  --background: 222 42% 5%;
  --card: 222 36% 9%;
  --foreground: 210 40% 96%;
  --primary: 224 90% 70%;
  --primary-foreground: 222 75% 10%;
  --border: 217 20% 24%;
  --input: 217 18% 32%;
  /* ... and so on */
}`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Dark Mode</h2>
        <p className="text-muted-foreground mb-4">
          To enable dark mode, add the <code className="bg-muted px-2 py-1 rounded">dark</code> class to a parent element (typically the <code className="bg-muted px-2 py-1 rounded">html</code> or <code className="bg-muted px-2 py-1 rounded">body</code> tag):
        </p>
        <CodeBlock language="css" code={`// Toggle dark mode
document.documentElement.classList.toggle('dark')`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Custom Brand Colors</h2>
        <p className="text-muted-foreground mb-4">
          When creating a custom theme, provide your brand color in HSL format:
        </p>
        <CodeBlock language="css" code={`// Convert your brand color to HSL
// Example: #3B82F6 (blue) → 217 91% 60%
const brandTheme = createTheme({
  brandColor: '217 91% 60%',
  borderRadius: '0.75rem'
})`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Converting Colors to HSL</h2>
        <p className="text-muted-foreground mb-4">
          You can use online tools or CSS to convert your brand colors to HSL:
        </p>
        <CodeBlock language="css" code={`/* In CSS */
:root {
  --brand: 217 91% 60%;  /* #3B82F6 */
}`} />

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
