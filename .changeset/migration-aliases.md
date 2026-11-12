---
"@slipstream-ui/core": minor
---

Migration aliases for `PageHeader`, `MetricCard`, `AuthLayout` and `Drawer`.

- `PageHeader` accepts `subtitle` as an alias for `description`.
- `MetricCard` accepts `title` and `description` as aliases for `label` and
  `hint`; `label` is now optional when `title` is passed.
- `AuthLayout` accepts `subtitle` and `logo` as aliases for `description` and
  `brand`.
- `Drawer` accepts `onClose` as a close-request alias for
  `onOpenChange(false)`; `onOpenChange` is now optional when `onClose` is
  passed.

The canonical prop wins when both forms are passed, so existing code keeps its
current behavior.
