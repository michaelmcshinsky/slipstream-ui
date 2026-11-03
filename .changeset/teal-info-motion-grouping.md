---
"@slipstream-ui/core": minor
"@slipstream-ui/ai": minor
"@slipstream-ui/themes": minor
"@slipstream-ui/cli": patch
---

Minor release prep: grouping components, overlay motion, and theme polish.

New components (core):
- InputGroup + InputGroupAddon — flush left/right addons (ghost/muted
  surfaces) behind one outer border; FormField wiring forwards to the
  nested field; addon padding on both sides so affixes breathe next to
  the input
- CheckboxGroup + CheckboxGroupItem — multi-select counterpart of
  RadioGroup (shared name, legend, string[] selection)
- ButtonGroup — joined segments with collapsed borders
- RadioCard — whole clickable section per option: native circle hidden
  (sr-only), selection via has-[:checked] border+tint, optional rounded
  corners (rounded=false for square tiles)

New props (core):
- Dialog/Drawer `animate` — optional fade (dialog) / side-aware slide
  (drawer) in+out via usePresence exit window; reduced motion respected;
  off by default
- RadioGroup/CheckboxGroup `orientation` (vertical|horizontal) and
  group-level `error` (role=alert inside the single fieldset)
- Button semantic variants success/warning/info with audited AA
  foregrounds; Tabs rounded variant; Accordion borderless+gap; DataTable
  loadingRows; Confirmation approveVariant/rejectVariant/showActions (ai)
- GapValue accepts tokens or exact pixels across Flex/Grid/Form/
  FormLayout/Accordion

Theme:
- Info color retuned from sky (198) to teal (176) in both modes —
  light-mode info now passes WCAG AA (4.04 → 6.36 against ink);
  updated in docs/app/playground globals, themes create-theme, CLI init
  template, and installation docs
