---
"@slipstream-ui/core": minor
"@slipstream-ui/ai": minor
"@slipstream-ui/themes": minor
---

feat: form-control contrast, overlay polish and density options

Light-mode fixes

- `createTheme()` now records `colorScheme` and `themeToCssVariables()` emits
  `color-scheme`, so native chrome (scrollbars, checkboxes, radios, the date
  picker panel) follows the theme instead of a dark OS preference. The docs
  theme pins `color-scheme: light` on `:root` for the same reason.
- `Checkbox` and `Radio` set `accent-primary`, so the checked fill is the brand
  colour instead of the UA accent.
- `RangeSlider` gives the thumb a primary fill with a background-coloured ring
  and a `md` shadow, and the unfilled rail uses `border` instead of `muted`, so
  the control reads on a white page.

New props

- `Tooltip` gains `variant: 'default' | 'inverse'` — the inverse surface is
  navy in light mode and white in dark mode.
- `Select` gains `labelHidden` for filter bars and toolbars: the label stays the
  accessible name but no longer pushes the control out of alignment.
- `FilterChips` gains `size: 'sm' | 'md' | 'lg'`.
- `Message` gains `density` and `surface`; `Conversation` gains `density` and
  `messageSurface`; `PromptInput` gains `density` and `surface`. Together they
  cover tighter chat layouts and borderless or tinted bubbles.
- `StreamingIndicator` gains `size`, `tone`, `dotCount` and `showLabel`.

Visual fixes

- `Timeline` draws one connector rail per item that starts at the dot's bottom
  edge and runs into the next dot; the flex-column connector left a gap at each
  item boundary.
- `Drawer` paints the backdrop (`bg-background/80`) and fades it with the panel,
  so page content no longer flashes through during close.
- `Accordion` keeps the panel mounted through a 300ms grid-row and opacity
  transition, so collapse animates instead of disappearing on the closing
  frame.
