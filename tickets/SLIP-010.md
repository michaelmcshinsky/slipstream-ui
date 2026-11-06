---
id: SLIP-010
title: "Define the error taxonomy and author 100 cases"
epic: 1
priority: P0
estimate_hours: 6
milestone: "M1 Validation benchmark"
labels: ["epic:benchmark", "type:research", "p0"]
depends_on: ["SLIP-001"]
---

**Context.** The benchmark is the marketing asset and the product truth. It must be authored before the harness.

**Taxonomy (7 classes, ≥ 10 cases each)**
1. Unknown/hallucinated prop.
2. Invalid enum/variant value.
3. Missing required prop.
4. Invalid composition (child not allowed, required wrapper missing).
5. Invalid accessibility attribute or missing accessible name.
6. Unsupported state combination (e.g., `loading` + `disabled` where undefined).
7. Streaming/agent-state misuse (tool state, reasoning state, approval state).

**Acceptance criteria**
- [ ] 100 cases in `benchmarks/cases/*.json` with: id, componentId, prompt, ground-truth defect class, expected verdict, minimal fix.
- [ ] Cases are written against the **current** manifest, not from memory.
- [ ] At least 20 cases are *valid* usage (to measure false positives).
- [ ] A second reviewer has confirmed each expected verdict.

**Done when** the case set is versioned and reviewable in a PR.

---
