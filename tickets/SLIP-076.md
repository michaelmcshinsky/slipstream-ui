---
id: SLIP-076
title: "App shell II: topbar, user menu, notifications, saved search and inbox"
epic: 7
priority: P1
estimate_hours: 26
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p1"]
depends_on: ["SLIP-075"]
---

**Context.** `AppShell` has a sidebar and a single header slot. Axial-style
dashboards need a topbar with search, saved searches, notifications, an inbox,
and a user menu.

**Scope.**
- `Topbar` (breadcrumbs, search, actions, user menu).
- `UserMenu` (profile, settings, sign out; keyboard + focus).
- `NotificationMenu` (unread count, list, mark read).
- `SavedSearchMenu` (list, apply, delete).
- `InboxMenu` (compact list, empty state).
- AppShell integration without breaking the existing `header` slot.

**Acceptance criteria**

- [ ] Existing `AppShell` consumers are unchanged by default.
- [ ] Menus trap/restore focus and close on Escape/outside click.
- [ ] Unread counts are announced, not color-only.
- [ ] Works at 390 and 1280; mobile uses a drawer or sheet.
- [ ] Manifests, tests, axe, docs, registry/LLM output.

**Out of scope.** Notification transport or persistence.
