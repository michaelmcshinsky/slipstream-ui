---
id: SLIP-100
title: "docs: regenerate registry and LLM docs after the concurrent component work"
epic: 6
priority: P1
estimate_hours: 1
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:docs", "p1"]
depends_on: []
status: ready
---

**Context.** The working tree contains nine in-progress components (`hero`,
`container`, `stat-band`, etc.) and generated docs at 91 components. The
committed `SiteHeader` manifest change is therefore not reflected in the
generated registry/LLM docs yet.

**Desired state.** Once the concurrent component work is committed, run
`pnpm generate:registry` and `pnpm generate:llm-docs`, validate manifests, and
commit the generated output together with the source.

**Acceptance criteria**

- [ ] `pnpm validate:manifests` passes at the final count.
- [ ] `pnpm check:components` passes.
- [ ] `apps/docs/public/registry`, `apps/docs/public/llm`, `llms.txt`, and
      `README.md` stats are in sync.
- [ ] No generated file references a component without a source.

**Files.** generated docs, `README.md`, `tickets/STATUS.md`.

**Out of scope.** The component implementations themselves.

