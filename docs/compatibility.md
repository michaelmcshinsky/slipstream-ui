# Compatibility matrix

**Last verified:** 2026-11-05
**Rule:** a cell is **tested** only when a CI job or a committed test proves it.
Everything else is **expected** (peer range / documented) or **unsupported**.

| Surface | Version | Status | Evidence |
|---|---|---|---|
| React | 18.2 | **Tested** | `apps/docs` and `apps/playground` build; component test suites |
| React | 19.x | Expected | peer range `^18.0.0 || ^19.0.0`; no dedicated fixture yet |
| React DOM | 18.2 | **Tested** | same as React 18 |
| Next.js (App Router) | 16.4.3 | **Tested** | `apps/docs` and `apps/app` build |
| Next.js | 14 / 15 | Expected | App Router APIs used are stable; no fixture |
| Vite | playground | **Tested** | `apps/playground` build |
| Tailwind CSS | 3.4 | **Tested** | all apps build with `tooling/tailwind-config` |
| Tailwind CSS | 4.x | **Tested** | `pnpm verify:tailwind-v4` compiles the theme against component sources; core token test |
| Radix UI primitives | current | **Tested** | component test suites (Dialog, Select, Popover, Toast, …) |
| React Server Components | Next 16 | Expected | presentational components render without hooks; no RSC fixture |
| Node.js | ≥ 20.9 | **Tested** | CI runs Node 22 |
| pnpm | 8.15 | **Tested** | CI `pnpm/action-setup@v2` |
| npm / yarn / bun | current | Expected | packages publish standard ESM/CJS; no CI matrix |

## Tailwind v4 setup

```css
@import "tailwindcss";
@import "@slipstream-ui/themes/tailwind-v4.css";

@source "../../node_modules/@slipstream-ui/core/dist";
@source "../../node_modules/@slipstream-ui/ai/dist";

/* Optional: animated overlays */
@plugin "tailwindcss-animate";
```

See [tailwind-v4-audit.md](./tailwind-v4-audit.md) for the full inventory and known risks.

## What is not claimed

- React 19, Next 14/15, RSC and Tailwind v4 are **not** certified by CI yet. Do not
  describe them as tested until a fixture exists.
- Browser support follows the applications' browserslist; the library ships no
  polyfills.
- Accessibility is verified by `jest-axe` and keyboard tests, not by a formal
  VPAT or screen-reader certification.
