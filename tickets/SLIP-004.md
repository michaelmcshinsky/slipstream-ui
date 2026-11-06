---
id: SLIP-004
title: "Publish a compatibility matrix"
epic: 0
priority: P0
estimate_hours: 2
milestone: "M0 Truth & baseline"
labels: ["epic:truth", "type:docs", "p0"]
depends_on: ["SLIP-030"]
---

**Acceptance criteria**
- [ ] Matrix covers React 18/19, Next 14/15/16, Vite, Tailwind 3.4/v4, RSC/client boundaries, Radix packages.
- [ ] Each cell is marked **tested**, **expected**, or **unsupported** — no blank cells.
- [ ] The matrix links to the CI job or demo that proves "tested".
- [ ] It lives at `/docs/compatibility` and is linked from the README.

---

## Epic 1 — The 100-case validation benchmark
