---
id: SLIP-062
title: "Localize P1 core component labels"
epic: 6
priority: P1
estimate_hours: 8
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:feature", "p1"]
depends_on: ["SLIP-061"]
---
**Context.** Remaining core components still expose English defaults.

**Scope:** `Autocomplete` (clear input, suggestions), `Breadcrumb` (landmark), `DatePicker` (clear), `FileUpload` (selected files, remove), `Search` (empty text), `CommandPalette` (default placeholder), `Toast` (close/region), `Spinner` and `Skeleton` (loading label).

**Acceptance criteria**
- [x] Each component accepts an optional label or aria-label prop.
- [x] Defaults preserve current behavior and snapshots.
- [x] Manifests and accessibility notes are updated.
- [x] Tests cover at least one override per component.
- [x] No component is forced into a client boundary solely for i18n.

**Status: Done (2026-11-07).**

- `Autocomplete`: `clearLabel`, `suggestionsLabel`.
- `Breadcrumb`: `label`.
- `DatePicker` / `TimePicker`: `clearLabel`.
- `FileUpload`: `selectedFilesLabel`, `removeLabel(file)`, `uploadingLabel(file)`.
- `Search`: `listLabel` (falls back to the input `aria-label`, then `Search results`).
- `CommandPalette`: `dialogLabel`, `listLabel`, `emptyText`.
- `Toaster`: `dismissLabel`.
- `Skeleton`: `label` (opt-in `status` region; stays decorative when unset).
- `AppShell`: `openNavigationLabel`, `navigationTitle`.
- `Spinner` already exposed `label`; `Search` already exposed `emptyText` and `placeholder`.

Evidence: one override test per component, core suite 594 pass, AI
CommandPalette 9 pass, `pnpm validate:manifests` 100 valid with no
TypeScript↔manifest drift. Generated registry/LLM pages are refreshed by the
docs build; the in-flight marketing-component work regenerates the shared
indexes.
