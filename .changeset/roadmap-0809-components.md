---
"@slipstream-ui/core": minor
---

Roadmap 0.8-0.9: migration aliases, the remaining prop gaps and a mobile bottom tab bar.

**Migration aliases** (canonical prop wins when both forms are passed):

- `PageHeader` accepts `subtitle` as an alias for `description`.
- `MetricCard` accepts `title` and `description` as aliases for `label` and `hint`; `label` is now optional when `title` is passed.
- `AuthLayout` accepts `subtitle` and `logo` as aliases for `description` and `brand`.
- `Drawer` accepts `onClose` as a close-request alias for `onOpenChange(false)`; `onOpenChange` is now optional when `onClose` is passed.

**New props:**

- `EmptyState.action` accepts `{ label, onClick?, href?, variant? }` and renders the Button (or an anchor styled as one) for you. Rendered nodes still work.
- `Accordion.items` takes `{ id, title, content, disabled? }[]` and renders one section per entry instead of `children`.
- `AuthLayout.maxWidth` overrides the card width with pixels or any CSS width.
- `Badge.size` adds `sm` / `md` / `lg` to every variant.
- `MetricCard.tone` colors the value (`success` / `warning` / `destructive`); `MetricCard.loading` renders an `aria-busy` skeleton.

**New component:**

- `BottomNav` — mobile bottom tab bar for 3-5 primary destinations: `aria-current="page"` on the active tab, count badges, disabled tabs, a router `linkComponent`, 44px minimum targets and safe-area padding.

Every addition ships a `COMPONENT_MANIFEST` entry, docs page rows, tests and regenerated registry/LLM output.
