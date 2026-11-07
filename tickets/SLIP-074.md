---
id: SLIP-074
title: "Charts package with accessible bar, line, area, sparkline and table fallback"
epic: 7
priority: P0
estimate_hours: 28
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: ["SLIP-070"]
---

**Context.** Dashboards need charts that match the design system and remain
accessible without a canvas-only implementation.

**Scope.**
- New `@slipstream-ui/charts` package (or a core subpath).
- `BarChart`, `LineChart`, `AreaChart`, `Sparkline`.
- Shared axes, grid, legend, tooltip, and empty/loading states.
- A data-table fallback and a screen-reader summary.
- Token-driven colors, including a categorical palette.

**Acceptance criteria**

- [ ] Charts render with SVG (no canvas-only output).
- [ ] Every chart has an accessible name, summary, and table fallback.
- [ ] Keyboard focus reaches data points or a data table.
- [ ] Responsive at 320/768/1280; no horizontal overflow.
- [ ] Light/dark tokens and reduced motion.
- [ ] Manifests, tests, axe, docs, registry/LLM output.
- [ ] Bundle budget recorded; no chart library dependency unless justified.

**Out of scope.** Real-time streaming charts.
