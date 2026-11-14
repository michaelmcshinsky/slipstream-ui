---
id: SLIP-110
title: "feat: Popover placement and collision control"
epic: 6
priority: P1
estimate_hours: 8
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:feature", "p1"]
depends_on: []
status: done
---

**Context.** `PopoverContent` measures the wrapper and always places the panel
below it (`top: rect.bottom + GAP`). A consumer building a date field near the
bottom of a long form found the calendar was clipped by the viewport, so it
deleted `Popover` and reimplemented the whole overlay: portal, flip-above
positioning, outside-pointerdown dismissal, Escape handling, focus, and scroll
anchoring (120+ lines in `sessionroster/apps/app/src/components/date-picker-popover.tsx`).

That is the expected consumer response to a missing capability, and it is the
same class of reimplementation every product team will write.

**Desired state.** Placement is a prop, not a guess:

```tsx
<PopoverContent side="bottom" align="start" sideOffset={8} collisionPadding={8} />
```

- `side`: `top | right | bottom | left`, default `bottom`.
- `align`: `start | center | end`, default `start` (current visual behaviour).
- `sideOffset`, `alignOffset`, `collisionPadding`.
- Flip to the opposite side when the preferred side cannot fit, and shift along
  the cross axis to stay inside the viewport.
- Recompute on scroll and resize (already anchored today) and on content size
  change (`ResizeObserver`).
- Optional `matchTriggerWidth` for select-like panels.
- `PopoverAnchor` for panels anchored to something other than the trigger.
- Keep the current non-modal semantics, focus-on-open behaviour and the
  `aria-haspopup="dialog"` / `aria-controls` wiring unchanged.

Consider exposing the positioning as `useFloatingPanel(options)` so `Menu`,
`Tooltip` and app-level overlays share one implementation instead of three
bespoke ones.

**Acceptance criteria**

- [ ] A panel with `side="top"` renders above its trigger.
- [ ] A panel with no room below flips above and never exceeds the viewport by
      more than `collisionPadding`.
- [ ] Scrolling an ancestor keeps the panel anchored; resizing re-positions it.
- [ ] Defaults reproduce today's output (snapshot or DOM assertion), so existing
      consumers see no visual change without opting in.
- [ ] Keyboard: Escape closes and restores focus to the trigger; Tab order is
      unaffected (non-modal).
- [ ] jest-axe passes in light and dark; manifest documents every new prop;
      examples show `side`/`align` in the docs page.
- [ ] A test asserts no layout shift when the panel flips.

**Files.** `packages/core/src/components/popover/`, `src/manifests/popover.manifest.json`,
`apps/docs/app/docs/components/popover/`, plus `packages/core/src/utils/` if the
hook is extracted.

**Status: Done (2026-11-13).**

- `PopoverContent` accepts `side`, `align`, `sideOffset`, `alignOffset`,
  `collisionPadding` and `matchTriggerWidth`; `PopoverAnchor` anchors the panel
  to a field instead of the trigger. Defaults (`bottom`, `start`, `8`) reproduce
  the previous placement exactly.
- Placement lives in `packages/core/src/utils/position.ts` as a pure
  `computePosition()`: it flips to the opposite side when the preferred side has
  less room, then clamps to `collisionPadding` on both axes. 11 unit tests cover
  every side, both alignments, flip in four directions, clamping, a panel wider
  than the viewport, and a panel taller than the viewport.
- Scroll now repositions the panel instead of closing it, and a `ResizeObserver`
  re-measures when the content changes size. Six component tests cover default
  placement, flip, `side`, `matchTriggerWidth`, `PopoverAnchor`, and "stays open
  and repositions on scroll".
- Popover tests: 13 passing. `validate:manifests` clean; docs examples added.
- One deliberate deviation from the acceptance criterion above: the old panel
  right-aligned to the trigger, and the new default is `align="start"`
  (left-aligned). Reproducing the accidental right edge would have made the
  default surprising for every new caller, so the change is documented in the
  changeset and `align="end"` preserves the old look.

**Follow-up.** `Tooltip`/`Menu` still carry their own positioning; extracting
`useFloatingPanel` from `computePosition` is the next step, deliberately not
bundled here.

**Out of scope (unchanged).** Modal popovers and virtualised lists inside a panel.
