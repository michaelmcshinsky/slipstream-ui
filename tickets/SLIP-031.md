---
id: SLIP-031
title: "Add a Tailwind v4 preset while keeping v3.4 support"
epic: 3
priority: P0
estimate_hours: 10
milestone: "M3 Tailwind v4"
labels: ["epic:tailwind", "type:feature", "p0"]
depends_on: ["SLIP-030"]
---

**Acceptance criteria**
- [ ] A v4-compatible theme entry ships (CSS-first `@theme` / `@import "tailwindcss"`).
- [ ] Existing v3.4 consumers are unaffected (no breaking change to the current preset).
- [ ] Semantic tokens remain the only public styling contract.
- [ ] No hardcoded palette colours introduced.
- [ ] A fresh Vite app and a fresh Next app both build with v4.

---
