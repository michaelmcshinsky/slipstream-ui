---
id: SLIP-070
title: "Marketing blocks II: logo cloud, feature grid/row, testimonial, process, article, newsletter, contact, announcement"
epic: 7
priority: P0
estimate_hours: 18
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: []
---

**Context.** Marketing pages still assemble these blocks by hand. Axial-style
pages need a consistent, responsive set with shared spacing, typography, and
surface tokens.

**Scope.**
- `LogoCloud` (static or marquee, grayscale/hover states).
- `FeatureGrid` and `FeatureRow` (icon/label/description; 2-4 columns).
- `Testimonial` (quote, person, company, optional avatar/logo).
- `ProcessSteps` (numbered sequence, horizontal/vertical).
- `ArticleCard` (eyebrow, title, excerpt, author, date, reading time).
- `Newsletter` (label, input, submit, consent note, success/error state).
- `ContactCard` (channels, address, hours, optional map slot).
- `AnnouncementBar` (dismissible, link, tone variants).

**Acceptance criteria**

- [x] Each block is responsive at 390, 768, and 1280.
- [x] Light and dark surfaces use semantic tokens only.
- [x] Each block has a manifest, tests, jest-axe assertion, docs page, and
      registry/LLM output.
- [x] Links use `linkComponent` or `asChild`; no hardcoded anchors.
- [x] Motion is opt-in and respects `prefers-reduced-motion`.
- [x] `pnpm validate:manifests` and `pnpm check:components` pass.

**Out of scope.** Real photography or customer logos.

**Completed:** 2026-11-07. 9 components shipped with manifests, tests, docs, nav/search and generated registry/LLM docs. Core tests 594 passed; docs build 139 routes.
