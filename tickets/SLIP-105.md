---
id: SLIP-105
title: "fix: emit per-file subpath modules under dist/src on every platform"
epic: 6
priority: P1
estimate_hours: 2
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:fix", "p1"]
depends_on: []
status: done
---

**Context.** The package export map advertises
`./dist/src/components/*/index.{mjs,js,d.ts}` for subpath imports such as
`@slipstream-ui/core/card`. The declarations land there via `tsc -p
tsconfig.build.json`, but the esbuild pass wrote `dist/components/...` because
tsup derives the output directory from the entry path. Local Windows builds
looked correct only because a stale `dist` from an earlier config was present;
CI failed with `packages/core#build` and the tarball had no subpath modules at
all.

**Desired state.** The published tarball contains
`dist/src/components/card/index.{mjs,js,d.ts}` and subpath imports resolve for
ESM, CJS and TypeScript from a clean build.

**Acceptance criteria**

- [x] A clean build produces the subpath files beside the declarations.
- [x] `pnpm verify:modules` passes (root client bundle, server-safe subpaths, explicit imports).
- [x] The packed tarball contains `dist/src/components/card/index.mjs` and `.d.ts`.
- [x] Build is deterministic on Windows and Linux.

**Status: Done (2026-11-08).**

- `tsup.modules.config.ts` sets `outDir: 'dist/src'` and normalises entry keys
  with a `path.relative('src', …)` / POSIX-separator helper, so the emitted tree
  matches the export map on win32 and POSIX alike.
- `pnpm verify:modules` and the packaged-styles smoke test both ran green, and
  `npm pack` of the 0.6.0 tarball was inspected to confirm the paths.

**Files.** `packages/core/tsup.modules.config.ts`, `scripts/verify-modules.mjs`.

**Out of scope.** A separate `./server` entry point; the root barrel stays a
client bundle for compatibility.
