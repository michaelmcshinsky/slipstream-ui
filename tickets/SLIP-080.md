---
id: SLIP-080
title: "Icons and media package: Icon, IconButton, IconTile, SocialLinks, Media and Figure"
epic: 7
priority: P0
estimate_hours: 14
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: []
---

**Context.** Consumers bring their own icon system and hand-build media
wrappers. Axial pages need one consistent icon sizing/tiling contract and
accessible media primitives.

**Scope.**
- `Icon` (size/stroke/tone wrapper; accepts any SVG component).
- `IconButton` (accessible label required, sizes, variants).
- `IconTile` (tinted surface, size, optional badge).
- `SocialLinks` (platform list, labels, safe external links).
- `Media` / `Figure` (aspect ratio, caption, credit, loading/decoding).

**Acceptance criteria**

- [ ] Icon sizes align to the spacing scale; no arbitrary pixel values.
- [ ] IconButton refuses to render without an accessible label.
- [ ] SocialLinks uses safe `rel` and names each destination.
- [ ] Media reserves aspect ratio to prevent layout shift.
- [ ] Manifests, tests, axe, docs, registry/LLM output.

**Out of scope.** Shipping a full icon set.
