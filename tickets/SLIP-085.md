---
id: SLIP-085
title: "Tailwind v4 real-app certification and RSC/no-JS compatibility matrix"
epic: 7
priority: P1
estimate_hours: 14
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:test", "p1"]
depends_on: ["SLIP-070"]
---

**Context.** Tailwind v4 is compiled against component sources but not certified
in a real Next or Vite build. There is also no per-component RSC/no-JS table.

**Scope.**
- Add a real Next.js App Router fixture on Tailwind v4.
- Add a real Vite fixture on Tailwind v4.
- Keep the v3 fixtures.
- Publish a component compatibility table: RSC-safe, client-only, no-JS fallback.
- Add inverse-tone and dark-mode fixtures.

**Acceptance criteria**
- [ ] Both v4 fixtures build in CI.
- [ ] The v3 fixtures still build.
- [ ] Charts, marketing blocks and overlays render in each fixture.
- [ ] The compatibility table is generated from source annotations or tests.
- [ ] Docs state the exact supported React, Next, Vite and Tailwind versions.
- [ ] No `@ts-ignore` or unsupported peer suppression is used to pass.

**Technical notes**
- The fixture should import published package entry points, not source paths.
- Add a `pnpm verify:tailwind-v4:apps` command.
