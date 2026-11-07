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

- [x] The test runs in CI.
- [x] A missing export or file fails the test.
- [x] The test uses `pnpm pack` or an equivalent tarball install.
- [x] The check is documented in the release checklist.

**Status: Done (2026-11-07).**

- New `scripts/test-packaged-styles.mjs` packs `core` and `themes`, extracts
  the tarballs into a throwaway consumer, and resolves the stylesheet entry
  points through the package export maps.
- Asserts key utility classes, the theme variables and dark selector, the
  export map entries, and that `styles.css` has no preflight while
  `styles-full.css` does.
- Wired in CI after the build as `node scripts/test-packaged-styles.mjs`.
- Documented in `docs/release-checklist.md` and linked from `CONTRIBUTING.md`.

**Files.** `packages/core/package.json`, `packages/themes/package.json`,
new `scripts/test-packaged-styles.mjs`, CI.

**Out of scope.** Visual rendering tests.

