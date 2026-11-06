---
id: SLIP-043
title: "Implement tool calls, reasoning, and human approval"
epic: 4
priority: P0
estimate_hours: 10
milestone: "M4 AI Chat Starter"
labels: ["epic:starter", "type:feature", "p0"]
depends_on: ["SLIP-042"]
---

**Acceptance criteria**
- [ ] Tool call states: pending, running, success, error, denied.
- [ ] Reasoning is collapsible and announced correctly.
- [ ] Approval flow supports approve/deny with a clear audit trail in the UI.
- [ ] Errors are surfaced with a retry path, never swallowed.
- [ ] No business logic in view components; state lives in a controller/hook.

---
