---
id: SLIP-092
title: "feat: expose accessible SiteHeader navigation labels"
epic: 6
priority: P1
estimate_hours: 1
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:feature", "p1"]
depends_on: []
status: done
---

**Context.** `SiteHeader` rendered a `<nav>` without an accessible name, so
tests and assistive tech could not identify the marketing navigation.

**Delivered.** `navLabel` and `mobileNavLabel` props with defaults, wired to the
desktop and mobile nav landmarks, and documented in the manifest.

**Verification.** Alora's marketing e2e finds the navigation by the name
"Marketing"; MCP `validate_usage` accepts the props.

**Commit.** `a0b5723`.

