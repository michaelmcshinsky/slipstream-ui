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

- [ ] Baseline CSS/JS sizes are recorded.
- [ ] A minimal consumer import is measured.
- [ ] A budget or split plan is documented.
- [ ] The prebuilt styles remain usable without Tailwind.

**Files.** `packages/core/src/styles.css`, `packages/core/tailwind.config.js`,
`scripts/audit-packages.ts`, docs.

**Out of scope.** Removing components.

