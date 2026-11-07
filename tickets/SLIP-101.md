---
id: SLIP-101
title: "docs: call out React dedupe when Slipstream is consumed from a linked checkout"
epic: 6
priority: P2
estimate_hours: 1
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:docs", "p2"]
depends_on: []
status: done
---

**Context.** Alora consumes Slipstream through `link:` during co-development.
The linked core package resolved its own React 18 copy while the app runs React
19. React 19 uses the `react.transitional.element` symbol, which React 18's
`isValidElement` does not recognise. Radix `Slot` therefore treated app
elements as plain objects and `Card asChild` crashed the page with
"Objects are not valid as a React child".

The published packages do not have this problem because React is a peer
dependency and the consumer's package manager dedupes it. The failure only
appears in the linked-local workflow, which is exactly what the integration
guides describe.

**Delivered.** A note in the React Hook Form guide's Notes list: dedupe
`react`, `react-dom`, and `react/jsx-runtime` in the consumer bundler while the
packages are linked, and remove the override once published versions are used.

**Acceptance criteria**

- [x] The linked-checkout caveat is documented in a consumer guide.
- [x] The note names the failing primitive (`Slot` via `asChild`) and the
      React symbol mismatch.
- [x] The note says the override is temporary and unnecessary with published
      packages.

**Files.** `apps/docs/app/docs/guides/react-hook-form/page.tsx`.

**Out of scope.** Changing how the packages declare React; the peer dependency
is already correct.
