---
id: SLIP-061
title: "Localize P0 core component labels"
epic: 6
priority: P1
estimate_hours: 6
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:feature", "p1"]
depends_on: ["SLIP-060"]
---
**Context.** P0 components still hardcode English labels. Add optional label props with English defaults so the contract stays RSC-safe and existing tests keep passing.

**Scope:** `Button` (`loadingLabel`), `Pagination` (landmark, first, previous, next, last), `DataTable` (`emptyMessage`, `selectAllLabel`), `Dialog` (`closeLabel`), `Drawer` (`closeLabel`).

**Acceptance criteria**
- [ ] New props are optional and default to the current English text.
- [ ] Manifests document every new prop.
- [ ] Tests assert the override renders and the default is unchanged.
- [ ] `pnpm validate:manifests` and the affected package tests pass.
- [ ] The AI Chat Starter and docs can pass localized labels without a migration.
