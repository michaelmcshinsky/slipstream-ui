---
id: SLIP-106
title: "ci: run the esbuild size audit with the platform binary"
epic: 6
priority: P1
estimate_hours: 1
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:ci", "p1"]
depends_on: ["SLIP-094"]
status: done
---

**Context.** `scripts/audit-sizes.mjs` always invoked esbuild as
`node <esbuild-bin>`, which works on Windows because the shim there is a Node
script. On Linux the resolved path is the ELF binary itself, so Node tried to
parse it as JavaScript and the CI job died with
`SyntaxError: Invalid or unexpected token` followed by `ELF`.

**Desired state.** The size audit runs on both platforms and fails only on a
real budget breach.

**Acceptance criteria**

- [x] `node scripts/audit-sizes.mjs` passes on win32 and on the Ubuntu CI runner.
- [x] The audit still fails when a budget is exceeded.
- [x] The React externals and gzip measurement are unchanged.

**Status: Done (2026-11-08).**

- The runner is `process.execPath` on Windows (esbuild's JS shim) and the
  esbuild binary directly elsewhere, with the bundler arguments shared.
- CI run 42505446366 (`build` job) went green with every other gate.

**Files.** `scripts/audit-sizes.mjs`.

**Out of scope.** Moving the budget table into `package.json`.
