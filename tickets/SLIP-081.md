---
id: SLIP-081
title: "SiteHeader and SiteFooter v2: utility bar, mega menu, contact and newsletter"
epic: 7
priority: P0
estimate_hours: 14
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: ["SLIP-070"]
---

**Context.** `SiteHeader` is a flat bar with no utility row, dropdowns,
announcement or search. `SiteFooter` is fixed to four columns and has no contact,
social or newsletter slots. Axial needs all of these.

**Scope.**
- `SiteHeader` v2: utility bar, nested nav groups with descriptions/icons,
  announcement slot, search/actions, mobile grouped drawer and optional user menu.
- `SiteFooter` v2: variable columns, contact block, social links, newsletter slot,
  status/legal links and responsive stacking.
- Backward-compatible props; existing flat `items` keep working.

**Acceptance criteria**
- [ ] A flat items array still renders exactly as before.
- [ ] Grouped nav opens by keyboard, closes on Escape and outside click, and
      exposes `aria-expanded` / `aria-controls`.
- [ ] The utility bar is hidden from the mobile drawer and remains readable.
- [ ] Footer supports five or more columns without wrapping incorrectly.
- [ ] Announcement bar offset does not overlap sticky headers.
- [ ] Tests cover flat, grouped, mobile and footer variants.
- [ ] Docs include a full marketing header/footer recipe.

**Technical notes**
- Reuse `Menu`, `Drawer`, `Container`, `Button`, `Input`, `SocialLinks`.
- Do not hardcode a brand link label; add `brandHref` and `brandLabel`.
