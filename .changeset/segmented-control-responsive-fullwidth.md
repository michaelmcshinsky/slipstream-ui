---
'@slipstream-ui/core': patch
---

`SegmentedControl` `fullWidth` now accepts a breakpoint (`'sm' | 'md' | 'lg' | 'xl' | '2xl'`) in addition to `boolean`: the string form fills the container below that breakpoint and hugs content at and above it, covering the responsive "full-width on mobile, compact on desktop" case without a wrapper element.
