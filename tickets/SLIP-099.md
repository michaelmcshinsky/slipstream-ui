---
id: SLIP-099
title: "chore: publish core, themes, and mcp-server after the integration fixes"
epic: 6
priority: P0
estimate_hours: 2
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:chore", "p0"]
depends_on: ["SLIP-090", "SLIP-091", "SLIP-092"]
status: done
---

**Context.** Alora consumed local `link:` packages. The fixed Slipstream
packages had to be published before Alora could use exact versions in
CI/Docker. The earlier published `0.5.0` predated the prebuilt stylesheet
export, so it was not usable.

**Delivered.**

- `@slipstream-ui/core@0.6.1`, `@slipstream-ui/themes@0.6.1`, and
  `@slipstream-ui/mcp-server@0.3.1` published on 2026-11-08.
- npm provenance present (`dist.attestations.provenance.predicateType:
  https://slsa.dev/provenance/v1`).
- The published core exposes `./styles.css`, `./styles-full.css`, and the
  per-component `./*` subpaths, so consumers can tree-shake and use the
  utilities-only sheet.
- Alora pins `0.6.1` for core and themes and removed every `link:` entry; see
  ALORA-005.

**Evidence.**

```text
npm view @slipstream-ui/core versions
  ... 0.5.0, 0.6.0, 0.6.1
npm view @slipstream-ui/core version        -> 0.6.1
npm view @slipstream-ui/themes version      -> 0.6.1
npm view @slipstream-ui/mcp-server version  -> 0.3.1
npm view @slipstream-ui/core@0.6.1 exports  -> ./styles.css, ./styles-full.css, ./*
npm view @slipstream-ui/core@0.6.1 dist.attestations
  -> { url: ".../attestations/@slipstream-ui%2fcore@0.6.1",
       provenance: { predicateType: "https://slsa.dev/provenance/v1" } }
```

**Acceptance criteria**

- [x] Versions are bumped (0.6.0 → 0.6.1) and released.
- [x] npm provenance is present.
- [x] `npm view` shows the new versions and the styles/subpath exports.
- [x] Alora pins them (ALORA-005) and its full gate suite passes.
- [x] The release is recorded in `tickets/STATUS.md`.

**Files.** `.changeset/`, package manifests, `tickets/STATUS.md`.

**Note.** The earlier blocker (npm authentication) was resolved by the release
owner; this ticket records the published result rather than a local publish
run.
