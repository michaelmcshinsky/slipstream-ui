---
id: SLIP-091
title: "fix: keep AppShell rail viewport-height and Sidebar parents active"
epic: 6
priority: P0
estimate_hours: 2
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:feature", "p0"]
depends_on: []
status: done
---

**Context.** The desktop rail stretched to the full page height, pushing the
Sidebar footer off-screen. Sidebar parent items also lost their active state on
nested routes (`/app/body/strength` did not highlight `/app/body`).

**Delivered.** `AppShell`'s aside is `sticky top-0 h-screen`; `containsActive`
matches path prefixes on segment boundaries. A test covers the nested active
state.

**Verification.** Core tests pass; the Alora personal shell keeps its footer
visible at 1280×720.

**Commit.** `a0b5723`.

