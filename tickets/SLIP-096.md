---
id: SLIP-096
title: "test: add a prebuilt stylesheet export smoke test"
epic: 6
priority: P1
estimate_hours: 3
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:test", "p1"]
depends_on: []
status: ready
---

**Context.** The prebuilt styles are a new public entry point. A packaging
regression (missing `dist/styles.css`, wrong export map, or missing classes)
would ship silently.

**Desired state.** A test that installs the packed tarball into a temp consumer
and asserts:

- `@slipstream-ui/core/styles.css` resolves,
- `@slipstream-ui/core/styles-full.css` resolves,
- `@slipstream-ui/themes/styles.css` resolves,
- key classes and theme variables are present,
- the utilities-only sheet does not include preflight.

**Acceptance criteria**

- [ ] The test runs in CI.
- [ ] A missing export or file fails the test.
- [ ] The test uses `pnpm pack` or an equivalent tarball install.
- [ ] The check is documented in the release checklist.

**Files.** `packages/core/package.json`, `packages/themes/package.json`,
new `scripts/test-packaged-styles.mjs`, CI.

**Out of scope.** Visual rendering tests.

