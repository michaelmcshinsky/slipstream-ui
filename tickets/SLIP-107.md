---
id: SLIP-107
title: "release: 0.6.1 - Tailwind v4 peer and the modal-layer cleanup warning"
epic: 6
priority: P1
estimate_hours: 2
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:release", "p1"]
depends_on: ["SLIP-099", "SLIP-105", "SLIP-106"]
status: done
---

**Context.** Two consumer-visible problems survived 0.6.0:

- `@slipstream-ui/themes` declared `tailwindcss: ^3.4.0` while shipping the v4
  theme contract, so every Tailwind 4 app (including utah-esports on 4.3.3)
  installed with an unmet-peer warning and `pnpm peers check` failed.
- `useModalLayer` read `id.current` inside the effect cleanup, which React
  warns about ("The ref value 'id.current' will likely have changed…") and
  which can remove the wrong layer when a modal unmounts during a re-render.

**Desired state.** A patch release that widens the peer range and captures the
layer id, verified end to end before publish.

**Acceptance criteria**

- [x] `pnpm peers check` is clean in a Tailwind 4 consumer.
- [x] The React ref-in-cleanup warning is gone from the build output.
- [x] Nested modal open/close still releases the body scroll lock once.
- [x] Gate green: typecheck 17/17, lint 10/10, tests 13/13, build 12/12, manifests 104/104, axe 26/26.
- [x] Published to npm with provenance and a GitHub release and tag.

**Status: Done (2026-11-08).**

- Peer widened to `^3.4.0 || ^4.0.0`; a patch changeset and `pnpm version-packages`
  cut core/ai/themes 0.6.1.
- `useModalLayer` copies `id.current` into a `layerId` const at the top of the
  effect and uses that in both the push and the cleanup.
- Release run 42506408952 published all three packages; CI run 42506408901
  passed; utah-esports then installed 0.6.1 from the registry with
  `pnpm peers check` reporting no issues.

**Files.** `packages/themes/package.json`, `packages/core/src/utils/modal-layer.ts`,
`.changeset/release-peer-and-effect-fixes.md`, CHANGELOGs and manifests.

**Out of scope.** Dropping Tailwind 3.4 support (kept through 1.0).
