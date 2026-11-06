---
id: SLIP-041
title: "Scaffold the starter app"
epic: 4
priority: P0
estimate_hours: 4
milestone: "M4 AI Chat Starter"
labels: ["epic:starter", "type:feature", "p0"]
depends_on: ["SLIP-040"]
---

**Acceptance criteria**
- [ ] Lives at `apps/starters/ai-chat` (or a documented private repo) and builds in CI.
- [ ] Uses `@slipstream-ui/core`, `@slipstream-ui/ai`, and `@slipstream-ui/themes` from the workspace.
- [ ] No secrets committed; `.env.example` documents every variable.
- [ ] `pnpm dev` works from a clean clone in under 3 minutes.

---
