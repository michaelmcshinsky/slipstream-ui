---
"@slipstream-ui/core": patch
---

`Badge` gains quiet status surfaces and a status dot for metadata chips: new `outline-success`/`outline-warning`/`outline-info`/`outline-danger` variants (tinted border + ink text, subtle tint on hover) and a `dot` prop that renders a leading dot colored to the variant. Works with `asChild` via Radix `Slottable`. Implements consumer feedback from utah-dance.
