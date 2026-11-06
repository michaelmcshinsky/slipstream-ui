# Tailwind v4 audit

**Date:** 2026-11-05
**Scope:** `packages/core`, `packages/ai`, `packages/themes`, `tooling/tailwind-config`, `apps/*`
**Question:** what blocks a consumer from using Slipstream UI with Tailwind CSS v4?

## Summary

The component source is already v4-friendly: it uses semantic utility classes
(`bg-card`, `text-muted-foreground`, `border-border`) and literal class maps, with
no `theme()` calls, no `@apply` in the published packages, and no dynamically
constructed class names.

The blocker was the **theme contract**: v4 has no `tailwind.config.js`, so the
`colors`, `borderRadius`, `spacing`, transition and keyframe mappings in
`tooling/tailwind-config/tailwind.config.js` were invisible to v4 consumers.

`packages/themes/tailwind-v4.css` now provides the equivalent `@theme` contract.
It is published as `@slipstream-ui/themes/tailwind-v4.css` and covered by
`packages/core/src/test/tailwind-v4.test.ts`, which scans every component for
semantic colour classes and fails if the v4 file is missing a token.

## Inventory

| # | v3-specific usage | Location | v4 status | Action |
|---|---|---|---|---|
| 1 | JS theme preset (`colors`, `borderRadius`, `spacing`, `transition*`, `keyframes`) | `tooling/tailwind-config/tailwind.config.js` | Unsupported as-is | Replaced by `packages/themes/tailwind-v4.css` `@theme` blocks |
| 2 | `darkMode: ['class']` | same | Changed API | `@custom-variant dark (&:where(.dark, .dark *))` |
| 3 | `content` globs | same | Changed API | Consumers add `@source` for `node_modules/@slipstream-ui/{core,ai}/dist` |
| 4 | `tailwindcss-animate` JS plugin | `packages/core`, `apps/*` | Compatible via `@plugin`, or use `tw-animate-css` | Documented in the v4 CSS header; motion is opt-in and overlays render without it |
| 5 | `hsl(var(--token))` colours | `tooling/tailwind-config`, `createTheme()` | Compatible | Mapped to `--color-*` in the v4 file |
| 6 | `@apply border-border` / `@apply bg-background text-foreground` | `apps/playground/src/index.css` only | Compatible in a global stylesheet | No change to published packages |
| 7 | `theme()` calls | none found | n/a | none |
| 8 | Dynamic class construction | none found in published components; `Grid`/`Drawer` use literal maps | Compatible | Keep literal maps |
| 9 | `container` theme config | `tooling/tailwind-config` | Changed API | Consumers can use the `container` utility; no component depends on the custom `2xl` breakpoint |
| 10 | `accordion-down` / `accordion-up` keyframes | `tooling/tailwind-config` | Compatible | Moved into `@theme` in the v4 file |

## Consumer setup (v4)

```css
@import "tailwindcss";
@import "@slipstream-ui/themes/tailwind-v4.css";

@source "../../node_modules/@slipstream-ui/core/dist";
@source "../../node_modules/@slipstream-ui/ai/dist";

/* Optional: animated overlays */
@plugin "tailwindcss-animate";
```

Theme variables still come from `createTheme()`:

```ts
import { createTheme, themeToCssVariables } from '@slipstream-ui/themes';

const css = themeToCssVariables(createTheme({ brandColor: '224 89% 53%' }));
document.documentElement.setAttribute('style', css);
```

## Verification status

| Check | Status |
|---|---|
| Every semantic colour used by components exists in the v4 file | Tested (`tailwind-v4.test.ts`, 6 assertions) |
| ThemeColors keys all mapped | Tested |
| Radius, density and motion tokens preserved | Tested |
| Accordion animations preserved | Tested |
| Dark variant declared | Tested |
| Tailwind v4 compile fixture against component sources | **Tested** (`pnpm verify:tailwind-v4`, v4.3.4) |
| Fresh Vite/Next app build on v4 | **Not yet verified** (compile fixture only) |
| Animated overlays with `tailwindcss-animate` under v4 | **Not yet verified** |

## Known risks

1. **`tailwindcss-animate` on v4.** The plugin may work through `@plugin`, but the
   project should test it or migrate to `tw-animate-css`. Until then, only motion
   is at risk; static rendering and accessibility are unaffected.
2. **`@source` paths.** Monorepos and pnpm layouts differ. The migration guide must
   show both a workspace-relative path and a package-manager-agnostic alternative.
3. **Scoped themes.** `themeToCssVariables()` can be applied to a subtree, but v4
   `@theme` values are global. Document that runtime theme switching still works
   because the `--color-*` values resolve `var(--token)` at use time.
