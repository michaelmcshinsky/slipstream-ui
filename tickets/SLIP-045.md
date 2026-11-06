---
id: SLIP-045
title: "Ship two backend adapters"
epic: 4
priority: P0
estimate_hours: 8
milestone: "M4 AI Chat Starter"
labels: ["epic:starter", "type:feature", "p0"]
depends_on: ["SLIP-042"]
---

**Acceptance criteria**
- [ ] Adapter 1: Vercel AI SDK (`useChat`-style stream).
- [ ] Adapter 2: raw SSE or LangGraph, without importing the AI SDK.
- [ ] Both implement the same documented contract and pass the same UI tests.
- [ ] Switching adapters is a config change, not a rewrite.

---
