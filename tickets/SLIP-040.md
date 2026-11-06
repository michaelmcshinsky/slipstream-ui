---
id: SLIP-040
title: "Write the product spec and acceptance tests"
epic: 4
priority: P0
estimate_hours: 3
milestone: "M4 AI Chat Starter"
labels: ["epic:starter", "type:docs", "p0"]
depends_on: ["SLIP-024"]
---

**Required scope**
- Streaming responses with markdown, code blocks, and citations.
- Tool-call timeline, reasoning display, human approval, error/retry.
- File attachments and local conversation history.
- Two backend adapters: Vercel AI SDK and a raw SSE (or LangGraph) adapter.
- Light/dark, mobile, keyboard, reduced motion, WCAG 2.2 AA.

**Acceptance criteria**
- [ ] Spec lists every screen, state, and empty/error case.
- [ ] Each requirement maps to an acceptance test.
- [ ] Explicitly out-of-scope items are listed (auth, multi-tenant, billing inside the starter).
- [ ] Two backend adapters are proven with a written integration contract.

---
