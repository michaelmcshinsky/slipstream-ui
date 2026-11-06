---
id: SLIP-068
title: "Playground locale toggle and RTL/CI audit"
epic: 6
priority: P2
estimate_hours: 8
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:feature", "p2"]
depends_on: ["SLIP-060"]
---
**Context.** The playground is internal but useful for testing direction and labels.

**Acceptance criteria**
- [ ] Playground wraps components in `I18nProvider`.
- [ ] Locale/direction toggle persists and updates `documentElement`.
- [ ] Add a pseudo-locale (`en-XA`) for layout stress.
- [ ] CI runs key-parity and axe checks for `en` and `ar`.
- [ ] Add a visual-regression job for the shell and forms.
