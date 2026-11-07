---
id: SLIP-072
title: "Content hub: featured post, promo card, tag filter, author card, share bar, related posts"
epic: 7
priority: P1
estimate_hours: 18
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p1"]
depends_on: ["SLIP-070"]
---

**Context.** Blog, changelog, and resource pages repeat the same content-hub
pieces. They need one accessible set that works with any router.

**Scope.**
- `FeaturedPost` (large card, image slot, eyebrow, title, excerpt).
- `PromoCard` (compact CTA with tone variants).
- `TagFilter` (single/multi-select chips, clear-all, counts).
- `AuthorCard` (avatar, name, role, bio, links).
- `ShareBar` (copy link, native share, social links; no tracking).
- `RelatedPosts` (2-4 cards, responsive grid).

**Acceptance criteria**

- [ ] TagFilter is keyboard operable and announces selection state.
- [ ] ShareBar copies the current URL and confirms success.
- [ ] RelatedPosts handles 0, 1, and 4+ items.
- [ ] Manifests, tests, axe, docs, registry/LLM output.
- [ ] No external tracking scripts.

**Out of scope.** CMS integration.
