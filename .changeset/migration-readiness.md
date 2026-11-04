---
"@slipstream-ui/core": minor
---

Migration-readiness batch: shell, app patterns, async inputs, files, timelines.

New components (core):
- AppShell + Sidebar — responsive frame with a sectioned rail, sticky
  header, scrolling main and a built-in mobile Drawer; router-agnostic
  via `linkComponent` and `activeHref` (aria-current)
- EmptyState, PageHeader, MetricCard, PasswordInput, AuthLayout,
  FilterBar — the app-pattern set every dashboard/website was hand-rolling
- DatePicker, TimePicker — native date/time fields with ISO / HH:MM
  contracts and clear affordances
- Stepper — ordered-list wizard indicator with aria-current=step and
  text states (not color-only)
- FileUpload — native input + drop zone + removable list + per-file
  progress bars
- Timeline — chronology on ordered-list semantics

New APIs:
- Imperative toasts: `toast.success/error/warning/info`, `toast.dismiss`,
  `toast.clear` + `<Toaster position richColors />` (useSyncExternalStore;
  provider/useToast unchanged)
- Dialog: `size` presets (sm..2xl), `footer`, `scrollable`, `header` slot
  and composed parts (DialogHeader/DialogTitle/DialogDescription/
  DialogBody/DialogFooter) that pick up the aria ids
- Select: `groups` (optgroups), `placeholder`, `multiple` (string[]
  contract)
- Autocomplete: option objects, debounced async `loadOptions` with
  stale-response guard, grouped headings, descriptions, `renderOption`,
  `clearable`
- `asChild` on Card, Badge and MenuItem for router links

Docs: 14 new/expanded component pages, theming gains a documented
z-index ladder, registry/LLM docs regenerate to 71 components.
