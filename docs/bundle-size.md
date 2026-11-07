# Bundle and stylesheet size

**Measured:** 2026-11-07, after `pnpm build`, with React external.
**Command:** `node scripts/audit-sizes.mjs`

| Artifact | Raw | Gzip |
|---|---:|---:|
| `@slipstream-ui/core` ESM barrel (`dist/index.mjs`) | 234.3 KB | 47.4 KB |
| `@slipstream-ui/core/styles.css` (utilities only) | 44.5 KB | 8.1 KB |
| `@slipstream-ui/core/styles-full.css` (with preflight) | 49.1 KB | 9.3 KB |
| `@slipstream-ui/themes/styles.css` | 3.1 KB | 0.8 KB |
| Minimal import: Button + Card parts, minified | 132.4 KB | 36.0 KB |

The minimal import uses:

```ts
import { Button, Card, CardContent, CardHeader, CardTitle } from '@slipstream-ui/core';
```

## What the numbers mean

- The CSS is the better story: the full prebuilt sheet is under 50 KB raw and
  under 10 KB gzip. Consumers can import it without a Tailwind build, and
  Tailwind users can scan the package output instead.
- The ESM barrel tree-shakes, but a five-component import still carries roughly
  132 KB minified. Most of that is shared infrastructure (`tailwind-merge`,
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
| Core ESM barrel | 280 KB | 60 KB |
| `styles.css` | 55 KB | 12 KB |
| `styles-full.css` | 60 KB | 14 KB |
| `themes/styles.css` | 6 KB | 2 KB |
| Minimal import | 180 KB | 50 KB |

`node scripts/audit-sizes.mjs` exits non-zero when a budget is exceeded. It runs
after the build in CI and is listed in the release checklist.

## Follow-up

1. Add per-component export subpaths (`./button`, `./card`, ...) so a consumer
   can import one primitive without the barrel.
2. Add a `./server` entry for the non-interactive components so they do not
   cross the client boundary.
3. Re-measure after both land and lower the minimal-import budget.
