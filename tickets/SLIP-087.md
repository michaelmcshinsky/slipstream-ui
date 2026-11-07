---
id: SLIP-087
title: "Localize the new marketing, data and marketplace surfaces"
epic: 7
priority: P2
estimate_hours: 16
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p2"]
depends_on: ["SLIP-070", "SLIP-073", "SLIP-075"]
---

**Context.** The new components ship English defaults. Axial serves the U.S. and
Canada, so French is a realistic requirement for public pages and member flows.

**Scope.**
- Route user-facing defaults through `@slipstream-ui/i18n` or documented label props.
- Add French (`fr`) catalogs for marketing, filter, marketplace and form strings.
- Cover number, currency, percent and date formatting in data cards.
- RTL audit for the new components.

**Acceptance criteria**
- [ ] No new component hardcodes user-facing copy without a label override.
- [ ] `en` and `fr` catalogs reach key parity in CI.
- [ ] Currency and percent values format with the active locale.
- [ ] Marketing blocks render correctly in RTL.
- [ ] Tests cover at least one non-English locale for each surface group.
- [ ] Missing keys fall back to English with a development warning.

**Technical notes**
- Reuse `@slipstream-ui/i18n`; do not add a second runtime.
- Keep manifest keys and code samples English.
