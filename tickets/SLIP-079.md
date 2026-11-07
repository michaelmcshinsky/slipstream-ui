---
id: SLIP-079
title: "Consent package: provider, cookie banner, preferences and script gating"
epic: 7
priority: P0
estimate_hours: 14
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: []
---

**Context.** Every consumer rebuilds cookie consent, category preferences, and
consent-gated script loading. Getting the order wrong leaks analytics before
consent.

**Scope.**
- `ConsentProvider` (categories, version, expiry, storage adapter).
- `CookieBanner` (accept/reject/manage, accessible dialog semantics).
- `ConsentPreferences` (per-category toggles, save/reject).
- `ConsentScript` / `useConsent` (load only after the category is granted).

**Acceptance criteria**

- [ ] No script loads before consent.
- [ ] Consent is versioned and re-prompted when the version changes.
- [ ] Banner and preferences are keyboard operable and screen-reader labelled.
- [ ] Storage is pluggable (cookie/localStorage) and documented.
- [ ] Manifests, tests, axe, docs, registry/LLM output.

**Out of scope.** A specific analytics vendor.
