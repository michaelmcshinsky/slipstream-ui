---
"@slipstream-ui/core": patch
---

Radio accepts the native `onChange` handler again, matching Checkbox and Select. Both `onChange` and `onCheckedChange` fire, so react-hook-form `register()` and plain native handlers work without a Controller.
