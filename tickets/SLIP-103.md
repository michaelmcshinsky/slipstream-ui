---
id: SLIP-103
title: "fix: make a clean checkout pass the gate (Prisma client + test concurrency)"
epic: 6
priority: P1
estimate_hours: 2
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:fix", "p1"]
depends_on: []
status: done
---

**Context.** The 0.6.0 release run failed twice on a cold GitHub runner even though
the same commands passed locally:

1. `pnpm typecheck` failed in `apps/app` because `prisma.$transaction(async (tx) => …)`
   inferred `tx` as `any`: the generated client was missing. `packages/db` only ran
   `prisma generate` in its `build` script, and turbo caches `build`, so a fresh
   checkout that typechecked before the db build had no client types.
2. `pnpm test` failed intermittently in `apps/starters/ai-chat` with a jsdom worker
   crash when turbo ran every package's suites at once.

**Desired state.** A clean clone plus `pnpm install && pnpm typecheck && pnpm test`
passes with no warm cache and no manual `prisma generate`.

**Acceptance criteria**

- [x] Installing dependencies generates the Prisma client.
- [x] Typecheck passes from a clean `.next`/`dist` state.
- [x] The full test run passes twice in a row with no worker crash.
- [x] The fix does not depend on turbo cache state.

**Status: Done (2026-11-08).**

- `packages/db` gains `"prepare": "prisma generate"` next to `build`, so the
  client is generated during install as well as before a build.
- Root `test` runs `turbo run test --concurrency=2`, which keeps the jsdom
  worker count inside the default heap on CI and on 16-core local machines.
- `apps/app` keeps `fileParallelism: false` for the shared SQLite integration
  suite, so route-handler flow tests do not interleave writes.

**Files.** `packages/db/package.json`, `package.json`, `apps/app/vitest.config.ts`.

**Out of scope.** Replacing the SQLite test database with per-worker files.
