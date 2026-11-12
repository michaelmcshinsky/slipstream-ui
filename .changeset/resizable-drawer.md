---
"@slipstream-ui/core": minor
---

Resizable `Drawer` for wide detail panes.

`Drawer` accepts `resizable` on left and right drawers. The inner edge becomes a focusable `separator` handle: drag it, or use Arrow keys (16px), Shift+Arrow (64px) and Home/End (bounds). `minWidth` (240), `maxWidth` (960) and `defaultWidth` bound the width, and `onWidthChange` fires when a resize commits so the width can be persisted. `resizeLabel` names the handle for assistive tech.

Top and bottom drawers ignore `resizable`, since their extent is controlled by `height`.
