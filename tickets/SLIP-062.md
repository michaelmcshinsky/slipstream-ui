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
- [ ] Each component accepts an optional label or aria-label prop.
- [ ] Defaults preserve current behavior and snapshots.
- [ ] Manifests and accessibility notes are updated.
- [ ] Tests cover at least one override per component.
- [ ] No component is forced into a client boundary solely for i18n.
