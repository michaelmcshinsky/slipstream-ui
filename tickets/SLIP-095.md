---
id: SLIP-095
title: "docs: document react-hook-form compatibility for value-based controls"
epic: 6
priority: P1
estimate_hours: 2
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:docs", "p1"]
depends_on: []
status: done
---

**Context.** `Input` and `Textarea` forward refs and work with RHF `register()`.
`Select`, `Checkbox`, `DatePicker`, and `TimePicker` use value-based callbacks
and need a `Controller`. Consumers repeatedly rediscover this.

**Desired state.** Add a short guide (and per-component notes) showing:

- `register()` for Input/Textarea,
- `Controller` for Select/Checkbox/DatePicker/TimePicker,
- a copy-paste adapter example,
- how `FormField` wires errors and `aria-invalid`.

**Acceptance criteria**

- [x] The guide is linked from the components index and the docs nav.
- [x] Examples typecheck.
- [x] The `Select` docs mention the native `onChange` event and `onValueChange`.
- [x] The guide names the RHF version tested.

**Status: Done (2026-11-07).**

- New page: `apps/docs/app/docs/guides/react-hook-form`.
- Added to `lib/nav.ts` and `lib/search-index.ts`, and linked from the
  components overview.
- Covers `register()` for Input/Textarea, `Controller` for
  Select/Checkbox/DatePicker/TimePicker, a typed `SelectField` adapter, and
  `FormField` error/`aria-invalid` wiring.
- Select docs now list the native `onChange` event and `onValueChange`.
- Version stated: react-hook-form 7.x, tested with 7.90.
- Verified with docs typecheck, lint and production build.

**Files.** `apps/docs/app/docs/guides/`, `apps/docs/lib/nav.ts`,
`apps/docs/lib/search-index.ts`.

**Out of scope.** Shipping an RHF adapter package.

