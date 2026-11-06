# Backlog status — 2026-11-05

Canonical tickets: [`SLIP-*.md`](./SLIP-001.md) · Triage: [`TRIAGE.md`](./TRIAGE.md)
Implementation plan: [`../docs/engineering-backlog.md`](../docs/engineering-backlog.md)

## Completed (22)

| ID | Deliverable |
|---|---|
| SLIP-001 | Component counts generated + CI drift check (`scripts/check-component-counts.ts`) |
| SLIP-002 | 80/80 manifest parity + gap report (`scripts/report-manifest-gaps.ts`); 8 drifts fixed |
| SLIP-003 | Absolute “zero hallucination” claims replaced |
| SLIP-004 | Compatibility matrix (`docs/compatibility.md` + `/docs/compatibility`) |
| SLIP-010 | 100 reviewed cases, 30 valid / 70 defective, 10 per class |
| SLIP-011 | Benchmark harness + providers (`benchmarks/`) |
| SLIP-012 | Conditions A–D + repair loop |
| SLIP-013 | Scoring/report generator + tests |
| SLIP-015 | Published baseline (`docs/benchmarks.md`) |
| SLIP-030 | Tailwind v4 audit (`docs/tailwind-v4-audit.md`) |
| SLIP-031 | `packages/themes/tailwind-v4.css` + token tests |
| SLIP-032 | v4 compile fixture (`pnpm verify:tailwind-v4`, Tailwind 4.3.4) |
| SLIP-033 | `/docs/tailwind-v4` migration guide |
| SLIP-040 | Starter spec/acceptance in `apps/starters/ai-chat/README.md` |
| SLIP-041 | Starter app scaffold |
| SLIP-042 | Streaming, markdown, code, citations |
| SLIP-043 | Tool calls, reasoning, approval gate |
| SLIP-044 | Attachments + local conversation history |
| SLIP-047 | `/buy` checkout redirect + licence template + purchase docs |
| SLIP-051 | LLM doc audit (`scripts/check-llm-docs.ts`) |
| SLIP-052 | Two technical articles (`docs/articles/`) |
| SLIP-053 | Consent-gated, PII-free analytics + tests |

## Blocked / not completed (11)

| ID | Blocker |
|---|---|
| SLIP-014 | Live 2-model run: no `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` |
| SLIP-016 | Third model: same key blocker |
| SLIP-020 | Nexera UI runtime test: install + model keys |
| SLIP-021 | shadcn/AI Elements runtime test: install + model keys |
| SLIP-022 | Matrix UI test: install |
| SLIP-023 | assistant-ui test: install |
| SLIP-024 | Full tested comparison: depends on 020–023 (doc matrix shipped) |
| SLIP-045 | Vercel AI SDK adapter not added; raw SSE + mock ship and the contract is documented |
| SLIP-046 | Full screen-reader audit not run; automated axe on the empty state passes |
| SLIP-048 | Deployed demo URL + launch video (deploy docs shipped) |
| SLIP-050 | MCP registry submission: `gh`/npm auth required (`server.json` + docs shipped) |


## Internationalization (2026-11-06)

- Shared `@slipstream-ui/i18n` runtime: en/ar/es, RTL, typed keys, plurals, Intl.
- AI Chat Starter fully localized; server `lang`/`dir`, cookie switcher, localized mock/checkout.
- `Reasoning` and `ToolCall` accept label overrides.
- Plan for docs, dashboard, playground and remaining component labels: [`../docs/i18n-plan.md`](../docs/i18n-plan.md).
- Tracking ticket: [`SLIP-060.md`](./SLIP-060.md).
## Verification

```bash
pnpm typecheck                  # 15 packages
pnpm test                       # core 499, ai 148, app 375, mcp 11, starter 20
pnpm validate:manifests         # 80 valid, 0 drift, counts match
pnpm check:llm                  # 80 manifests ↔ markdown
pnpm report:manifests           # 80 components, 0 gaps
pnpm bench:check                # 100 cases, no drift
pnpm bench:test                 # 10 tests
pnpm verify:tailwind-v4         # compile fixture
pnpm --filter slipstream-ui-docs typecheck
pnpm --filter slipstream-ai-chat-starter build
```

## Baseline result

Mock provider, 100 cases × 4 conditions: **65.7% recall, 100% precision, 0%
false positives**. Structural classes 100%; accessibility 40%; state/streaming
10%. See [`../docs/benchmarks.md`](../docs/benchmarks.md).
