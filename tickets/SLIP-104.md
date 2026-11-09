---
id: SLIP-104
title: "a11y: docs navbar links meet the 24px WCAG 2.2 target size"
epic: 6
priority: P1
estimate_hours: 1
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:accessibility", "p1"]
depends_on: []
status: done
---

**Context.** `audit:a11y` failed every route in both colour schemes with
`target-size` (serious, 27 nodes per page). The desktop navbar links were
inline text at `text-sm`, measured at 17px high by 33-81px wide, with a safe
clickable diameter of 19px against neighbours.

**Desired state.** Every navbar link is at least 24x24 CSS px and has 24px of
safe space to its closest neighbour, without changing the visual design.

**Acceptance criteria**

- [x] `target-size` reports zero nodes on all 13 routes in light and dark.
- [x] The navbar keeps its current height, spacing and typography.
- [x] No other audit rule regresses.

**Status: Done (2026-11-08).**

- Navbar links become `inline-flex h-6 items-center`, which sets a 24px-tall
  box while the text stays 14px. The existing `gap-5` keeps 20px between boxes
  plus the link's own padding, clearing the 24px spacing rule.
- Re-ran `audit:a11y`: 26 page runs (13 routes × light/dark), 0 violation groups.

**Files.** `apps/docs/components/site/navbar.tsx`.

**Out of scope.** Touch-target sizing for the mobile sheet pointer targets,
which already exceed the minimum.
