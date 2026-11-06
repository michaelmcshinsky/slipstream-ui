# Ticket index

Canonical planning source: `docs/engineering-backlog.md`. One issue per file.

| ID | Title | Epic | Priority | Hours | Milestone | Depends on |
|---|---|---|---|---|---|---|
| [SLIP-001](SLIP-001.md) | Reconcile component counts and public claims | 0 | P0 | 4h | M0 Truth & baseline |  |
| [SLIP-002](SLIP-002.md) | Verify all 80 manifests against TypeScript props and publish the gap report | 0 | P0 | 6h | M0 Truth & baseline | SLIP-001 |
| [SLIP-003](SLIP-003.md) | Replace absolute marketing claims with defensible ones | 0 | P0 | 2h | M0 Truth & baseline |  |
| [SLIP-004](SLIP-004.md) | Publish a compatibility matrix | 0 | P0 | 2h | M0 Truth & baseline | SLIP-030 |
| [SLIP-010](SLIP-010.md) | Define the error taxonomy and author 100 cases | 1 | P0 | 6h | M1 Validation benchmark | SLIP-001 |
| [SLIP-011](SLIP-011.md) | Build the benchmark harness | 1 | P0 | 10h | M1 Validation benchmark | SLIP-010 |
| [SLIP-012](SLIP-012.md) | Implement the four conditions | 1 | P0 | 8h | M1 Validation benchmark | SLIP-011 |
| [SLIP-013](SLIP-013.md) | Scoring, metrics, and report generator | 1 | P0 | 8h | M1 Validation benchmark | SLIP-012 |
| [SLIP-014](SLIP-014.md) | Run the benchmark (2 models minimum) | 1 | P0 | 8h | M1 Validation benchmark | SLIP-013 |
| [SLIP-015](SLIP-015.md) | Publish the benchmark and dataset | 1 | P0 | 6h | M1 Validation benchmark | SLIP-014 |
| [SLIP-016](SLIP-016.md) | Run a third model (P1) | 1 | P1 | 6h | M1 Validation benchmark | SLIP-013 |
| [SLIP-020](SLIP-020.md) | Test Nexera UI on the same 100 cases | 2 | P0 | 6h | M2 Competitor test | SLIP-010 |
| [SLIP-021](SLIP-021.md) | Test shadcn/ui + AI Elements as the baseline | 2 | P0 | 4h | M2 Competitor test | SLIP-010 |
| [SLIP-022](SLIP-022.md) | Test Matrix UI's validation claims | 2 | P1 | 4h | M2 Competitor test | SLIP-010 |
| [SLIP-023](SLIP-023.md) | Test assistant-ui for runtime/UX comparison | 2 | P1 | 6h | M2 Competitor test | SLIP-010 |
| [SLIP-024](SLIP-024.md) | Write the competitive comparison and update positioning | 2 | P0 | 4h | M2 Competitor test | SLIP-015, SLIP-020, SLIP-021 |
| [SLIP-030](SLIP-030.md) | Audit Tailwind 3.4-specific usage | 3 | P0 | 4h | M3 Tailwind v4 |  |
| [SLIP-031](SLIP-031.md) | Add a Tailwind v4 preset while keeping v3.4 support | 3 | P0 | 10h | M3 Tailwind v4 | SLIP-030 |
| [SLIP-032](SLIP-032.md) | Add a v3/v4 compatibility test matrix to CI | 3 | P1 | 8h | M3 Tailwind v4 | SLIP-031 |
| [SLIP-033](SLIP-033.md) | Publish the v4 migration guide and demo | 3 | P0 | 4h | M3 Tailwind v4 | SLIP-031 |
| [SLIP-040](SLIP-040.md) | Write the product spec and acceptance tests | 4 | P0 | 3h | M4 AI Chat Starter | SLIP-024 |
| [SLIP-041](SLIP-041.md) | Scaffold the starter app | 4 | P0 | 4h | M4 AI Chat Starter | SLIP-040 |
| [SLIP-042](SLIP-042.md) | Implement streaming chat, markdown, code blocks, and citations | 4 | P0 | 12h | M4 AI Chat Starter | SLIP-041 |
| [SLIP-043](SLIP-043.md) | Implement tool calls, reasoning, and human approval | 4 | P0 | 10h | M4 AI Chat Starter | SLIP-042 |
| [SLIP-044](SLIP-044.md) | Implement attachments and conversation history | 4 | P1 | 8h | M4 AI Chat Starter | SLIP-042 |
| [SLIP-045](SLIP-045.md) | Ship two backend adapters | 4 | P0 | 8h | M4 AI Chat Starter | SLIP-042 |
| [SLIP-046](SLIP-046.md) | Accessibility, responsive, and reduced-motion pass | 4 | P0 | 5h | M4 AI Chat Starter | SLIP-043 |
| [SLIP-047](SLIP-047.md) | Package, license, and purchase flow | 4 | P0 | 5h | M4 AI Chat Starter | SLIP-041 |
| [SLIP-048](SLIP-048.md) | Docs, demo, and launch assets | 4 | P0 | 4h | M4 AI Chat Starter | SLIP-047 |
| [SLIP-050](SLIP-050.md) | List the MCP server in three registries | 5 | P0 | 4h | M5 Distribution | SLIP-024 |
| [SLIP-051](SLIP-051.md) | Audit `llms.txt` and per-component markdown | 5 | P0 | 4h | M5 Distribution | SLIP-002 |
| [SLIP-052](SLIP-052.md) | Publish two technical articles | 5 | P1 | 6h | M5 Distribution | SLIP-015 |
| [SLIP-053](SLIP-053.md) | Instrument the funnel | 5 | P1 | 4h | M5 Distribution | SLIP-048 |

**Total:** 33 tickets, 193h.