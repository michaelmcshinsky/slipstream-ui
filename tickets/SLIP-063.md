---
id: SLIP-063
title: "Localize AI timestamps and remaining AI labels"
epic: 6
priority: P1
estimate_hours: 5
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:feature", "p1"]
depends_on: ["SLIP-060"]
---
**Context.** `Message` and `Reasoning` call `toLocaleTimeString()` without a locale. `MessageActions`, `Confirmation`, `PromptInput` and `StreamingIndicator` already accept labels and are wired in the starter.

**Acceptance criteria**
- [ ] `Message` and `Reasoning` accept `formatTime?: (date: Date) => string` or a BCP-47 `locale` prop.
- [ ] Defaults remain identical when no prop is passed.
- [ ] Manifests document the prop.
- [ ] Tests cover a fixed localized format and the default.
- [ ] The starter passes the active locale/formatter.
