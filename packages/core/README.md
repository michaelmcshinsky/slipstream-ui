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

## Use

```tsx
import { Button, SiteHeader, ThemeToggle } from '@slipstream-ui/core'

export function App() {
  return <Button>Click me</Button>
}
```

Router-bound components (`SiteHeader`, `SiteFooter`, `Breadcrumb`, `LinkTabs`)
accept `linkComponent` plus `linkHrefProp` so react-router (`to`), Next.js
(`href`) and plain anchors all work.

## Docs

https://slipstreamui.com/docs

## License

MIT
