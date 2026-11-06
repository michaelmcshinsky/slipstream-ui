---
id: SLIP-013
title: "Scoring, metrics, and report generator"
epic: 1
priority: P0
estimate_hours: 8
milestone: "M1 Validation benchmark"
labels: ["epic:benchmark", "type:feature", "p0"]
depends_on: ["SLIP-012"]
---

**Metrics**
- Invalid-output rate.
- First-pass correctness (no repair).
- Repair iterations to correct.
- Time/tokens to working output.
- **False-positive rate** on the 20 valid cases.
- Coverage by error class.

**Acceptance criteria**
- [ ] Scores are computed from recorded JSON, not hand-entered.
- [ ] Report generator emits Markdown + charts with confidence intervals where sample size allows.
- [ ] A `--compare` flag diffs two runs by commit and model.
- [ ] The report explicitly states what the benchmark does **not** prove.

---
