---
id: SLIP-093
title: "test: add visual regression coverage for AppShell and SiteHeader"
epic: 6
priority: P2
estimate_hours: 4
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:test", "p2"]
depends_on: ["SLIP-071", "SLIP-072"]
status: ready
---

**Context.** The sidebar height bug was found by a manual screenshot. The shell
components have behavior tests but no layout regression coverage.

**Desired state.** Playwright screenshots for AppShell with a long page, a
collapsed rail, the mobile drawer, and SiteHeader at 1280/390 in light and dark.
Assert the footer is visible and the rail does not stretch.

**Acceptance criteria**

- [ ] Screenshots are generated and diffed in CI.
- [ ] The suite catches a footer-off-screen regression.
- [ ] The suite catches a missing nav landmark.
- [ ] Baselines are committed with a documented update command.

**Files.** `apps/playground/`, `benchmarks/`, or a new `tests/visual` fixture.

**Out of scope.** Consumer-specific pages.

