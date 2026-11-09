---
id: SLIP-109
title: "chore: resolve the vitest @types/node peer warning"
epic: 6
priority: P3
estimate_hours: 1
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:chore", "p3"]
depends_on: []
status: ready
---

**Context.** `pnpm install` prints:

```
vitest 5.0.5
└── ✕ unmet peer @types/node@"^22.0.0 || >=24.0.0": found 20.19.43
```

The root pins `@types/node@20.19.43` while the shared `tooling/vitest-config`
and every package's `vitest` resolve to 5.0.5, which declares the newer range.
CI is green because pnpm treats an unmet peer as a warning, but the mismatch
means the test typings are older than the runner expects.

**Desired state.** No unmet peer on a clean install, without changing the Node
runtime used by CI and the apps.

**Acceptance criteria**

- [ ] Decide between bumping `@types/node` to 22.x (CI runs Node 22) or pinning
      vitest to a version that accepts 20.x.
- [ ] `pnpm install` reports no peer warning.
- [ ] `pnpm typecheck`, `pnpm test` and `pnpm build` stay green on Node 22.
- [ ] The lockfile change is the only diff.

**Files.** root `package.json`, `tooling/vitest-config/package.json`,
`pnpm-lock.yaml`.

**Out of scope.** Raising the minimum Node version for consumers; the published
packages do not depend on `@types/node`.
