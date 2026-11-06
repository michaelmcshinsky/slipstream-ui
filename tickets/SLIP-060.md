---
id: SLIP-060
title: "Internationalize every app"
epic: 6
priority: P1
estimate_hours: 120
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:feature", "p1"]
depends_on: []
---

**Context.** The AI Chat Starter is localized (en/ar/es, RTL) and
`@slipstream-ui/i18n` ships. Docs, dashboard, playground and component labels
still need work. Full plan: `docs/i18n-plan.md`.

**Acceptance criteria**
- [x] Shared runtime: typed catalogs, interpolation, plurals, Intl formatters, direction.
- [x] Starter: server `lang`/`dir`, cookie, switcher, all shell strings, mock backend and checkout error.
- [x] `Reasoning` and `ToolCall` accept localized labels.
- [ ] P0 component labels: Button, Pagination, DataTable, Dialog, Drawer.
- [ ] Docs: locale-prefixed routes, shell, nav/search, metadata, sitemap, guides.
- [ ] Dashboard: auth/billing/team/admin, emails, currency/date, RTL tables.
- [ ] RTL/visual/SEO audit and pseudo-locale build.
- [ ] Key parity + no-hardcoded-string gates in CI.

**Done when** every app renders correct `lang`/`dir`, no user-facing string is
hardcoded, and `en`/`ar` axe and visual checks pass.
