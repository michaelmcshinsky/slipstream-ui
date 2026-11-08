---
id: SLIP-102
title: "feat: accept rich content in ListItem descriptions"
epic: 6
priority: P2
estimate_hours: 1
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:feature", "p2"]
depends_on: []
status: done
---

**Context.** `ListItem.description` was typed `string` and rendered with
`truncate`, so consumers could not put a meta row (domain dot, project, due
date) under the title. Alora's task, habit, and protocol rows need exactly
that; without it they cannot compose `ListItem` and stay on bespoke markup.

**Delivered.**

- `description?: React.ReactNode`, rendered in a block span under the title
  without `truncate`, so multi-part meta can wrap.
- A component test asserting rich description content renders.
- Manifest, registry JSON, and LLM docs updated to the new type.

**Verification.** `list` tests 7/7, core typecheck, `validate:manifests`
(104 valid, no drift), `check:llm`, and `check:components` pass.

**Acceptance criteria**

- [x] String descriptions keep working.
- [x] ReactNode descriptions render and wrap.
- [x] Manifest and generated docs match the type.
- [x] No other List/ListItem behavior changes.

**Files.** `packages/core/src/components/list/List.tsx`,
`packages/core/src/components/list/List.test.tsx`,
`packages/core/src/manifests/list.manifest.json`,
`apps/docs/public/registry/list.json`,
`apps/docs/public/llm/components/list.md`.

**Out of scope.** Changing ListItem's slots or pressable-row contract.
