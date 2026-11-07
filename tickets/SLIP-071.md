---
id: SLIP-071
title: "Marketing blocks III: video testimonial, team grid, pricing table, audio embed"
epic: 7
priority: P1
estimate_hours: 16
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p1"]
depends_on: ["SLIP-070"]
---

**Context.** The second marketing block set covers richer media and
conversion surfaces that the Axial references use.

**Scope.**
- `VideoTestimonial` (poster, play control, caption, transcript slot).
- `TeamGrid` (person cards, role, social links, optional bio).
- `PricingTable` (tiers, features, highlight, monthly/annual toggle).
- `AudioEmbed` (native audio, title, transcript link, no autoplay).

**Acceptance criteria**

- [ ] Video and audio have captions/transcripts and keyboard controls.
- [ ] Pricing is responsive and readable at 320px.
- [ ] No autoplay; reduced-motion respected.
- [ ] Manifests, tests, axe, docs, registry/LLM output.
- [ ] Theme tokens only; no hardcoded palette.

**Out of scope.** Hosting or uploading media.
