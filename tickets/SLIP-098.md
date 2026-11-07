---
id: SLIP-098
title: "feat: add a PageHeader document-head helper"
epic: 6
priority: P3
estimate_hours: 3
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:feature", "p3"]
depends_on: []
status: ready
---

**Context.** `PageHeader` renders the visible heading only. Consumers using
Next, Inertia, or React Router still wire `<title>`, description, canonical, and
`noindex` separately.

**Desired state.** Add an optional, router-agnostic head slot or a small
`useDocumentHead` helper that accepts `title`, `description`, `canonical`, and
`noindex` and lets the consumer's router adapter apply it. Do not couple the
component to Next or Inertia.

**Acceptance criteria**

- [ ] The helper is optional; `PageHeader` alone behaves exactly as today.
- [ ] The API is documented with Next, Inertia, and React Router examples.
- [ ] No new runtime dependency is added.
- [ ] Tests cover title, description, canonical, and robots output.

**Files.** `packages/core/src/components/page-header/`, docs, manifest.

**Out of scope.** Full SEO management.

