---
id: SLIP-099
title: "chore: publish core, themes, and mcp-server after the integration fixes"
epic: 6
priority: P0
estimate_hours: 2
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:chore", "p0"]
depends_on: ["SLIP-070", "SLIP-071", "SLIP-072"]
status: blocked
---

**Context.** Alora currently consumes local `link:` packages. The fixed
Slipstream packages must be published before Alora can use exact versions in
CI/Docker.

**Desired state.** Run the changeset version and publish flow for
`@slipstream-ui/core`, `@slipstream-ui/themes`, and
`@slipstream-ui/mcp-server` with provenance. Record the published versions and
the date.

**Acceptance criteria**

- [ ] Versions are bumped and changelogs include the integration fixes.
- [ ] npm provenance is present on all three packages.
- [ ] `npm view` shows the new versions.
- [ ] Alora's ALORA-005 can pin them.
- [ ] The release is recorded in `tickets/STATUS.md`.

**Files.** `.changeset/`, package manifests, `tickets/STATUS.md`.

**Blocker.** npm authentication and release authorization.

