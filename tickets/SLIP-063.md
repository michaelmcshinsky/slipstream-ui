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
- [x] `Message` and `Reasoning` accept `formatTime?: (date: Date) => string` or a BCP-47 `locale` prop.
- [x] Defaults remain identical when no prop is passed.
- [x] Manifests document the prop.
- [x] Tests cover a fixed localized format and the default.
- [x] The starter passes the active locale/formatter.

**Status: Done (2026-11-07).**

- `Message`: `formatTime`, `locale`.
- `Reasoning`: `formatTime`, `locale` (applies to step timestamps).
- Defaults still call `toLocaleTimeString()` with no arguments when neither prop is set.
- Starter: `Message` and both `Reasoning` usages pass `locale` from `useI18n()`.
- Evidence: AI suite 153 pass, `Message`/`Reasoning` timestamp tests cover a fixed
  formatter and the default; manifests pass validation.
