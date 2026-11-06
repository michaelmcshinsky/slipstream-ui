---
id: SLIP-032
title: "Add a v3/v4 compatibility test matrix to CI"
epic: 3
priority: P1
estimate_hours: 8
milestone: "M3 Tailwind v4"
labels: ["epic:tailwind", "type:test", "p1"]
depends_on: ["SLIP-031"]
---

**Acceptance criteria**
- [ ] CI builds a representative app against Tailwind 3.4 and 4.x.
- [ ] A visual/smoke test catches token or class regressions.
- [ ] The job is required before release.
- [ ] Failures name the offending component and class.

---
