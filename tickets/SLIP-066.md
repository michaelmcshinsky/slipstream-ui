---
id: SLIP-066
title: "Dashboard locale shell and user preference"
epic: 6
priority: P2
estimate_hours: 24
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:feature", "p2"]
depends_on: ["SLIP-060"]
---
**Context.** `apps/app` auth, billing, team and admin surfaces are English.

**Acceptance criteria**
- [ ] Root layout reads locale from cookie, falling back to `User.locale`.
- [ ] A Prisma migration and profile setting store the user locale.
- [ ] Dashboard header/nav, auth screens, billing, team and admin labels are translated.
- [ ] Validation/API errors map stable codes to localized messages.
- [ ] Dates and currency use `Intl` with the active locale.
- [ ] Tables and drawers render correctly in RTL.
- [ ] `en`/`ar` axe and visual checks pass.
