---
id: SLIP-094
title: "perf: audit prebuilt CSS size and tree-shaking"
epic: 6
priority: P2
estimate_hours: 3
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:chore", "p2"]
depends_on: []
status: ready
---

**Context.** `@slipstream-ui/core/styles.css` is ~38 KB minified and
`styles-full.css` ~43 KB. Consumers import the whole sheet, and the ESM bundle
is ~188 KB before tree-shaking.

**Desired state.** Measure the actual shipped CSS and JS for a minimal consumer,
document the numbers, and decide whether to:

- split the stylesheet by component group,
- add a documented purge/safelist path for Tailwind consumers,
- or keep the single sheet and set a budget.

**Acceptance criteria**

- [x] Baseline CSS/JS sizes are recorded.
- [x] A minimal consumer import is measured.
- [x] A budget or split plan is documented.
- [x] The prebuilt styles remain usable without Tailwind.

**Status: Done (2026-11-07).**

- `scripts/audit-sizes.mjs` measures the core ESM barrel, both CSS sheets, the
  themes sheet, and a minified Button + Card import (React external).
- `docs/bundle-size.md` records 234.3 KB / 47.4 KB gzip for the barrel,
  44.5 KB / 8.1 KB gzip for `styles.css`, and 132.4 KB / 36.0 KB gzip for the
  minimal import, with raw and gzip budgets.
- Decision: keep the single prebuilt sheet and enforce budgets; the follow-up
  is a per-component export map plus a `./server` entry.
- Wired into CI after the build and the release checklist; the prebuilt CSS
  still works without Tailwind.

**Files.** `packages/core/src/styles.css`, `packages/core/tailwind.config.js`,
`scripts/audit-packages.ts`, docs.

**Out of scope.** Removing components.

