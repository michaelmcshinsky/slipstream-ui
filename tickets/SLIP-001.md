---
id: SLIP-001
title: "Reconcile component counts and public claims"
epic: 0
priority: P0
estimate_hours: 4
milestone: "M0 Truth & baseline"
labels: ["epic:truth", "type:chore", "p0"]
depends_on: []
---

**Context.** README says 80 (63+17), the external plan says 73 (56+17), and an older comparison says 42+17. The repository is the only source of truth.

**Acceptance criteria**
- [ ] `pnpm generate:llm-docs` output, README stats, `/llms.txt`, docs index, and pricing page all show **80**.
- [ ] A CI check fails when any published count diverges from `packages/*/src/manifests`.
- [ ] Stale "42 + 17" copy is removed from every public surface.
- [ ] The count is generated, never hand-edited.

**Done when** a manifest is added/removed and every public count updates in one command.

---
