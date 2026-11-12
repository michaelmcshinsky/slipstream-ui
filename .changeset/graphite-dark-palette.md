---
"@slipstream-ui/themes": patch
"@slipstream-ui/cli": patch
"@slipstream-ui/i18n": minor
---

Neutral graphite dark palette and localized docs navigation.

- `createTheme` dark mode replaces the navy-tinted surface ladder with a
  neutral graphite ladder (`background < card < popover`) and matching
  near-black ink on solid semantic fills. Light mode tokens are unchanged.
- The `init` command writes the same graphite dark values, so generated
  projects match the shipped theme.
- `@slipstream-ui/i18n` adds `nav` and marketing message namespaces across
  `ar`, `en`, `es`, `ja`, `ko`, `ru` and `zh`, and the locale switcher now
  reads the active locale label from the message catalog.
