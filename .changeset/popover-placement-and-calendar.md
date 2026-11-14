---
"@slipstream-ui/core": minor
"@slipstream-ui/ai": minor
"@slipstream-ui/themes": minor
---

feat(core): Popover placement and a Calendar date grid

`PopoverContent` gained `side`, `align`, `sideOffset`, `alignOffset`,
`collisionPadding` and `matchTriggerWidth`, plus a `PopoverAnchor` element. The
panel now flips to the opposite side when the preferred one cannot fit, clamps
inside the viewport, and repositions on scroll instead of closing.

Note: the old panel right-aligned to the trigger; the default is now
`align="start"`, which left-aligns. Consumers that relied on the previous
right edge can pass `align="end"`.

New `Calendar` renders a six-week month grid with ISO `YYYY-MM-DD` values,
min/max, `isDateDisabled`, locale-aware labels, week start, and keyboard
navigation (arrows, Home/End, PageUp/PageDown, Enter) with a single roving tab
stop. `DatePickerPopover` composes `Popover` + `Calendar` for a themed date
field that still posts an ISO value through a hidden input.
