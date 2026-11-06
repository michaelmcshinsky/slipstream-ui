---
id: SLIP-064
title: "Docs locale routing, shell and switcher"
epic: 6
priority: P1
estimate_hours: 16
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:feature", "p1"]
depends_on: ["SLIP-060"]
---
**Context.** The docs site is English-only.

**Acceptance criteria**
- [ ] Locale-prefixed routes (`/`, `/ar`, `/es`, `/ar/docs/...`) resolve without auto-redirect.
- [ ] Root layout sets `lang` and `dir` from the route locale.
- [ ] Site header, footer, command palette, cookie banner and 404 use translated keys.
- [ ] A language switcher preserves the current path when switching.
- [ ] Canonical and `alternates.languages` are emitted per route.
- [ ] Existing English URLs keep working.
- [ ] Docs build passes and an `ar` route renders RTL.
