---
id: SLIP-097
title: "feat: add an AuthLayout split/aside variant"
epic: 6
priority: P2
estimate_hours: 6
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:feature", "p2"]
depends_on: []
status: ready
---

**Context.** `AuthLayout` is a centered card. Consumers with a branded aside
(quote, stats, help link) cannot use it without rebuilding the shell. Alora is
one such consumer and is tracking the dependency as ALORA-001.

**Desired state.** Add a generic `variant: 'centered' | 'split'` (default
`centered`) and an `aside` slot. The split variant keeps the form card, brand,
title, description, and footer, and renders the aside beside it on desktop and
below it on mobile.

**Acceptance criteria**

- [x] The default centered layout is unchanged.
- [x] The split variant is responsive at 390 and 1280.
- [x] The aside is optional; omitting it falls back to centered.
- [x] Keyboard order and focus are correct.
- [x] Manifest, tests, docs, registry, and LLM docs are updated.

**Status: Done (2026-11-07).**

- `variant?: 'centered' | 'split'` (default `centered`) and `aside?: ReactNode`.
- Split uses a single-column grid below `lg` and a two-column grid at `lg`;
  the form column respects the `size` preset.
- Omitting `aside` (or using `centered`) keeps the original centered screen.
- DOM order is form then aside, so keyboard and screen-reader order stay right.
- Tests cover the aside placement, fallback, centered ignore, and axe.
- Docs page has a split demo, props rows, accessibility notes, and type block;
  manifest, registry, and LLM docs regenerate through the build.
- Verified with the AuthLayout test file (7 pass), docs typecheck, and docs build.

**Files.** `packages/core/src/components/auth-layout/`, manifest, docs page.

**Out of scope.** Alora-specific aside content.

