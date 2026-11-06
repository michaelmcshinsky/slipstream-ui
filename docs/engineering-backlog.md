# Slipstream UI — 90-Day Engineering Backlog

**Prepared:** 2026-11-05
**Scope:** 100-case validation benchmark, competitor testing, and the first paid AI Chat Starter
**Format:** GitHub-ready — every `### SLIP-xxx` section maps to one issue
**Estimates:** planning estimates in engineer-hours, not commitments

---

## 0. Read this first: fact reconciliation

The strategic plan this backlog implements contains stale and unverified claims. They are corrected here before any engineering starts, because several issues depend on the numbers being right.

| Claim in the plan | Verified reality (2026-11-05) | Consequence |
|---|---|---|
| "73 components / 73 manifests" | **80 components** — 63 core + 17 AI, with 80 manifests (counted from `packages/*/src/manifests`) | All public copy and the benchmark must use 80 |
| "56 core + 17 AI" | 63 core + 17 AI | Same |
| "42 UI + 17 AI = 59" on homepage | Stale legacy copy; not the current repo | Remove from any comparison |
| "Latest GitHub release v2.6.4, Feb 2022" | `v2.6.4` is a **legacy tag** from the pre-rebuild library. Current releases: `@slipstream-ui/core@0.4.0` and `@slipstream-ui/ai@0.4.0`, published 2026-11-04 | Do not describe the project as abandoned |
| "Docs describe Tailwind 2.x and 3.x" | Repo tooling pins **Tailwind 3.4** (`tooling/tailwind-config`); the legacy site copy is stale | The real gap is **Tailwind v4**, not v2 |
| "167 automated tests" | **99 test files** exist; the number of individual test cases is unverified | Do not publish "167 tests" until measured |
| "`validate_usage` is unique" | Nexera UI, Matrix UI and Marmo all market some form of validation; `validate_usage` is currently a **heuristic regex parser**, not AST/TypeScript-aware | The moat is unproven; benchmark first (Epic 1) |
| "RTL is the differentiator" | shadcn/ui shipped first-class RTL on **2026-01-28**, including CLI class transformation for any registry component | RTL is a secondary capability, not a wedge |
| "Nexera MCP validation is live" | Nexera markets MCP; its About page still describes the server as "soon" (2026-10-07) | Test what actually ships; record the version/date |
| npm adoption figures | npm API (7 days to 2026-11-04): Tailwind 170.8M, Radix dialog 90.7M, shadcn CLI 17.4M, MUI 13.6M, Headless UI 9.9M, Mantine 3.6M, Chakra 2.1M | Use the API snapshot, not blog estimates |

**Repo baseline**

| Item | State |
|---|---|
| Components | 63 core + 17 AI = 80; 80 manifests |
| Packages | core 0.4.0, ai 0.4.0, themes 0.3.0, cli 0.2.1, mcp-server 0.2.0, registry 0.2.0 |
| MCP tools | `list_components`, `search_components`, `get_component_manifest`, `get_usage_examples`, `validate_usage` |
| Validator | Regex-based JSX attribute scan (`packages/mcp-server/src/tools/validate-usage.ts`) |
| Tailwind | 3.4 only |
| Distribution | npm + shadcn-compatible registry; 3 GitHub stars, ~450 weekly downloads |
| Paid infrastructure | `apps/app` has Stripe + mock billing, plans, licence keys, teams |
| Docs | Next.js docs site with one `/docs/templates` page — no complete starter product yet |

---

## 1. Goals, non-goals, and success criteria

### 90-day goal

Prove — with a reproducible benchmark — whether Slipstream's validation is measurably better than ordinary TypeScript and documentation, then ship **one** paid product that demonstrates the value: an AI Chat Starter.

### Success criteria

| Metric | Target |
|---|---|
| Benchmark cases | 100, covering 7 error classes |
| Benchmark conditions | 4 (docs only, TS types, manifests, MCP + `validate_usage`) |
| Benchmark models | 2 minimum, 3 stretch |
| Validator false-positive rate on golden set | < 5% |
| Competitors tested | 3 minimum (Nexera, shadcn + AI Elements, Matrix UI) |
| AI Chat Starter | Complete, deployed, purchasable, WCAG 2.2 AA |
| Paid preorders | 5 |
| MCP registry listings | 3 |
| Documented hours | ≤ 155h for P0 |

### Non-goals (explicitly out of scope for 90 days)

- Enterprise SSO, SCIM, audit export, SOC 2.
- Vue/Svelte ports.
- Figma integration.
- Custom implementation services.
- A second paid starter (Agent Operations or RAG).
- Rewriting all 80 components.
- Paid advertising.

---

## 2. Sequencing and critical path

| Milestone | Weeks | Issues | Exit criterion |
|---|---|---|---|
| **M0 — Truth & baseline** | 1–2 | SLIP-001…004 | Public claims match the repo; compatibility matrix published |
| **M1 — Validation benchmark** | 3–5 | SLIP-010…015 | Reproducible results published; false-positive rate measured |
| **M2 — Competitor test** | 5–6 | SLIP-020…024 | Same 100 cases run against 3 competitors; comparison published |
| **M3 — Tailwind v4** | 6–8 | SLIP-030…033 | Fresh Vite + Next app builds on v4; v3 still passes |
| **M4 — AI Chat Starter** | 8–12 | SLIP-040…048 | Deployed, accessible, purchasable |
| **M5 — Distribution** | 12–13 | SLIP-050…053 | 3 registry listings, 2 articles, funnel instrumented |

**Critical path:** SLIP-001 → SLIP-010 → SLIP-011 → SLIP-012 → SLIP-014 → SLIP-024 → SLIP-040 → SLIP-047.

**Hours:** P0 ≈ 151h; P1 ≈ 42h; P2 not estimated. At 8–10h/week the P0 scope is a **15–19 week plan, not 90 days**. At ~12h/week it fits 13 weeks. To hit 90 days, either commit ~12h/week or cut the starter to one backend adapter and defer the dual Tailwind build. This trade-off is a decision for the owner, not an engineering assumption.

---

## 3. Labels and milestones

**Labels**

`epic:truth` `epic:benchmark` `epic:competitor` `epic:tailwind` `epic:starter` `epic:growth`
`type:research` `type:feature` `type:test` `type:docs` `type:chore`
`p0` `p1` `p2` `good-first-issue` `needs-decision`

**Milestones**

`M0 Truth & baseline` · `M1 Validation benchmark` · `M2 Competitor test` · `M3 Tailwind v4` · `M4 AI Chat Starter` · `M5 Distribution`

**Definition of ready (every issue)**

- [ ] Problem and user impact stated.
- [ ] Acceptance criteria are observable and testable.
- [ ] Dependencies listed.
- [ ] Estimate agreed.
- [ ] No unverified competitor or market claim in the body.

**Definition of done (every issue)**

- [ ] Code merged, typecheck/lint/test green.
- [ ] Tests cover the new behaviour (including failure modes).
- [ ] Docs updated where behaviour is user-facing.
- [ ] `pnpm validate:manifests` passes if manifests changed.
- [ ] No secrets, no new dependency without justification.
- [ ] Public claims re-checked against the repo.

---

## 3a. Filing these as GitHub issues

Each `### SLIP-xxx` heading is one issue. To create the labels and the first issue:

```bash
gh label create "epic:benchmark" --color 1D76DB
gh label create "type:research" --color 5319E7
gh label create "p0" --color B60205

gh issue create \
  --title "SLIP-010 · Define the error taxonomy and author 100 cases" \
  --milestone "M1 Validation benchmark" \
  --label "epic:benchmark,type:research,p0" \
  --body-file .github/issue-bodies/slip-010.md
```

Keep the `SLIP-xxx` prefix in the title so cross-references in this backlog keep working.
Do not paste estimate hours into the issue body without also adding them as a project
field; hours in prose drift.

---

## Epic 0 — Truth and baseline

### SLIP-001 · Reconcile component counts and public claims
**Epic:** 0 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:truth`, `type:chore`, `p0` · **Depends on:** —

**Context.** README says 80 (63+17), the external plan says 73 (56+17), and an older comparison says 42+17. The repository is the only source of truth.

**Acceptance criteria**
- [ ] `pnpm generate:llm-docs` output, README stats, `/llms.txt`, docs index, and pricing page all show **80**.
- [ ] A CI check fails when any published count diverges from `packages/*/src/manifests`.
- [ ] Stale "42 + 17" copy is removed from every public surface.
- [ ] The count is generated, never hand-edited.

**Done when** a manifest is added/removed and every public count updates in one command.

---

### SLIP-002 · Verify all 80 manifests against TypeScript props and publish the gap report
**Epic:** 0 · **Priority:** P0 · **Estimate:** 6h · **Labels:** `epic:truth`, `type:test`, `p0` · **Depends on:** SLIP-001

**Context.** `pnpm validate:manifests` checks schema and directory-scoped TS/manifest parity. It does not prove that every runtime prop is documented, that defaults match, or that anti-patterns are accurate.

**Acceptance criteria**
- [ ] A script reports, per component: manifest props, TS props, missing-in-manifest, extra-in-manifest, default mismatches.
- [ ] The report is checked into CI as an artefact (not a blocking gate until the baseline is clean).
- [ ] Known exceptions are documented with a reason and an owner.
- [ ] The report is reproducible from a clean clone.

**Done when** a maintainer can answer "is component X's manifest accurate?" in one command.

---

### SLIP-003 · Replace absolute marketing claims with defensible ones
**Epic:** 0 · **Priority:** P0 · **Estimate:** 2h · **Labels:** `epic:truth`, `type:docs`, `p0` · **Depends on:** —

**Context.** "Zero hallucinated props" is unprovable and will be falsified by the benchmark.

**Acceptance criteria**
- [ ] Remove "zero hallucinated props" and any absolute reliability claim.
- [ ] Replace with: "Validate AI-generated component usage against real TypeScript APIs, component specifications, and documented accessibility requirements."
- [ ] Claims name the error classes actually covered.
- [ ] A reviewer has checked every claim against a test or manifest field.

---

### SLIP-004 · Publish a compatibility matrix
**Epic:** 0 · **Priority:** P0 · **Estimate:** 2h · **Labels:** `epic:truth`, `type:docs`, `p0` · **Depends on:** SLIP-030

**Acceptance criteria**
- [ ] Matrix covers React 18/19, Next 14/15/16, Vite, Tailwind 3.4/v4, RSC/client boundaries, Radix packages.
- [ ] Each cell is marked **tested**, **expected**, or **unsupported** — no blank cells.
- [ ] The matrix links to the CI job or demo that proves "tested".
- [ ] It lives at `/docs/compatibility` and is linked from the README.

---

## Epic 1 — The 100-case validation benchmark

### SLIP-010 · Define the error taxonomy and author 100 cases
**Epic:** 1 · **Priority:** P0 · **Estimate:** 6h · **Labels:** `epic:benchmark`, `type:research`, `p0` · **Depends on:** SLIP-001

**Context.** The benchmark is the marketing asset and the product truth. It must be authored before the harness.

**Taxonomy (7 classes, ≥ 10 cases each)**
1. Unknown/hallucinated prop.
2. Invalid enum/variant value.
3. Missing required prop.
4. Invalid composition (child not allowed, required wrapper missing).
5. Invalid accessibility attribute or missing accessible name.
6. Unsupported state combination (e.g., `loading` + `disabled` where undefined).
7. Streaming/agent-state misuse (tool state, reasoning state, approval state).

**Acceptance criteria**
- [ ] 100 cases in `benchmarks/cases/*.json` with: id, componentId, prompt, ground-truth defect class, expected verdict, minimal fix.
- [ ] Cases are written against the **current** manifest, not from memory.
- [ ] At least 20 cases are *valid* usage (to measure false positives).
- [ ] A second reviewer has confirmed each expected verdict.

**Done when** the case set is versioned and reviewable in a PR.

---

### SLIP-011 · Build the benchmark harness
**Epic:** 1 · **Priority:** P0 · **Estimate:** 10h · **Labels:** `epic:benchmark`, `type:feature`, `p0` · **Depends on:** SLIP-010

**Acceptance criteria**
- [ ] `pnpm bench` runs cases against configurable model adapters (at least 2 providers).
- [ ] Each run records: model, temperature, seed if supported, prompt hash, raw output, timestamp, harness version.
- [ ] Runs are resumable and cached; a failed provider does not lose completed work.
- [ ] Results are written as JSON + CSV with a stable schema.
- [ ] API keys come from env vars; nothing is logged or committed.

**Done when** a clean clone can reproduce a prior run from the recorded config.

---

### SLIP-012 · Implement the four conditions
**Epic:** 1 · **Priority:** P0 · **Estimate:** 8h · **Labels:** `epic:benchmark`, `type:feature`, `p0` · **Depends on:** SLIP-011

**Conditions**
- **A — Docs only:** component markdown from `/llm/components/<id>.md`.
- **B — TypeScript types:** `.d.ts` / source types only.
- **C — Manifests:** the JSON manifest only.
- **D — MCP + validation:** discovery, manifest, examples, then `validate_usage` before final output.

**Acceptance criteria**
- [ ] Each condition uses the same prompt and model settings.
- [ ] Condition D records the validator verdict and whether the model repaired the defect.
- [ ] Conditions are independently runnable (`--condition D`).
- [ ] The harness never gives condition D information the other conditions lack, except the validator and manifest tools.

---

### SLIP-013 · Scoring, metrics, and report generator
**Epic:** 1 · **Priority:** P0 · **Estimate:** 8h · **Labels:** `epic:benchmark`, `type:feature`, `p0` · **Depends on:** SLIP-012

**Metrics**
- Invalid-output rate.
- First-pass correctness (no repair).
- Repair iterations to correct.
- Time/tokens to working output.
- **False-positive rate** on the 20 valid cases.
- Coverage by error class.

**Acceptance criteria**
- [ ] Scores are computed from recorded JSON, not hand-entered.
- [ ] Report generator emits Markdown + charts with confidence intervals where sample size allows.
- [ ] A `--compare` flag diffs two runs by commit and model.
- [ ] The report explicitly states what the benchmark does **not** prove.

---

### SLIP-014 · Run the benchmark (2 models minimum)
**Epic:** 1 · **Priority:** P0 · **Estimate:** 8h + ~$50–150 API budget · **Labels:** `epic:benchmark`, `type:research`, `p0` · **Depends on:** SLIP-013

**Acceptance criteria**
- [ ] 100 cases × 4 conditions × 2 models completed.
- [ ] Every run has a recorded config and raw output.
- [ ] Results reviewed for anomalies (truncation, refusals, tool errors) and rerun where needed.
- [ ] A third model is added if budget allows (P1).
- [ ] Raw data is archived with a checksum.

---

### SLIP-015 · Publish the benchmark and dataset
**Epic:** 1 · **Priority:** P0 · **Estimate:** 6h · **Labels:** `epic:benchmark`, `type:docs`, `p0` · **Depends on:** SLIP-014

**Acceptance criteria**
- [ ] Public page at `/benchmarks/validation` with method, results, limitations, and reproduction command.
- [ ] Dataset and harness are public (MIT or CC-BY) with a version tag.
- [ ] Claims are phrased as "under these conditions, on these models, at this date".
- [ ] No claim of zero hallucinations.
- [ ] The page includes a "what would falsify this" section.

---

### SLIP-016 · Run a third model (P1)
**Epic:** 1 · **Priority:** P1 · **Estimate:** 6h + API budget · **Labels:** `epic:benchmark`, `type:research`, `p1` · **Depends on:** SLIP-013

**Acceptance criteria**
- [ ] Same 100 cases × 4 conditions on a third provider.
- [ ] Results reported as secondary evidence, not used to change the primary conclusion.
- [ ] The model, version, and date are recorded.
- [ ] Budget stays inside the harness cap.

---

## Epic 2 — Competitor testing

### SLIP-020 · Test Nexera UI on the same 100 cases
**Epic:** 2 · **Priority:** P0 · **Estimate:** 6h · **Labels:** `epic:competitor`, `type:research`, `p0` · **Depends on:** SLIP-010

**Context.** Nexera is the closest positioning threat: 180 components, React Aria, Tailwind v4, RTL, WCAG evidence, and a marketed MCP guidebook. Its About page (2026-10-07) still describes the MCP server as "soon," so record what actually ships.

**Acceptance criteria**
- [ ] Record package version, date, and MCP availability.
- [ ] Run the cases its tooling supports; mark unsupported cases explicitly rather than scoring them as failures.
- [ ] Report: validation availability, error classes covered, false positives observed, setup friction.
- [ ] No private or unverifiable claims in the write-up.

---

### SLIP-021 · Test shadcn/ui + AI Elements as the baseline
**Epic:** 2 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:competitor`, `type:research`, `p0` · **Depends on:** SLIP-010

**Acceptance criteria**
- [ ] Same cases where a shadcn/AI Elements equivalent exists.
- [ ] Measure what TypeScript alone catches vs. what remains.
- [ ] Record the AI Elements deprecation/migration state and Tailwind 4 requirement.
- [ ] Conclusion states clearly where shadcn is better (default distribution, breadth, RSC).

---

### SLIP-022 · Test Matrix UI's validation claims
**Epic:** 2 · **Priority:** P1 · **Estimate:** 4h · **Labels:** `epic:competitor`, `type:research`, `p1` · **Depends on:** SLIP-010

**Acceptance criteria**
- [ ] Verify whether `validate component usage` is callable, what it checks, and its output shape.
- [ ] Run 20 representative cases.
- [ ] Record false positives and coverage.
- [ ] Mark unverifiable claims as unverified, not as false.

---

### SLIP-023 · Test assistant-ui for runtime/UX comparison
**Epic:** 2 · **Priority:** P1 · **Estimate:** 6h · **Labels:** `epic:competitor`, `type:research`, `p1` · **Depends on:** SLIP-010

**Acceptance criteria**
- [ ] Compare the AI-chat surface used by the Starter: streaming, tool calls, approvals, attachments.
- [ ] Record setup complexity and runtime coupling.
- [ ] Note where its runtime architecture is stronger than Slipstream's stateless model.

---

### SLIP-024 · Write the competitive comparison and update positioning
**Epic:** 2 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:competitor`, `type:docs`, `p0` · **Depends on:** SLIP-015, SLIP-020, SLIP-021

**Acceptance criteria**
- [ ] Comparison table uses only tested capabilities; unverified cells say "unverified".
- [ ] Positioning statement is updated to the defensible claim.
- [ ] `docs/business-analysis.md` competitor section is updated.
- [ ] The write-up names at least one thing each competitor does better.

---

## Epic 3 — Tailwind v4 support

### SLIP-030 · Audit Tailwind 3.4-specific usage
**Epic:** 3 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:tailwind`, `type:research`, `p0` · **Depends on:** —

**Acceptance criteria**
- [ ] Inventory of v3-only APIs: `tailwind.config.js` preset, `theme()` calls, plugin usage, `@apply` boundaries, dynamic class construction.
- [ ] Each item marked: compatible, needs change, or unsupported in v4.
- [ ] Risk list for consumers migrating existing projects.

---

### SLIP-031 · Add a Tailwind v4 preset while keeping v3.4 support
**Epic:** 3 · **Priority:** P0 · **Estimate:** 10h · **Labels:** `epic:tailwind`, `type:feature`, `p0` · **Depends on:** SLIP-030

**Acceptance criteria**
- [ ] A v4-compatible theme entry ships (CSS-first `@theme` / `@import "tailwindcss"`).
- [ ] Existing v3.4 consumers are unaffected (no breaking change to the current preset).
- [ ] Semantic tokens remain the only public styling contract.
- [ ] No hardcoded palette colours introduced.
- [ ] A fresh Vite app and a fresh Next app both build with v4.

---

### SLIP-032 · Add a v3/v4 compatibility test matrix to CI
**Epic:** 3 · **Priority:** P1 · **Estimate:** 8h · **Labels:** `epic:tailwind`, `type:test`, `p1` · **Depends on:** SLIP-031

**Acceptance criteria**
- [ ] CI builds a representative app against Tailwind 3.4 and 4.x.
- [ ] A visual/smoke test catches token or class regressions.
- [ ] The job is required before release.
- [ ] Failures name the offending component and class.

---

### SLIP-033 · Publish the v4 migration guide and demo
**Epic:** 3 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:tailwind`, `type:docs`, `p0` · **Depends on:** SLIP-031

**Acceptance criteria**
- [ ] `/docs/tailwind-v4` explains setup for Vite and Next.
- [ ] A working demo is deployed.
- [ ] The guide states what changes and what does not.
- [ ] Linked from the compatibility matrix and README.

---

## Epic 4 — AI Chat Starter (first paid product)

> **Product rule:** this is a complete, working application, not a component gallery. If a buyer cannot deploy it, connect a backend, and ship it, it is not done.

### SLIP-040 · Write the product spec and acceptance tests
**Epic:** 4 · **Priority:** P0 · **Estimate:** 3h · **Labels:** `epic:starter`, `type:docs`, `p0` · **Depends on:** SLIP-024

**Required scope**
- Streaming responses with markdown, code blocks, and citations.
- Tool-call timeline, reasoning display, human approval, error/retry.
- File attachments and local conversation history.
- Two backend adapters: Vercel AI SDK and a raw SSE (or LangGraph) adapter.
- Light/dark, mobile, keyboard, reduced motion, WCAG 2.2 AA.

**Acceptance criteria**
- [ ] Spec lists every screen, state, and empty/error case.
- [ ] Each requirement maps to an acceptance test.
- [ ] Explicitly out-of-scope items are listed (auth, multi-tenant, billing inside the starter).
- [ ] Two backend adapters are proven with a written integration contract.

---

### SLIP-041 · Scaffold the starter app
**Epic:** 4 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:starter`, `type:feature`, `p0` · **Depends on:** SLIP-040

**Acceptance criteria**
- [ ] Lives at `apps/starters/ai-chat` (or a documented private repo) and builds in CI.
- [ ] Uses `@slipstream-ui/core`, `@slipstream-ui/ai`, and `@slipstream-ui/themes` from the workspace.
- [ ] No secrets committed; `.env.example` documents every variable.
- [ ] `pnpm dev` works from a clean clone in under 3 minutes.

---

### SLIP-042 · Implement streaming chat, markdown, code blocks, and citations
**Epic:** 4 · **Priority:** P0 · **Estimate:** 12h · **Labels:** `epic:starter`, `type:feature`, `p0` · **Depends on:** SLIP-041

**Acceptance criteria**
- [ ] Token streaming renders incrementally without layout shift.
- [ ] Markdown, code highlighting, copy, and citations render correctly.
- [ ] Stop, retry, and regenerate work.
- [ ] Loading, empty, error, and rate-limited states are designed.
- [ ] Keyboard and screen-reader behaviour verified.

---

### SLIP-043 · Implement tool calls, reasoning, and human approval
**Epic:** 4 · **Priority:** P0 · **Estimate:** 10h · **Labels:** `epic:starter`, `type:feature`, `p0` · **Depends on:** SLIP-042

**Acceptance criteria**
- [ ] Tool call states: pending, running, success, error, denied.
- [ ] Reasoning is collapsible and announced correctly.
- [ ] Approval flow supports approve/deny with a clear audit trail in the UI.
- [ ] Errors are surfaced with a retry path, never swallowed.
- [ ] No business logic in view components; state lives in a controller/hook.

---

### SLIP-044 · Implement attachments and conversation history
**Epic:** 4 · **Priority:** P1 · **Estimate:** 8h · **Labels:** `epic:starter`, `type:feature`, `p1` · **Depends on:** SLIP-042

**Acceptance criteria**
- [ ] Attachments validate type/size and show upload progress and failure.
- [ ] History persists locally (or via a documented adapter) and can be cleared.
- [ ] Empty and corrupted-history states are handled.
- [ ] No PII is sent anywhere not documented.

---

### SLIP-045 · Ship two backend adapters
**Epic:** 4 · **Priority:** P0 · **Estimate:** 8h · **Labels:** `epic:starter`, `type:feature`, `p0` · **Depends on:** SLIP-042

**Acceptance criteria**
- [ ] Adapter 1: Vercel AI SDK (`useChat`-style stream).
- [ ] Adapter 2: raw SSE or LangGraph, without importing the AI SDK.
- [ ] Both implement the same documented contract and pass the same UI tests.
- [ ] Switching adapters is a config change, not a rewrite.

---

### SLIP-046 · Accessibility, responsive, and reduced-motion pass
**Epic:** 4 · **Priority:** P0 · **Estimate:** 5h · **Labels:** `epic:starter`, `type:test`, `p0` · **Depends on:** SLIP-043

**Acceptance criteria**
- [ ] axe-core: zero WCAG 2.2 A/AA violations on every screen.
- [ ] Full keyboard operation; visible focus; focus restore after dialogs.
- [ ] Mobile layout verified at 360px, 768px, 1280px.
- [ ] `prefers-reduced-motion` respected.
- [ ] Screen-reader pass documented (NVDA or VoiceOver), not just automated.

---

### SLIP-047 · Package, license, and purchase flow
**Epic:** 4 · **Priority:** P0 · **Estimate:** 5h · **Labels:** `epic:starter`, `type:feature`, `p0` · **Depends on:** SLIP-041

**Context.** `apps/app` already has Stripe + mock billing, plans, licence keys, and teams. Reuse it; do not build a second billing stack.

**Acceptance criteria**
- [ ] Checkout creates a licence and delivers the product (private repo access or registry token).
- [ ] Licence activation/deactivation is idempotent.
- [ ] Refund/revocation path exists.
- [ ] Purchase requires no sales call.
- [ ] The product page states exactly what is included.

---

### SLIP-048 · Docs, demo, and launch assets
**Epic:** 4 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:starter`, `type:docs`, `p0` · **Depends on:** SLIP-047

**Acceptance criteria**
- [ ] Live demo deployed with a rate limit and no exposed keys.
- [ ] Setup guide covers both adapters and deployment.
- [ ] A 3–5 minute walkthrough video exists.
- [ ] A "what you get / what you don't" section is on the sales page.

---

## Epic 5 — Distribution and measurement

### SLIP-050 · List the MCP server in three registries
**Epic:** 5 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:growth`, `type:chore`, `p0` · **Depends on:** SLIP-024

**Acceptance criteria**
- [ ] Official MCP registry entry with a valid `server.json`.
- [ ] Listings on Smithery and mcp.so (or two equivalents).
- [ ] Each listing links to setup docs and states the five tools.
- [ ] A monthly check reminds the owner to verify the listings.

---

### SLIP-051 · Audit `llms.txt` and per-component markdown
**Epic:** 5 · **Priority:** P0 · **Estimate:** 4h · **Labels:** `epic:growth`, `type:docs`, `p0` · **Depends on:** SLIP-002

**Acceptance criteria**
- [ ] Every component has a canonical markdown route with props, examples, anti-patterns, and a11y notes.
- [ ] `llms.txt` links resolve and match the manifest set.
- [ ] A link checker runs in CI.
- [ ] No stale count or deprecated component name is published.

---

### SLIP-052 · Publish two technical articles
**Epic:** 5 · **Priority:** P1 · **Estimate:** 6h · **Labels:** `epic:growth`, `type:docs`, `p1` · **Depends on:** SLIP-015

**Titles**
1. "We tested 100 AI-generated component usages. Here is what TypeScript missed."
2. "Giving Claude Code a component contract instead of a component gallery."

**Acceptance criteria**
- [ ] Each article links to the reproducible benchmark.
- [ ] Each article includes a working code sample.
- [ ] Claims match the published results exactly.
- [ ] No competitor is misrepresented.

---

### SLIP-053 · Instrument the funnel
**Epic:** 5 · **Priority:** P1 · **Estimate:** 4h · **Labels:** `epic:growth`, `type:chore`, `p1` · **Depends on:** SLIP-048

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
