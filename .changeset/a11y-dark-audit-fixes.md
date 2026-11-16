---
"@slipstream-ui/core": patch
"@slipstream-ui/themes": patch
"@slipstream-ui/ai": patch
---

fix(a11y): dark-mode contrast and naming findings from the full audit

- Calendar outside-month days move from `text-muted-foreground/50` (2.94:1 on
  the dark background) to `/80` (5.1:1).
- Dark `destructive` lifts from 64% to 65% lightness: 4.47:1 → 4.64:1 as text
  on the popover surface.
- The docs search button's accessible name now matches its rendered text, and
  the shortcut hint uses the same string as the label.
