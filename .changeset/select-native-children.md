---
"@slipstream-ui/core": patch
---

Select now fills its container like Input, and native `<option>`/`<optgroup>` children are a documented fallback: `groups` wins over `options`, and `options` wins over `children`. This lets react-hook-form `register()` spread and dynamic option lists work without converting to the `options` array.
