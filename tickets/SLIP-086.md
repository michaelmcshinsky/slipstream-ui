---
id: SLIP-086
title: "VPAT/ACR, browser support matrix and 1.0 support policy"
epic: 7
priority: P1
estimate_hours: 18
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:docs", "p1"]
depends_on: ["SLIP-084"]
---

**Context.** Finance procurement will ask for accessibility conformance,
browser support and API stability before adopting a public-facing component
library.

**Scope.**
- VPAT 2.5 / ACR for WCAG 2.2 AA.
- Browser support matrix with tested versions.
- 1.0 API freeze and semantic-versioning policy.
- LTS/support window and security response targets.
- Deprecation and codemod policy.
- Public accessibility statement and feedback route.

**Acceptance criteria**
- [ ] Every WCAG 2.2 A/AA criterion has a conformance level and evidence link.
- [ ] The matrix names exact browser versions and test dates.
- [ ] The 1.0 policy states what can break in a minor vs major.
- [ ] Support response targets are published.
- [ ] A named owner and review date exist for the ACR.
- [ ] Docs and README link to all three documents.

**Technical notes**
- Do not claim full conformance without manual screen-reader testing.
- Automated axe results are evidence, not a complete ACR.
