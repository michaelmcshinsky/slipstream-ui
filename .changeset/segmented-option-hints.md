---
'@slipstream-ui/core': patch
---

`SegmentedOption` gains an optional `hint` string: rendered as a small muted marker after the label and exposed via `aria-description`, so supplementary notes (e.g. "no Pro-Am ladder published") stay visible without changing the segment's accessible name.
