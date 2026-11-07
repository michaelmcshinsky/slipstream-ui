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

- [ ] The default centered layout is unchanged.
- [ ] The split variant is responsive at 390 and 1280.
- [ ] The aside is optional; omitting it falls back to centered.
- [ ] Keyboard order and focus are correct.
- [ ] Manifest, tests, docs, registry, and LLM docs are updated.

**Files.** `packages/core/src/components/auth-layout/`, manifest, docs page.

**Out of scope.** Alora-specific aside content.

