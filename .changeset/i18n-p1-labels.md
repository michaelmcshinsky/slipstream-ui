---
"@slipstream-ui/core": patch
"@slipstream-ui/ai": patch
"@slipstream-ui/i18n": patch
---

Localize the remaining P1 component labels with optional props and English
defaults: Autocomplete clear/suggestions, Breadcrumb landmark, DatePicker and
TimePicker clear, FileUpload selected/remove/uploading, Search list label,
CommandPalette dialog/list/empty, Toaster dismiss, Skeleton opt-in status
label, and AppShell mobile-navigation labels. Message and Reasoning now accept
`formatTime` or a BCP-47 `locale` for timestamps, and the AI Chat Starter
passes the active locale. The i18n package gains an `en-XA` pseudo-locale
catalog and providers accept `pseudo`, with a persisted playground toggle.
