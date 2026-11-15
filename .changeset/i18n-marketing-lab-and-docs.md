---
"@slipstream-ui/core": minor
"@slipstream-ui/ai": minor
"@slipstream-ui/i18n": minor
---

feat(i18n): localize the marketing lab, chat demo and docs shell

`Stepper` accepts `labels` (`completed`, `current`, `upcoming`) so the
screen-reader state suffix is no longer English-only. `DataTable` accepts
`selectedLabel` (`{count} selected` by default) for the selection summary
above the table. `Conversation` accepts `userLabel`, `assistantLabel` and
`labels` (`transcript`, `responseComplete`, `loadEarlier`, `loadingEarlier`,
`latest`, `download`) and forwards the role labels to each `Message`.

The docs shell gained a `site.translation` message group used by the
"this page is English only for now" notice, and `LocaleSwitcher` now uses
logical padding and inset so the caret stays on the trailing side in RTL.
