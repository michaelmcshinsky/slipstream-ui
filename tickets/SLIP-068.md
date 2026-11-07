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
- [x] Playground wraps components in `I18nProvider`.
- [x] Locale/direction toggle persists and updates `documentElement`.
- [x] Add a pseudo-locale (`en-XA`) for layout stress.
- [ ] CI runs key-parity and axe checks for `en` and `ar`.
- [ ] Add a visual-regression job for the shell and forms.

**Status: Partial (2026-11-07).**

Shipped:
- `pseudoMessages` / `PSEUDO_LOCALE` in `@slipstream-ui/i18n`: every string is
  bracketed and vowel-expanded, with the same key tree as `en`.
- `I18nProvider` accepts `pseudo` and exposes it on the context.
- Playground persists the pseudo toggle in `localStorage`, reloads, and renders
  translated copy under `en-XA`.
- Deep key-parity test for the pseudo catalog.

Remaining:
- An axe sweep that renders the docs and starter shells in `en` and `ar` in CI.
  The starter already has an axe assertion; the docs audit scripts remain manual.
- A visual-regression job for the shell and forms.
