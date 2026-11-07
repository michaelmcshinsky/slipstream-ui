---
id: SLIP-083
title: "Page templates and CMS mappings for marketing, directory and dashboard pages"
epic: 7
priority: P1
estimate_hours: 24
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p1"]
depends_on: ["SLIP-070", "SLIP-073", "SLIP-075", "SLIP-081"]
---

**Context.** Axial runs WordPress with Elementor. A React component library is
not adoptable by a marketing team without page templates and a block-to-CMS
mapping.

**Scope.**
- Templates: landing, industry hub, owner resource hub, article, directory,
  profile, trends dashboard, lead form, calculator, pricing and careers.
- Typed block content schemas for each template.
- Adapters/examples for Sanity, Contentful, Storyblok, Payload and WordPress REST.
- Preview data and copy-paste page source in `/docs/templates`.
- Headless WordPress starter notes.

**Acceptance criteria**
- [ ] Each template renders from a typed content object with no hardcoded copy.
- [ ] Template examples pass typecheck, build and axe.
- [ ] CMS examples show the same content shape across at least two providers.
- [ ] Programmatic pages accept a list of entities and generate routes.
- [ ] Templates document which blocks are optional and which are required.
- [ ] No CMS SDK becomes a core dependency.

**Technical notes**
- Prefer a small shared `PageContent` type over five provider-specific schemas.
- Keep adapters in examples unless a provider is selected for a pilot.
