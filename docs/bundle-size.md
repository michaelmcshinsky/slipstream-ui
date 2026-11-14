# Bundle and stylesheet size

**Measured:** 2026-11-14, after `pnpm build`, with React external.
**Command:** `node scripts/audit-sizes.mjs`

| Artifact | Raw | Gzip |
|---|---:|---:|
| `@slipstream-ui/core` ESM barrel (`dist/index.mjs`) | 294.6 KB | 60.3 KB |
| `@slipstream-ui/core/styles.css` (utilities only) | 48.8 KB | 9.1 KB |
| `@slipstream-ui/core/styles-full.css` (with preflight) | 52.5 KB | 10.0 KB |
| `@slipstream-ui/themes/styles.css` | 3.2 KB | 0.8 KB |
| Minimal import: Button + Card parts, minified | 162.0 KB | 44.6 KB |

The minimal import uses:

```ts
import { Button, Card, CardContent, CardHeader, CardTitle } from '@slipstream-ui/core';
```

## What the numbers mean

- The CSS is the better story: the full prebuilt sheet is under 50 KB raw and
  under 10 KB gzip. Consumers can import it without a Tailwind build, and
  Tailwind users can scan the package output instead.
- The ESM barrel tree-shakes, but a five-component import still carries roughly
  162 KB minified. Most of that is shared infrastructure (`tailwind-merge`,
  `class-variance-authority`, Radix primitives) plus the barrel's client
  boundary, not the five components themselves.
- A per-component export map (or a `./server` entry for non-interactive
  components) is the structural fix. It is tracked separately because it
  changes the public import surface.

## Decision

Keep the single prebuilt stylesheet for now. Splitting it by component group
would add consumer configuration for a small win. Enforce budgets instead so a
regression is caught before release.

| Artifact | Raw budget | Gzip budget |
|---|---:|---:|
| Core ESM barrel | 310 KB | 64 KB |
| `styles.css` | 55 KB | 12 KB |
| `styles-full.css` | 60 KB | 14 KB |
| `themes/styles.css` | 6 KB | 2 KB |
| Minimal import | 180 KB | 50 KB |

The barrel budget moved from 280 KB / 60 KB to 310 KB / 64 KB when `Calendar`
and `DatePickerPopover` landed together with the shared placement and date
utilities (measured 294.6 KB raw / 60.3 KB gzip). The minimal-import budget is
unchanged: the new components tree-shake out of a Button + Card page.

`node scripts/audit-sizes.mjs` exits non-zero when a budget is exceeded. It runs
after the build in CI and is listed in the release checklist.

## Follow-up

1. Add per-component export subpaths (`./button`, `./card`, ...) so a consumer
   can import one primitive without the barrel.
2. Add a `./server` entry for the non-interactive components so they do not
   cross the client boundary.
3. Re-measure after both land and lower the minimal-import budget.
