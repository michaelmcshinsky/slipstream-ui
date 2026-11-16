---
"@slipstream-ui/core": minor
"@slipstream-ui/ai": minor
"@slipstream-ui/themes": minor
---

feat(core): add Image, nested SiteHeader menus, and a primary ink token

`Image` fills the last media gap in the library: `src` → `fallbackSrc` →
`fallback` node, intrinsic `width`/`height` on every render, `decoding="async"`,
and `priority` for the single LCP image. It is manifested with the fallback and
alt-text rules.

`SiteHeader` accepts nested `columns` on an item. Desktop renders a disclosure
trigger with `aria-expanded`/`aria-controls`, opens on hover or click, stays
open while tabbing, and closes on Escape or an outside pointer. The mobile
drawer renders the same groups as native `<details>` disclosures.

`primary-ink` joins the theme contract: a darker primary for text roles on
light surfaces and `primary/10` tints, and the lightened primary in dark mode.
`Link`, the Sidebar active item, `PageHeader`/`SectionHeading` eyebrows,
`ArticleCard`/`CTASection` eyebrows, and the highlighted `ComparisonTable`
column now use it. `bg-primary` is unchanged for fills.

The dark-mode \destructive\ text token is lightened slightly so it clears 4.5:1 on the popover surface; the previous value missed by 0.002.
