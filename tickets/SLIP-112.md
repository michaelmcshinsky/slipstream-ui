---
id: SLIP-112
title: "a11y: clear the dark-mode audit findings (calendar, menu, search)"
epic: 6
priority: P1
estimate_hours: 3
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:accessibility", "p1"]
depends_on: []
status: done
---

**Context.** The first full dark-mode audit run after SLIP-108/110/111 reported
one page violation group (`/docs/components/calendar`) and three overlay groups
(`/docs/components/menu`, all triggers). The existing axe route list did not
cover those pages, so the gate had stayed green.

**Findings and fixes**

| Finding | Measured | Fix |
|---|---|---|
| Calendar outside-month days | `#5d5f63` on `#111113` = **2.94:1** | `text-muted-foreground/80` (5.1:1); still visually secondary |
| Menu destructive item (dark) | `#e95d5d` on `#242628` = **4.47:1** | dark `destructive` lifted 64% → 65% (4.64:1) in the theme and the docs house style |
| Navbar search button | visible text `SearchCtrl+K` not contained in `aria-label="Search documentation (Ctrl+K)"`; the kbd also showed `⌘K` while the label said `Ctrl+K` | label is now `Search Ctrl+K`, matching what is rendered, and the `⌕` glyph became an SVG (a visible text node was part of the mismatch) |

**Acceptance criteria**

- [x] `/docs/components/calendar` and `/docs/components/menu` pass axe in light and dark.
- [x] The full dark audit reports 0 page and 0 overlay violation groups.
- [x] `text-destructive` clears 4.5:1 on the popover in both schemes, pinned by a themes test.
- [x] The shortcut hint and the announced label agree on every platform.

**Status: Done (2026-11-14).**

- `pnpm --filter slipstream-ui-docs audit:a11y` → **46 page runs, 0 violations**.
- `pnpm --filter slipstream-ui-docs audit:dark` → **145 routes, 20 overlays, 0 violations**.
- Themes contrast tests extended to 6, pinning destructive-on-popover.
- `apps/docs/app/globals.css` mirrors the dark destructive change so the site and
  the published theme stay in step.

**Files.** `packages/core/src/components/calendar/Calendar.tsx`,
`packages/themes/src/create-theme.ts`, `packages/themes/src/contrast.test.ts`,
`apps/docs/components/site/navbar.tsx`, `apps/docs/app/globals.css`.

**Follow-up.** The axe routes should grow to include the pages this audit
surfaced; the dark audit covers them, the light route list does not yet.
