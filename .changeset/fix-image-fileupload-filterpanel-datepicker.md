---
'@slipstream-ui/core': patch
---

Fix four component defects: `DatePickerPopover` now forwards `aria-describedby`/`aria-invalid` to its trigger so `FormField` hint/error wiring reaches assistive tech; `Image` restarts its `src -> fallbackSrc -> fallback` chain when the URLs change instead of sticking on a stale fallback; `FileUpload` keys and removes entries by File identity so same-named files stay distinct; `FilterPanel` identifies sections by index so duplicate titles no longer collide on open state or DOM ids.
