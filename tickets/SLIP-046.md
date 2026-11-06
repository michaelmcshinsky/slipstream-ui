---
id: SLIP-046
title: "Accessibility, responsive, and reduced-motion pass"
epic: 4
priority: P0
estimate_hours: 5
milestone: "M4 AI Chat Starter"
labels: ["epic:starter", "type:test", "p0"]
depends_on: ["SLIP-043"]
---

**Acceptance criteria**
- [ ] axe-core: zero WCAG 2.2 A/AA violations on every screen.
- [ ] Full keyboard operation; visible focus; focus restore after dialogs.
- [ ] Mobile layout verified at 360px, 768px, 1280px.
- [ ] `prefers-reduced-motion` respected.
- [ ] Screen-reader pass documented (NVDA or VoiceOver), not just automated.

---
