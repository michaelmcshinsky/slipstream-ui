---
id: SLIP-002
title: "Verify all 80 manifests against TypeScript props and publish the gap report"
epic: 0
priority: P0
estimate_hours: 6
milestone: "M0 Truth & baseline"
labels: ["epic:truth", "type:test", "p0"]
depends_on: ["SLIP-001"]
---

**Context.** `pnpm validate:manifests` checks schema and directory-scoped TS/manifest parity. It does not prove that every runtime prop is documented, that defaults match, or that anti-patterns are accurate.

**Acceptance criteria**
- [ ] A script reports, per component: manifest props, TS props, missing-in-manifest, extra-in-manifest, default mismatches.
- [ ] The report is checked into CI as an artefact (not a blocking gate until the baseline is clean).
- [ ] Known exceptions are documented with a reason and an owner.
- [ ] The report is reproducible from a clean clone.

**Done when** a maintainer can answer "is component X's manifest accurate?" in one command.

---
