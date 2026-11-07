import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'Tailwind CSS v4',
  description:
    'Use Slipstream UI with Tailwind CSS v4: import the theme contract, point @source at the package dist folders, and keep runtime theming with createTheme().',
};

export default function TailwindV4Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Tailwind CSS v4</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Slipstream UI ships a CSS-first theme contract for Tailwind v4. It maps every semantic
        token the components use, so <code className="text-foreground">createTheme()</code>, presets
        and dark mode keep working without a <code className="text-foreground">tailwind.config.js</code>.
      </p>
      <div className="mb-8 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
        <strong className="text-foreground">Status:</strong> the theme contract compiles against the real component sources in CI (`pnpm verify:tailwind-v4`). A full Next/Vite app build on v4 is still not part of CI, so treat layout-level behaviour as expected rather than certified. See <Link className="text-primary underline underline-offset-2" href="/docs/compatibility">Compatibility</Link>.
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Import the theme</h2>
      <CodeBlock
        language="css"
        code={`@import "tailwindcss";
@import "@slipstream-ui/themes/tailwind-v4.css";

/* Tell v4 where the component classes live. */
@source "../../node_modules/@slipstream-ui/core/dist";
@source "../../node_modules/@slipstream-ui/ai/dist";

/* Optional: animated overlays */
@plugin "tailwindcss-animate";`}
      />

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Apply your theme variables</h2>
      <p className="mb-3 leading-relaxed text-muted-foreground">
        Import the prebuilt defaults first, then override any token with{' '}
        <code className="text-foreground">createTheme()</code> when you need a brand palette:
      </p>
      <CodeBlock
        language="css"
        code={`@import "tailwindcss";
@import "@slipstream-ui/themes/styles.css";
@import "@slipstream-ui/themes/tailwind-v4.css";`}
      />
      <p className="mb-3 leading-relaxed text-muted-foreground">
        For a custom brand, emit the same channel variables at runtime (or from a generated stylesheet):
      </p>
      <CodeBlock
        language="ts"
        code={`import { createTheme, themeToCssVariables } from "@slipstream-ui/themes";

const css = themeToCssVariables(createTheme({ brandColor: "224 89% 53%" }));
document.documentElement.setAttribute("style", css);`}
      />

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Keep dark mode working</h2>
      <p className="mb-3 leading-relaxed text-muted-foreground">
        The v4 entry declares <code className="text-foreground">@custom-variant dark</code> against
        both the <code className="text-foreground">.dark</code> class and the{' '}
        <code className="text-foreground">[data-theme=&apos;dark&apos;]</code> attribute. Toggle
        either on <code className="text-foreground">&lt;html&gt;</code>;{' '}
        <code className="text-foreground">@slipstream-ui/themes/styles.css</code> ships the matching
        dark values.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">What changes from v3</h2>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li>There is no JavaScript theme preset to import; the CSS file replaces it.</li>
        <li>Add <code className="text-foreground">@source</code> entries so v4 scans the published component output.</li>
        <li>Animated overlays need <code className="text-foreground">tailwindcss-animate</code> via <code className="text-foreground">@plugin</code>, or <code className="text-foreground">tw-animate-css</code>; without it, overlays still render but lose motion.</li>
        <li>Dynamic class names remain unsupported. Slipstream already uses literal class maps.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Verification</h2>
      <p className="leading-relaxed text-muted-foreground">
        <code className="text-foreground">packages/core/src/test/tailwind-v4.test.ts</code> scans every
        component for semantic colour classes and fails if the v4 file is missing a token. It also
        checks radius, density, motion and accordion animations. It does not replace a real v4 app
        build.
      </p>
    </div>
  );
}
