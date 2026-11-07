---
id: SLIP-075
title: "Marketplace cards: deal, entity/profile, tombstone, document and load-more"
epic: 7
priority: P0
estimate_hours: 18
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: ["SLIP-070"]
---

**Context.** Marketplace and directory pages repeat card shapes for deals,
profiles, documents, and unavailable items. They need one consistent, accessible
set.

**Scope.**
- `DealCard` (value, stage, owner, status, actions).
- `EntityCard` / `ProfileCard` (avatar/logo, name, meta, tags, actions).
- `TombstoneCard` (unavailable/archived state with reason).
- `DocumentCard` (type, size, updated date, download action).
- `LoadMore` (button + loading + end state).

**Acceptance criteria**

- [ ] Cards compose from `Card`/`Badge`/`Avatar` and use semantic tokens.
- [ ] Every action is keyboard reachable; disabled states are announced.
- [ ] Long names and metadata truncate without breaking layout.
- [ ] LoadMore announces loading and end-of-list states.
- [ ] Manifests, tests, axe, docs, registry/LLM output.

**Out of scope.** Marketplace data fetching.
