# @slipstream-ui/core

63 React components for the Slipstream UI system: actions, typography, layout,
forms, feedback, data display, overlays, navigation and marketing chrome.

- React 18 or 19
- TypeScript types included
- Tailwind CSS 3.4/4, or the prebuilt stylesheets with no Tailwind at all
- Every component ships a machine-readable manifest (also exposed over MCP)

## Install

```bash
pnpm add @slipstream-ui/core @slipstream-ui/themes
```

With Tailwind, import the theme contract in your global stylesheet:

```css
@import "tailwindcss";
@import "@slipstream-ui/themes/tailwind-v4.css";
@source "../node_modules/@slipstream-ui/core/dist";
@plugin "tailwindcss-animate";
```

Without Tailwind, use the prebuilt stylesheets:

```css
@import "@slipstream-ui/themes/styles.css";
@import "@slipstream-ui/core/styles.css";
```

### Local checkout

When the package is linked from a local checkout through a pnpm workspace or a
`file:` dependency, Vite can resolve a second React copy from the package's
development dependencies. Dedupe React in the consumer config:

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
});
```

A repacked tarball reinstalled under the same name and version may come from
the package manager cache. Bump the version or clear the store entry before
reinstalling. Registry copies are unaffected.

## Use

```tsx
import { Button, SiteHeader, ThemeToggle } from '@slipstream-ui/core'

export function App() {
  return <Button>Click me</Button>
}
```

For server components, import a component subpath. Subpath modules keep their
own `'use client'` directive, so presentational components stay server-rendered
while overlays remain client boundaries:

```tsx
import { Card } from '@slipstream-ui/core/card';
import { Text } from '@slipstream-ui/core/text';
import { Dialog } from '@slipstream-ui/core/dialog';

export function ServerCard() {
  return (
    <Card>
      <Text>Rendered on the server</Text>
    </Card>
  );
}
```

The root import stays one client bundle for compatibility. Use subpaths when
the host app renders server components.

Router-bound components (`SiteHeader`, `SiteFooter`, `Breadcrumb`, `LinkTabs`)
accept `linkComponent` plus `linkHrefProp` so react-router (`to`), Next.js
(`href`) and plain anchors all work.

## Docs

https://slipstreamui.com/docs

## License

MIT
