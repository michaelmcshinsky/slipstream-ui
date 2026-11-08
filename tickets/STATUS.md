# Backlog status — 2026-11-08

Canonical tickets: [`SLIP-*.md`](./SLIP-001.md) · Triage: [`TRIAGE.md`](./TRIAGE.md)
Implementation plan: [`../docs/engineering-backlog.md`](../docs/engineering-backlog.md)

## Release 0.6.0 / 0.6.1 (2026-11-08)

Published to npm from CI with provenance, each with a GitHub release and tag:

| Package | Version |
|---|---|
| `@slipstream-ui/core` | 0.6.1 |
| `@slipstream-ui/ai` | 0.6.1 |
| `@slipstream-ui/themes` | 0.6.1 |
| `@slipstream-ui/mcp-server` | 0.3.1 |
| `@slipstream-ui/cli` | 0.2.2 |
| `@slipstream-ui/registry` | 0.2.2 |
| `@slipstream-ui/i18n` | 0.3.1 |

Gate fixes that landed in the same release:

| ID | Deliverable |
|---|---|
| SLIP-099 | **Done** — core/ai/themes 0.6.0 → 0.6.1, mcp-server 0.3.1, cli/registry 0.2.2, i18n 0.3.1 published from CI |
| SLIP-103 | Prisma client generated on install; tests run with bounded turbo concurrency |
| SLIP-104 | Docs navbar links reach the 24px WCAG 2.2 target size; axe 26/26 clean |
| SLIP-105 | Per-file subpath modules emit under `dist/src` on Windows and Linux |
| SLIP-106 | Bundle-size audit executes the esbuild platform binary on Linux |
| SLIP-107 | 0.6.1: Tailwind v4 peer range and the modal-layer cleanup warning |

Consumer state: `utah-esports` moved from the vendored 0.5.0 tarballs to the
published `^0.6.1` packages and `^0.3.1` MCP server, with `pnpm peers check`
clean and `pnpm check` green.

## Completed (37)

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
| SLIP-070 | Marketing blocks II: LogoCloud, FeatureGrid, FeatureRow, Testimonial, ProcessSteps, ArticleCard, Newsletter, ContactStrip, AnnouncementBar |
| SLIP-062 | P1 component labels (Autocomplete, Breadcrumb, DatePicker/TimePicker, FileUpload, Search, CommandPalette, Toast, Skeleton, AppShell) |
| SLIP-073 | Dashboard filter layer: MultiSelect, FilterPanel, DateRangePicker, AppliedFilters |
| SLIP-063 | AI timestamp `formatTime`/`locale` props + starter wiring |
| SLIP-095 | React Hook Form compatibility guide + Select callback docs |
| SLIP-096 | Packaged stylesheet smoke test + CI + release checklist |
| SLIP-100 | Registry and LLM docs regenerated at 100 components |
| SLIP-094 | Bundle and stylesheet size audit + budgets |
| SLIP-097 | AuthLayout `variant="split"` + aside slot |
| SLIP-098 | PageHeader `documentHead()` helper + docs |
| SLIP-099 | Published 0.6.0/0.6.1 (core, ai, themes), `mcp-server` 0.3.1, `cli`/`registry` 0.2.2, `i18n` 0.3.1 from CI |
| SLIP-103 | Prisma client generated on install; bounded test concurrency |
| SLIP-104 | Docs navbar 24px target size (WCAG 2.2) |
| SLIP-105 | Subpath modules emit under `dist/src` on every platform |
| SLIP-106 | Size audit runs the esbuild platform binary |
| SLIP-107 | 0.6.1: Tailwind v4 peer range + modal-layer cleanup |

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


## Axial adoption (2026-11-07)

Epic 7 implements the gaps in [`../reports/axial-adoption-gap-analysis.md`](../reports/axial-adoption-gap-analysis.md).
Tickets: SLIP-070 through SLIP-087.

| ID | Status | Note |
|---|---|---|
| SLIP-070 | **Done** | 9 marketing blocks II shipped; 104 components total (87 core + 17 AI) |
| SLIP-071 | Ready | Depends on 070; video/team/pricing/audio |
| SLIP-072 | Ready | Depends on 070; content hub blocks |
| SLIP-073 | **Done** | MultiSelect, FilterPanel, DateRangePicker, AppliedFilters |
| SLIP-074 | Ready | Depends on 070; charts package |
| SLIP-075 | Ready | Depends on 070; marketplace cards |
| SLIP-076 | Blocked | Depends on 075 |
| SLIP-077 | Ready | Depends on 070; forms conversion kit |
| SLIP-078 | Ready | Independent SEO package |
| SLIP-079 | Ready | Independent consent package |
| SLIP-080 | Ready | Independent icons/media package |
| SLIP-081 | Ready | Depends on 070; header/footer v2 |
| SLIP-082 | Blocked | Depends on 070 and 081 |
| SLIP-083 | Blocked | Depends on 070, 073, 075 and 081 |
| SLIP-084 | Ready | Depends on 070; Storybook/visual regression |
| SLIP-085 | Ready | Depends on 070; Tailwind v4 app certification |
| SLIP-086 | Blocked | Depends on 084 |
| SLIP-087 | Blocked | Depends on 070, 073 and 075 |

## Internationalization (2026-11-06)

- Shared `@slipstream-ui/i18n` runtime: en/ar/es/ko/ja/ru/zh, RTL, typed keys, plurals, Intl.
- AI Chat Starter and the changelog page fully localized; server `lang`/`dir`, cookie switcher, localized mock/checkout.
- Published `@slipstream-ui/i18n@0.3.0` with the four new catalogs.
- `Reasoning` and `ToolCall` accept label overrides.
- Plan for docs, dashboard, playground and remaining component labels: [`../docs/i18n-plan.md`](../docs/i18n-plan.md).
- Tracking ticket: [`SLIP-060.md`](./SLIP-060.md).

### i18n ticket status

| ID | Status | Note |
|---|---|---|
| SLIP-061 | **Done** | Button, Pagination, DataTable, Dialog, Drawer label props + tests/manifests |
| SLIP-062 | **Done** | Autocomplete, Breadcrumb, DatePicker/TimePicker, FileUpload, Search, CommandPalette, Toast, Skeleton, AppShell label props + tests/manifests |
| SLIP-063 | **Done** | Message/Reasoning `formatTime`/`locale` timestamp props + starter wiring |
| SLIP-064 | **Partial** | Docs provider, `lang`/`dir`, navbar switcher, translated shell nav and changelog page; path URLs/SEO/metadata pending |
| SLIP-065 | Pending | Docs guides/component page translation |
| SLIP-066 | **Partial** | Dashboard provider, switcher, nav/sign-out/suspended copy; flows/currency/auth pending |
| SLIP-067 | Pending | Transactional emails |
| SLIP-068 | **Partial** | `en-XA` pseudo-locale + playground toggle + en/ar axe checks; visual regression pending |
| SLIP-095 | **Done** | React Hook Form guide + Select native/value callback docs |
| SLIP-096 | **Done** | Packaged stylesheet smoke test + CI + release checklist |
## Integration hardening (2026-11-07)

| ID | Status | Note |
|---|---|---|
| SLIP-090 | **Done** | `validate_usage` parses JSX-valued props and allows native attributes (`f134b5b`) |
| SLIP-091 | **Done** | AppShell rail is viewport-height; Sidebar parents stay active on nested routes (`a0b5723`) |
| SLIP-092 | **Done** | SiteHeader `navLabel` / `mobileNavLabel` (`a0b5723`) |
| SLIP-093 | Pending | Shell visual regression |
| SLIP-094 | **Done** | Prebuilt CSS/JS size audit + budgets (`docs/bundle-size.md`) |
| SLIP-095 | **Done** | RHF compatibility docs |
| SLIP-096 | **Done** | Packaged stylesheet smoke test + CI + release checklist |
| SLIP-097 | **Done** | AuthLayout split/aside variant + fallback + docs |
| SLIP-098 | **Done** | PageHeader `documentHead()` helper + docs |
| SLIP-099 | **Done** | core/ai/themes 0.6.0 then 0.6.1, mcp-server 0.3.1, cli/registry 0.2.2, i18n 0.3.1 |
| SLIP-100 | **Done** | Registry/LLM docs regenerated at 100 components; validate and checks pass |
| SLIP-101 | **Done** | React dedupe note for linked checkouts |
| SLIP-102 | **Done** | `ListItem.description` accepts ReactNode; manifest and docs updated |
| SLIP-103 | **Done** | `prepare: prisma generate`, `turbo test --concurrency=2`, serialized app SQLite suite |
| SLIP-104 | **Done** | Navbar `inline-flex h-6 items-center`; axe 26/26 clean |
| SLIP-105 | **Done** | `outDir: dist/src` + normalized entry keys; `verify:modules` green |
| SLIP-106 | **Done** | Platform-aware esbuild invocation in the size audit |
| SLIP-107 | **Done** | Themes peer `^3.4.0 || ^4.0.0`; modal-layer `layerId` capture; 0.6.1 published |
| SLIP-108 | Ready | `success-ink` token for success text on a tint; ToolCall/Confirmation chips + axe coverage |

## Verification

```bash
pnpm typecheck                  # 17 packages
pnpm lint                       # 10 packages
pnpm test                       # 1221 tests: core 621, ai 153, app 375, starter 25, mcp 17, cli 16, i18n 14
pnpm build                      # 12 tasks
pnpm validate:manifests         # 104 valid, 0 drift, counts match
pnpm check:llm                  # 104 manifests ↔ markdown
pnpm check:components           # 104 components with tests, examples, a11y notes and docs
pnpm verify:tailwind-v4         # compile fixture
pnpm verify:tailwind3           # preset compile fixture
pnpm verify:modules             # root client bundle, server-safe subpaths, explicit imports
pnpm verify:registry            # registry cache reload
node scripts/test-packaged-styles.mjs   # packing smoke test
node scripts/audit-sizes.mjs            # CSS/JS budgets
pnpm --filter slipstream-ui-docs build  # 144 routes
pnpm --filter slipstream-ui-docs audit:a11y -- <url>   # 26 page runs, 0 violations
pnpm --filter slipstream-ai-chat-starter build
```

## Baseline result

Mock provider, 100 cases × 4 conditions: **65.7% recall, 100% precision, 0%
false positives**. Structural classes 100%; accessibility 40%; state/streaming
10%. See [`../docs/benchmarks.md`](../docs/benchmarks.md).


