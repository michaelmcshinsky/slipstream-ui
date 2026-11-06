---
id: SLIP-053
title: "Instrument the funnel"
epic: 5
priority: P1
estimate_hours: 4
milestone: "M5 Distribution"
labels: ["epic:growth", "type:chore", "p1"]
depends_on: ["SLIP-048"]
---

**Acceptance criteria**
- [ ] Events: docs view → install → MCP connect → `validate_usage` call → starter view → checkout.
- [ ] Analytics is consent-gated (existing policy).
- [ ] No PII or prompt content is collected.
- [ ] A weekly dashboard answers: activation, conversion, and where users drop.

---

## 4. Estimate summary

| Epic | P0 hours | P1 hours | Notes |
|---|---|---|---|
| 0 — Truth | 14 | 0 | Blocks every public claim |
| 1 — Benchmark | 46 | 6 | Includes 2 models; 3rd is P1 |
| 2 — Competitor | 14 | 10 | Nexera + shadcn are P0; Matrix/assistant-ui P1 |
| 3 — Tailwind v4 | 18 | 8 | MVP support; full matrix is P1 |
| 4 — AI Chat Starter | 51 | 8 | MVP; attachments P1 |
| 5 — Distribution | 8 | 10 | Registries + llms are P0 |
| **Total** | **~151h** | **~42h** | **~193h combined** |

**Cost budget (benchmark):** ~800 model runs (100 cases × 4 conditions × 2 models), roughly 2–3M input and 0.5–1M output tokens depending on prompts. At current mid-tier pricing this is **~$50–150**, plus retries. Set a hard cap in the harness.

---

## 5. Risks specific to this backlog

| Risk | Impact | Mitigation |
|---|---|---|
| Benchmark shows validation is not better than TypeScript | Kills the wedge | Run SLIP-010–014 before building the paid starter; be ready to pivot to private-manifest B2B |
| Regex validator produces false positives, invalidating results | Kills credibility | Include 20 valid cases; report false positives; replace with AST parsing if > 5% |
| Tailwind v4 support takes longer than 10h | Blocks starter and adoption | Timebox; ship a v4-compatible theme entry even if the full matrix slips |
| Starter scope creeps into auth/billing/multi-tenant | Misses 90 days | Enforce the non-goals; auth/billing stay out of the starter |
| Competitor claims cannot be verified | Weak comparison | Mark "unverified", never "false"; publish the test date and version |
| Public claims drift again | Erodes trust | SLIP-001 CI check; generated counts only |
| Owner has < 10h/week | 90-day plan slips | Cut to one backend adapter and defer P1s; do not cut the benchmark |

---

## 6. First week, concretely

| Day | Work | Output |
|---|---|---|
| 1 | SLIP-001 count reconciliation | One generated count on every surface |
| 2 | SLIP-003 claim cleanup | No absolute reliability claims |
| 3–4 | SLIP-010 taxonomy + 30 cases | Reviewed case schema |
| 5 | SLIP-011 harness skeleton | `pnpm bench --dry-run` runs |
| 6–7 | SLIP-010 remaining 70 cases + SLIP-012 condition A | 100 cases, first condition runnable |

**Do not start the AI Chat Starter until SLIP-014 produces a result.** If the benchmark does not support the thesis, the correct action is to change the product, not to build the starter anyway.
