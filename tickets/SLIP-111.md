---
id: SLIP-111
title: "feat: Calendar date grid for date pickers"
epic: 6
priority: P1
estimate_hours: 12
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:feature", "p1"]
depends_on: ["SLIP-110"]
status: done
---

**Context.** `DatePicker` wraps a native `<input type="date">`. Its popup is
browser chrome: Safari, Chrome and Firefox render different calendars, none of
them themeable, and the visible month cannot be controlled. A consumer that
needs a consistent, brandable picker (staff booking forms, customer portal) has
to build the grid itself — 42 cells, locale labels, week start, month paging,
min/max, and keyboard handling — about 150 lines plus tests.

The library already owns every primitive that grid is made of (`Button`,
`Popover`, tokens), so consumers are hand-assembling the product's most
date-heavy surface.

**Desired state.** Two components, one behaviour:

```tsx
<Calendar
  value="2026-11-13"            // ISO YYYY-MM-DD, business-local
  onValueChange={setDate}
  min="2026-01-01"
  max="2026-12-31"
  weekStartsOn={0}              // 0 Sun, 1 Mon (default from locale)
  locale="en-US"
/>

<DatePickerPopover value={date} onValueChange={setDate} />
```

`Calendar` requirements:

- ISO string contract; no `Date` objects cross the boundary, so a browser in a
  different timezone cannot shift the selected day.
- Six-week grid with leading/trailing days marked, selected and today states,
  disabled days from `min`/`max`/`isDateDisabled`.
- Keyboard: ArrowLeft/Right/Up/Down (±1/±7 days), Home/End (week bounds),
  PageUp/PageDown (month), Enter/Space to select, Escape to close when used in
  a popover. One roving `tabIndex`, focus follows the active day.
- Month paging clamps the day (Jan 31 → Feb 28/29), never rolls into March.
- `aria-selected` on days, an accessible grid (`role="grid"` with rows, or a
  documented `group` fallback), and a live month label.
- Locale-aware labels, weekday order, and `Intl` month names.

`DatePickerPopover` composes `Popover` + `Calendar` and keeps the trigger
`aria-haspopup="dialog"`.

**Acceptance criteria**

- [ ] Keyboard-only selection works end to end; a test drives arrows, Home/End,
      PageUp/PageDown and selection.
- [ ] PageDown from `2026-01-31` selects `2026-02-28`; from `2028-01-31`,
      `2028-02-29`.
- [ ] `en-US` starts Sunday; `es-ES` starts Monday.
- [ ] `min`/`max` disable out-of-range days without removing them from the grid.
- [ ] jest-axe passes for `Calendar` and `DatePickerPopover`, light and dark.
- [ ] Manifest documents every prop; docs page pairs `page.tsx` + `demo.tsx`;
      nav and search index updated.
- [ ] Registry and LLM docs regenerated; component counts updated by the
      generator, not by hand.

**Files.** `packages/core/src/components/calendar/`, `.../date-picker-popover/`,
`src/manifests/calendar.manifest.json`, `date-picker-popover.manifest.json`,
`apps/docs/app/docs/components/{calendar,date-picker-popover}/`.

**Status: Done (2026-11-13).**

- `packages/core/src/utils/date.ts` holds the date math: key parsing with
  impossible-date rejection, `addDays`, month paging that clamps the day,
  `startOfWeek`, `calendarWeeks`, `moveDateKey`, and Intl labels. 14 unit tests:
  leap years, `2026-02-30`, month-end clamping, both week starts, locale order.
- `Calendar` renders a six-week `role="grid"` with rows, columnheaders and
  gridcells; `aria-selected` per cell, `aria-current="date"` for today, and one
  roving tab stop. Keyboard: arrows (±1/±7), Home/End, PageUp/PageDown, Enter.
  `min`/`max`/`isDateDisabled` mark days `aria-disabled` and keep them visible.
  12 component tests, including every key, month paging with clamping, disabled
  days, uncontrolled use, outside-day hiding and axe.
- `DatePickerPopover` composes `Popover` + `Calendar` with an ISO hidden input
  for native forms, focus restoration to the trigger, and `side`/`align`
  passthrough. 10 tests, including keyboard selection and axe.
- Registry and LLM docs regenerated (112 components, 95 core); component counts
  updated by the generator. Docs pages, nav and search index added.

**Out of scope (unchanged).** Range selection, non-ISO time zones, recurrence.
