---
id: SLIP-011
title: "Build the benchmark harness"
epic: 1
priority: P0
estimate_hours: 10
milestone: "M1 Validation benchmark"
labels: ["epic:benchmark", "type:feature", "p0"]
depends_on: ["SLIP-010"]
---

**Acceptance criteria**
- [ ] `pnpm bench` runs cases against configurable model adapters (at least 2 providers).
- [ ] Each run records: model, temperature, seed if supported, prompt hash, raw output, timestamp, harness version.
- [ ] Runs are resumable and cached; a failed provider does not lose completed work.
- [ ] Results are written as JSON + CSV with a stable schema.
- [ ] API keys come from env vars; nothing is logged or committed.

**Done when** a clean clone can reproduce a prior run from the recorded config.

---
