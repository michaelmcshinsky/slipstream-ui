---
id: SLIP-012
title: "Implement the four conditions"
epic: 1
priority: P0
estimate_hours: 8
milestone: "M1 Validation benchmark"
labels: ["epic:benchmark", "type:feature", "p0"]
depends_on: ["SLIP-011"]
---

**Conditions**
- **A — Docs only:** component markdown from `/llm/components/<id>.md`.
- **B — TypeScript types:** `.d.ts` / source types only.
- **C — Manifests:** the JSON manifest only.
- **D — MCP + validation:** discovery, manifest, examples, then `validate_usage` before final output.

**Acceptance criteria**
- [ ] Each condition uses the same prompt and model settings.
- [ ] Condition D records the validator verdict and whether the model repaired the defect.
- [ ] Conditions are independently runnable (`--condition D`).
- [ ] The harness never gives condition D information the other conditions lack, except the validator and manifest tools.

---
