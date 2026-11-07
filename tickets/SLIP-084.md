---
id: SLIP-084
title: "Storybook, visual regression and published accessibility report"
epic: 7
priority: P1
estimate_hours: 18
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:test", "p1"]
depends_on: ["SLIP-070"]
---

**Context.** Design and QA cannot review 91 components without reading code.
Adoption stalls at design review when there is no browsable catalog or visual
regression safety net.

**Scope.**
- Public Storybook with every core and AI component.
- Stories generated from manifests or colocated story files.
- Playwright visual regression for light, dark and inverse surfaces.
- Published axe report per story.
- Chromatic or a self-hosted snapshot alternative; choose the lower-cost path.

**Acceptance criteria**
- [ ] Every manifest has at least one story.
- [ ] CI fails on visual diff beyond the agreed threshold.
- [ ] CI fails on new axe violations.
- [ ] Storybook builds in CI and deploys to a stable URL.
- [ ] Docs link to the matching Storybook story from each component page.
- [ ] Reduced-motion and RTL stories exist for overlays and forms.

**Technical notes**
- Do not gate the main build on Storybook until the catalog is complete.
- Keep snapshots deterministic: fixed fonts, viewport and theme.
