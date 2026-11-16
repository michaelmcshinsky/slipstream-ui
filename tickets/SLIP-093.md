---
id: SLIP-093
title: "test: add visual regression coverage for AppShell and SiteHeader"
epic: 6
priority: P2
estimate_hours: 4
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:test", "p2"]
depends_on: ["SLIP-071", "SLIP-072"]
status: done
---

**Context.** The sidebar height bug was found by a manual screenshot. The shell
components have behavior tests but no layout regression coverage.

**Desired state.** Playwright screenshots for AppShell with a long page, a
collapsed rail, the mobile drawer, and SiteHeader at 1280/390 in light and dark.
Assert the footer is visible and the rail does not stretch.

**Acceptance criteria**

- [x] Screenshots are generated and diffed in CI.
- [x] The suite catches a footer-off-screen regression.
- [x] The suite catches a missing nav landmark.
- [x] Baselines are committed with a documented update command.

**Files.** `apps/playground/`, `benchmarks/`, or a new `tests/visual` fixture.

**Out of scope.** Consumer-specific pages.

**Status: Done (2026-11-14).**

- New `tests/visual` workspace package: a Vite fixture that consumes the built
  packages the way a consumer does (@slipstream-ui/themes/styles.css +
  core/styles-full.css), rendering AppShell with a 40-section page and
  SiteHeader, parameterised by `fixture`, `theme` and collapsed.
- Seven Playwright tests, all with committed baselines:
  AppShell desktop light/dark, collapsed rail, mobile drawer; SiteHeader
  desktop light/dark, mobile drawer.
- Layout invariants are asserted, not just pixels: the rail's height never
  exceeds the viewport (the regression that started this ticket), the page
  footer reaches the viewport after scrolling, the desktop item list collapses
  at 390 while the landmark stays, and the mobile drawer exposes the nav.
- Screenshots are diffed with maxDiffPixelRatio: 0.02; animations are disabled
  in the config so captures are stable.
- pnpm test:visual diffs, pnpm test:visual:update regenerates. CI installs
  Chromium and runs the suite after the build, non-blocking for now.

**Caveat.** Baselines were generated on Windows. The CI job is
continue-on-error: true until they are regenerated on the runner image with
pnpm test:visual:update; only then should it become a required check.
