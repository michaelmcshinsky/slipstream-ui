---
"@slipstream-ui/core": patch
---

`FormLayout` gains responsive grids and fieldset styling hooks: `columns` now accepts per-breakpoint counts (`{ base: 1, md: 2 }`) so consumers stop undoing `grid-cols-2` via className, and `legendClassName`/`descriptionClassName` expose the legend and description styling. Implements consumer feedback from utah-dance.
