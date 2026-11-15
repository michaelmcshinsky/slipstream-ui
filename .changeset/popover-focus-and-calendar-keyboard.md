---
"@slipstream-ui/core": patch
---

fix(core): restore focus and measurement on the popover, and keyboard focus in Calendar

- `PopoverContent` returns focus to the trigger on Escape; previously focus fell to
  `<body>` and a keyboard user lost their place.
- The dialog's `aria-labelledby` now reads the rendered trigger, so a trigger with an
  explicit `id` no longer produces a dangling reference, and an anchor-only panel emits
  no `aria-labelledby` at all.
- A popover that starts open (controlled `open`) measures once the anchor ref is
  attached. On first mount the panel previously stayed `visibility: hidden` forever.
- `Calendar` moves DOM focus with its roving tab stop when a keyboard user tabs in and
  navigates without `autoFocus`; only the `tabIndex` used to move before.
- `addDays` and `startOfWeek` return an unparseable key unchanged instead of computing
  from 1970-01-01.
