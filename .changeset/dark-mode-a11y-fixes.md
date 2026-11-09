---
"@slipstream-ui/core": patch
---

Fix WCAG 2.2 issues found by the dark-mode audit.

- `Separator` only exposes `aria-orientation` when it has the `separator` role.
- `Tabs` only emits `aria-controls` when the referenced panel is rendered.
- `Timeline` muted items keep token colors instead of dimming with opacity.
- `RangeSlider` inputs and `DatePicker`/`DateRangePicker`/`TimePicker` clear
  buttons meet the 24px target-size minimum.
- `SelectMenu` exposes the select-only `combobox` role on its trigger and makes
  the scrollable listbox focusable, so the open state is valid ARIA.
