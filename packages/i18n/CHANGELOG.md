# @slipstream-ui/i18n

## 0.4.0

### Minor Changes

- [#101](https://github.com/michaelmcshinsky/slipstream-ui/pull/101) [`8a5b115`](https://github.com/michaelmcshinsky/slipstream-ui/commit/8a5b11558942b43708241d7a5a81282586fff1a9) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Neutral graphite dark palette and localized docs navigation.
  
  - `createTheme` dark mode replaces the navy-tinted surface ladder with a
    neutral graphite ladder (`background < card < popover`) and matching
    near-black ink on solid semantic fills. Light mode tokens are unchanged.
  - The `init` command writes the same graphite dark values, so generated
    projects match the shipped theme.
  - `@slipstream-ui/i18n` adds `nav` and marketing message namespaces across
    `ar`, `en`, `es`, `ja`, `ko`, `ru` and `zh`, and the locale switcher now
    reads the active locale label from the message catalog.

## 0.3.1

### Patch Changes

- [`6945e41`](https://github.com/michaelmcshinsky/slipstream-ui/commit/6945e4131dedc792a6e2cf512a9f4cdc1d0d3658) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Localize the remaining P1 component labels with optional props and English
  defaults: Autocomplete clear/suggestions, Breadcrumb landmark, DatePicker and
  TimePicker clear, FileUpload selected/remove/uploading, Search list label,
  CommandPalette dialog/list/empty, Toaster dismiss, Skeleton opt-in status
  label, and AppShell mobile-navigation labels. Message and Reasoning now accept
  `formatTime` or a BCP-47 `locale` for timestamps, and the AI Chat Starter
  passes the active locale. The i18n package gains an `en-XA` pseudo-locale
  catalog and providers accept `pseudo`, with a persisted playground toggle.

## 0.3.0

### Minor Changes

- [`61dd8ce`](https://github.com/michaelmcshinsky/slipstream-ui/commit/61dd8ce257b6c405908a033947c394e352c9a452) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add Korean, Japanese, Russian and Simplified Chinese catalogs, extend the
  locale switcher to seven languages, and localize the changelog page content.

## 0.2.0

### Minor Changes

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the typed i18n runtime with English, Arabic and Spanish catalogs, RTL
  direction helpers, Intl formatters and a client-only React entry. Localize the
  AI Chat Starter and add label overrides to `Reasoning` and `ToolCall`.
