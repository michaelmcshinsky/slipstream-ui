---
id: SLIP-103
title: "Dark-mode verification for every component and docs route"
epic: 7
priority: P1
estimate_hours: 10
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:test", "type:a11y", "p1"]
depends_on: ["SLIP-100"]
status: done
---

**Context.** Dark mode is a theme, not a separate component set, so nothing in
CI proved that the `.dark` class actually applied, that the rendered page kept
its styles, or that contrast, target sizes and ARIA stayed valid once the
tokens flipped. A stale build had already produced a full route set that looked
audited but served unstyled HTML, so the audit had to prove the theme and the
stylesheet were live before trusting any result.

**Scope.** One repeatable Playwright + axe pass across every component page
(109 manifests, 92 core + 17 AI) and every docs/marketing route (29), with a
screenshot per route and a committed report.

**Delivered.**

- `apps/docs/scripts/audit-dark-mode.ts` plus the `audit:dark` package script:
  - derives component routes from the core and AI manifests, so new components
    are covered automatically;
  - forces `slipstream-theme=dark` and a denied consent banner before navigation;
  - asserts `documentElement.classList.contains('dark')` on every route;
  - runs axe WCAG 2.2 A/AA and fails the command on any violation;
  - flags large light surfaces outside `data-tone="inverse|brand"` sections as a
    proxy for unstyled or non-theming panels;
  - writes `reports/dark-mode-audit.md` and screenshots to a temp directory.
- Framework fixes found by the audit:
  - `Separator` only exposes `aria-orientation` when it actually has the
    `separator` role (decorative separators no longer carry an invalid ARIA
    attribute).
  - `Tabs` registers rendered panels and only emits `aria-controls` when the
    referenced panel exists, so triggers used without `TabsContent` stay valid.
  - `Timeline` muted items no longer dim the whole block with `opacity`; the
    period/title/description keep token colors that clear 4.5:1.
  - `RangeSlider` track and native inputs are 24px tall so both thumbs meet the
    WCAG 2.2 target-size minimum.
  - `DatePicker`, `DateRangePicker` and `TimePicker` clear buttons are 24x24
    inline-flex targets instead of a padded glyph smaller than 24px.
- Docs fixes:
  - inline prose links in guides and `/docs/roadmap` are permanently underlined
    (link-in-text-block), not only on hover;
  - Tooltip, Message and ToolCall demos give their inputs/selects accessible
    names;
  - Fieldset demo rows give checkboxes enough vertical spacing to meet the
    target-size spacing exception.
- Regression tests: `Separator` (decorative vs semantic `aria-orientation`) and
  `Tabs` (no `aria-controls` without a panel).

**Acceptance criteria**

- [x] Every core and AI component page is audited in dark mode.
- [x] Every docs/marketing route is audited in dark mode.
- [x] The audit fails if `.dark` did not apply.
- [x] The audit fails on any axe WCAG 2.2 A/AA violation.
- [x] The audit fails on large unintended light surfaces.
- [x] `reports/dark-mode-audit.md` records the route count and result.
- [x] Both the light/dark `audit:a11y` pass and the dark `audit:dark` pass are clean.

**Verification.** 138 routes audited, 0 violation groups, 0 theme failures,
0 light-surface warnings. `audit:a11y` 26 page runs clean. Core tests 106 files
/ 638 tests, core and docs typecheck, core and docs lint, manifest/coverage/LLM
/count checks, and the 149-route docs build all pass.

**Files.** `apps/docs/scripts/audit-dark-mode.ts`,
`apps/docs/package.json`, `reports/dark-mode-audit.md`,
`packages/core/src/components/{separator,tabs,timeline,range-slider,date-picker,date-range-picker,time-picker}/`,
`apps/docs/app/docs/components/{tooltip,message,tool-call,fieldset}/demo.tsx`,
and the guides plus `/docs/roadmap` pages.

**Out of scope.** Manual screen-reader runs and Storybook visual regression
(covered by SLIP-084); this is the automated dark-mode net.
