# Slipstream UI — production-readiness audit plan (2026-11)

Tracking document for the three external audits received on 2026-11-15/16.
Every finding is mapped to an item, a status, and the evidence a reviewer can
check. Code work from this pass is included; owner-only work (domain, legal,
credentials) is listed separately and is **not** marked done.

Status key:

| Status | Meaning |
|---|---|
| `Fixed` | Implemented and verified in this pass. |
| `Verified` | Already satisfied in the repository; evidence recorded below. |
| `Owner` | Requires a decision or credential the maintainer must supply. |
| `Backlog` | Accepted, sequenced after this pass; deliberately not started. |

Audit sources:

1. Production-readiness audit of the live site (positioning, hero, docs, a11y, SEO, competitor matrix).
2. Second pass (legacy vs AI-first identity, first-run flow, MCP, privacy/terms, domain).
3. Third pass (layout, consent UX, counts, discoverability, legal).

---

## A. Release truth and counts (P0)

The audits' highest-priority finding was that the published surfaces disagreed:
homepage/docs at one version and component count, `llms.txt` at another.

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| REL-01 | `llms.txt` advertised 109 components and v0.7.0 while the package was 0.8.0 / 113. | `Fixed` | `llms.txt` and `apps/docs/public/llms.txt` now carry a generated release block derived from `release.json` + manifests; regenerated at build. |
| REL-02 | Two stale copies of `llms.txt` (repo root and `public/`). | `Fixed` | `scripts/generate-llm-docs.ts` writes both from one source; the count gate reads the public copy. |
| REL-03 | The count gate checked section headings but not the summary line or version. | `Fixed` | `scripts/check-component-counts.ts` now validates the version line, the `N components: X in core and Y in ai` line, the registry index, and `llm/index.md`. |
| REL-04 | No single release-metadata source (version, counts, schema/manifest version, release date). | `Fixed` | New `release.json` + `apps/docs/lib/release.ts`; consumed by docs, `llms.txt`, `/llm`, and `/registry`. |
| REL-05 | Changelog duplicated the current version in metadata and prose. | `Fixed` | Releases moved to `apps/docs/lib/releases.ts`; metadata uses `VERSION` and the newest release. |
| REL-06 | Registry payloads lacked a stable component id, docs URL, and manifest/schema versions. | `Fixed` | `scripts/generate-registry.ts` emits `componentId`, `packageVersion`, `manifestVersion`, `schemaVersion`, `docs`; `all.json` gains the release block, and `graph.json`/`recommendations.json` share the same version. |
| REL-07 | README/llms/registry must agree on every release. | `Fixed` | CI gate `pnpm check:counts` (already wired into `validate:manifests`) now covers all four surfaces. |
| REL-08 | "167 tests" style claims must be generated, not typed. | `Verified` | The homepage does not publish a test count; churnable numbers are count-derived. Test totals remain in release notes only. |
| REL-09 | The MCP server advertised `version: 0.0.1` and `server.json` still said 0.2.0 while the package was 0.4.0. | `Fixed` | The server reads `package.json`; `scripts/check-manifest-versions.ts` fails when `server.json` disagrees with the package. |
| REL-10 | A changeset bump can ship without matching site release notes. | `Fixed` | `scripts/check-release-readiness.ts` compares the newest `apps/docs/lib/releases.ts` entry (version + date) to the core package and `release.json`; negative-tested and wired into `validate:manifests`. |

## B. Installation and first-run (P0/P1)

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| HOME-01 | Two install commands competed (`npx slipstream-ui` vs `npx @slipstream-ui/cli`). | `Verified` | Homepage, installation page, quickstart, README and `llms.txt` all use `npx @slipstream-ui/cli@latest init`. The deprecated v3 package is called out on the installation page. |
| HOME-02 | A newcomer needs the sequence, not just the command. | `Fixed` | Homepage gains a five-step "Start building in minutes" section with copy-to-clipboard. |
| HOME-03 | "What is free?" was only discoverable in the repo. | `Fixed` | Homepage gains a plain-language licensing block (all packages, CLI, MCP, registry, templates, MIT) linked to the license and terms. |
| HOME-04 | Installation paths caused decision fatigue. | `Fixed` | Installation page already has a path-comparison table; homepage now states the recommended path and links to it. |
| HOME-05 | Setup time should not be guessed. | `Verified` | No invented duration is published; the section describes steps, not minutes. |

## C. Homepage, positioning and conversion (P1/P2)

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| HOME-10 | Hero is strong but proof should appear earlier. | `Verified` | Hero pairs the claim with a working streaming chat, an install pill, and an agent strip; the live lab follows immediately. |
| HOME-11 | "Zero hallucinated props" is an unqualified absolute. | `Fixed` | Stat relabelled to "false positives on valid usage" and paired with the published 100-case benchmark (65.7% recall / 100% precision) and a methodology link. |
| HOME-12 | Show a real product, not a concept. | `Verified` | Live lab covers data, forms, overlays and a multi-step flow; templates page covers AI chat, agent dashboard, RAG and more. |
| HOME-13 | Comparison claims need methodology and a date. | `Fixed` | Comparison section keeps its dated footnote; the homepage now links the benchmark methodology next to the validator section. |
| HOME-14 | No FAQ for "is it free / does it work with my stack". | `Fixed` | Homepage gains a short FAQ visible to users and mirrored in `FAQPage` JSON-LD. |
| HOME-15 | Social proof is thin. | `Owner` | Do not invent logos, stars or testimonials. Add real adoption evidence when it exists. |
| HOME-16 | New install/free/FAQ sections are English-first. | `Backlog` | They render on every locale with the English source from `lib/marketing/home-extras.ts`; translating them is a follow-up, not a silent machine translation. |

## D. Documentation and developer experience (P1)

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| DOC-01 | Component pages should be complete implementation references. | `Verified` | Pages have lede, install tabs, demos, props, anti-patterns, accessibility, composition, browser support, prev/next, and manifest markdown. |
| DOC-02 | Add a "Copy for AI" action. | `Fixed` | New `CopyForAi` button on every component page copies a versioned instruction built from the live manifest (props, required, anti-patterns, accessibility, examples, canonical URLs). |
| DOC-03 | Search should understand natural language. | `Fixed` | `SearchEntry.aliases` added; palette matches aliases. Examples: "AI typing indicator", "ask before running tool", "table with filters", "dark mode". |
| DOC-04 | No public playground. | `Fixed` | New `/playground` route: live preview, prop controls, JSX preview, viewport widths, copy JSX, copy install, copy AI instructions, reset. |
| DOC-05 | Docs feedback is a binary yes/no. | `Fixed` | Feedback now records usefulness plus "did the example work", and links failing pages to a pre-filled issue. |
| DOC-06 | No "edit this page" / a11y report link. | `Fixed` | Docs shell footer adds "Edit this page" and "Report an accessibility issue" links built from the current path. |
| DOC-07 | Information architecture should follow developer intent. | `Verified` | Sidebar already groups Getting Started, AI-First, Guides, Components (by intent), and now Playground. |
| DOC-08 | Search must be first-class. | `Verified` | Command palette (`Cmd/Ctrl+K`) covers components, guides, manifests, MCP and CLI; aliases added in DOC-03. |
| DOC-09 | Framework compatibility matrix required. | `Verified` | `/docs/compatibility`, `docs/compatibility.md`, and the installation path table. |
| DOC-10 | Bundle sizes must be published. | `Verified` | `docs/bundle-size.md` + `scripts/audit-sizes.mjs` with budgets; referenced from the release checklist. |
| DOC-11 | The component index was a long unsearchable list. | `Fixed` | `/docs/components` now has a search-first catalog with category chips, live counts and an empty state. |
| DOC-12 | The playground and maintenance links are English-first. | `Backlog` | Developer tooling copy is English; the localized docs shell remains around it. |
| DOC-13 | Human component pages could stick on “Loading documentation…” or render without manifest sections. | `Fixed` | `CheckboxGroup` now points at the `checkbox` manifest instead of a nonexistent `checkbox-group.json`; the Tooltip demo is a client component so cloning its trigger no longer hits React error #130. `check:docs-links` fails on any missing registry payload, and `smoke:routes` renders all 135 routes, checks for the error boundary and probes client navigation. Both run in CI. |

## E. Accessibility (P1)

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| A11Y-01 | Automated coverage per component and per theme. | `Verified` | jest-axe per component; `audit:a11y` (13 routes × light/dark) and `audit:dark` (every manifest route) exit non-zero on violations. |
| A11Y-02 | Public accessibility statement with limitations and reporting. | `Verified` | `/accessibility` covers target, testing, limitations, reporting. |
| A11Y-03 | Component-level scorecard. | `Fixed` | `/accessibility/scorecard` lists all 113 components with axe coverage, interaction tests, manifest requirement counts and docs/manifest links; a unit test fails if any component loses its axe assertion or manifest notes. |
| A11Y-04 | Manual screen-reader and 400% zoom audit. | `Owner` | Requires real AT sessions; tracked as a release blocker for a WCAG conformance claim. |
| A11Y-05 | Focus/announcement contracts for streaming. | `Verified` | Documented in `/docs/guides/accessibility-ai`; `Conversation` announces completion, not each token. |

## F. SEO and AI discoverability (P1/P2)

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| SEO-01 | Unique titles, descriptions, canonicals, OG/Twitter. | `Verified` | `withSeo()` applied per route. |
| SEO-02 | Sitemap completeness and stable `lastModified`. | `Fixed` | Sitemap now uses the release date and includes every nav route, including `/playground`. |
| SEO-03 | Structured data breadth. | `Fixed` | Organization, WebSite, SoftwareApplication, TechArticle, Breadcrumb, CollectionPage already present; homepage adds FAQPage for visible questions. |
| SEO-04 | Legacy Tailwind 2/3 documentation is still indexed. | `Owner` | Requires Search Console access to enumerate indexed URLs. A deprecation banner and `/docs/changelog` redirect exist; add redirects once the URL list is exported. |
| SEO-05 | `/llms.txt`, `/llms-full.txt`, `/llm/**`, `/registry/**` must be release-aware. | `Fixed` | Release block includes version, date, schema/manifest versions, counts, canonical URLs, install command. |
| SEO-06 | Article/content engine. | `Fixed` | Two technical articles now publish at `/articles` and `/articles/<slug>`, server-rendered from `apps/docs/content/articles/`, with GFM tables, `Article` JSON-LD, sitemap entries and an llms.txt article list. Cadence remains an editorial decision. |
| SEO-07 | AI integration landing page. | `Verified` | `/docs/guides/agent-integration`, `/docs/guides/ide-setup`, `/docs/mcp`. |

## G. Architecture, CLI, MCP, security (P1)

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| TECH-01 | Registry/manifests are the contract layer. | `Verified` | Docs, MCP, registry and LLM markdown all derive from `packages/*/src/manifests`. |
| TECH-02 | Manifest parity gates. | `Verified` | `validate:manifests` runs schema, TS↔manifest drift, version, and count checks. |
| TECH-03 | MCP error handling and malformed input. | `Verified` | `@slipstream-ui/mcp-server` tests cover parsing, unknown props, native attributes, whole-tree `files[]`, and fix suggestions. |
| TECH-04 | CLI can modify user projects with no preview. | `Fixed` | `add` gains `--dry-run`: prints every create/overwrite/skip decision and writes nothing; unit-tested. |
| TECH-05 | Overwrite safety. | `Verified` | `--overwrite` is opt-in; existing files are skipped by default. |
| TECH-06 | Windows paths and monorepos. | `Verified` | Path handling normalizes separators; CLI tests run on Windows and Linux CI. |
| TECH-07 | Security headers, CSP, security.txt. | `Verified` | `next.config.mjs` (CSP report-only, HSTS, frame denial), `_headers`, `.well-known/security.txt`, `SECURITY.md`. |
| TECH-08 | Prompt-injection boundary in manifests. | `Verified` | Manifests are structured JSON; MCP responses are schema-shaped; no manifest text is executed. Documented as a boundary in `/docs/mcp`. |
| TECH-09 | Supply chain: provenance, audit, lockfile. | `Verified` | Changesets publish with npm provenance in CI; `pnpm audit:packages`; lockfile committed. |
| TECH-10 | 9 dependency advisories (8 moderate, 1 low) on `main`. | `Fixed` | `pnpm audit` is clean: Next 16.4.6 (app/docs/starter), hono 4.13.16, @hono/node-server 2.1.6, glob 14.0.3 via pinned overrides. Re-verified build, 15 test tasks, E2E, visual and axe. |
| TECH-11 | Validator only checked props, enums and required fields; it could not catch an unnamed icon-only control. | `Fixed` | `validate_usage` now requires an accessible name on `size="icon"` (aria-label/aria-labelledby/title, alt text, text or expression children) and returns a fix. Three tests cover fail/pass/empty-label cases; copy and docs now state the exact scope. |
| TECH-12 | State-machine and streaming invariants are not validated. | `Backlog` | The benchmark shows 10% recall for both classes. Needs manifest-level state rules; do not fake semantic coverage. |

## H. Legal, privacy and trust (P1)

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| LEGAL-01 | Consent can only be withdrawn by clearing site data. | `Fixed` | New privacy-preferences control on `/privacy` (and linked from the banner area): current state, Accept, Decline, Reset. |
| LEGAL-02 | Processor list and data inventory. | `Fixed` | Privacy copy lists Netlify, Google Analytics, GitHub and npm, with purpose and retention. |
| LEGAL-03 | AI-generated code disclaimer. | `Fixed` | Terms now state the scope of static validation and that accessibility checks are not a WCAG conformance guarantee. |
| LEGAL-04 | Governing law, entity, trademarks, security reporting. | `Owner` | Requires counsel and the real operating entity/address. `apps/docs/lib/site.ts` keeps explicit TODOs rather than invented details. |
| LEGAL-05 | MIT scope and trademark carve-out. | `Fixed` | Terms state MIT scope, notice retention, and that the license grants no trademark rights. |
| LEGAL-06 | Duplicate object key hid part of the terms copy. | `Verified` | Checked in the current source: the changes and contact sentences are separate blocks. |

## I. Operations and validation (P2)

| ID | Finding | Status | Evidence / change |
|---|---|---|---|
| OPS-01 | Uptime/error monitoring, status page. | `Owner` | Hosted-service decision; the library is local and the site is static-first. |
| OPS-02 | Usability interviews and funnel metrics. | `Owner` | Needs real participants; consent-gated analytics already records install copies and search selections. |
| OPS-03 | Benchmark run with real models. | `Owner` | `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` required; harness and methodology are in `benchmarks/` and `docs/benchmarks.md`. |
| OPS-04 | Public example gallery / community templates. | `Backlog` | Templates page covers five curated starting points. |
| OPS-05 | Component relationship graph and dependency visualization. | `Fixed` | `/registry/graph.json` emits 113 nodes and 413 composition/related edges, checked for dangling links; component pages show the npm and registry dependency footprint. |
| OPS-07 | Context-aware component selection ("build a dashboard with filters"). | `Fixed` | New MCP tool `recommend_components` maps a goal to a coherent component set with reasons and docs URLs; the same recipes publish as `/registry/recommendations.json`, checked so every id resolves to a graph node. Tests cover chat/table/form/RAG/agent goals, limit and package filters. |
| OPS-06 | Hardcoded palette colors bypass the token contract. | `Fixed` | `pnpm check:tokens` scans core/AI component source for palette utilities, allowlists only the Button contrast/onDark variants, and runs inside `validate:manifests`/CI. |
| OPS-08 | Full visual/token validation of composed layouts. | `Backlog` | Playwright visual baselines cover the shell chrome; validating arbitrary compositions needs a separate design-system linter. |
| OPS-09 | The unknown-prop benchmark fixture used `data-*`, which the validator intentionally accepts, masking real recall. | `Fixed` | The fixture now uses `hallucinatedProp`; `bench:generate`/`bench:check`/`bench:test` are green and the mock baseline is re-verified at 65.7% recall, 100% precision, 0 false positives. |

---

## Verification for this pass

```bash
pnpm check:counts                 # version + counts across llms, registry, llm, README
pnpm validate:manifests           # schema, drift, versions (incl. MCP server.json), counts
pnpm check:llm                    # manifests ↔ markdown
pnpm --filter @slipstream-ui/cli test
pnpm --filter @slipstream-ui/mcp-server test
pnpm --filter slipstream-ui-docs typecheck
pnpm --filter slipstream-ui-docs lint
pnpm --filter slipstream-ui-docs build
pnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111   # 58 page runs, 0 violations
pnpm test:e2e                     # 16 Playwright journeys, including SSR article content
pnpm audit                        # no known vulnerabilities
```

The a11y suite includes `/playground`, the search-first component catalog, both
article routes and the component scorecard in light and dark mode.

Negative test run for the release gate: replacing the version in
`apps/docs/public/llms.txt` with `0.7.0` makes `pnpm check:counts` exit 1 with
the expected/found diff.

## Files changed in this pass

- `release.json`, `apps/docs/lib/release.ts` — release metadata source.
- `scripts/generate-llm-docs.ts`, `scripts/generate-registry.ts`,
  `scripts/check-component-counts.ts`, `scripts/check-manifest-versions.ts` —
  generated release blocks, registry metadata, the relationship graph, and the
  gates that keep them aligned.
- `apps/docs/lib/releases.ts`, `apps/docs/app/changelog/page.tsx` — one release list.
- `apps/docs/components/copy-for-ai.tsx`, `apps/docs/components/component-page.tsx` — Copy for AI.
- `apps/docs/app/playground/page.tsx`, `apps/docs/components/site/playground.tsx` — playground.
- `apps/docs/app/articles/**`, `apps/docs/lib/articles.ts`, `apps/docs/lib/markdown.tsx` — published article routes with a server-rendered markdown renderer.
- `apps/docs/content/articles/*.md`, `apps/docs/content/articles.json` — canonical article source and metadata.
- `apps/docs/app/accessibility/scorecard/page.tsx`, `apps/docs/lib/a11y-scorecard.ts` — per-component accessibility evidence with a fail-closed test.
- `apps/docs/components/component-catalog.tsx`, `apps/docs/app/docs/components/page.tsx` — search-first catalog.
- `apps/docs/public/registry/graph.json` (generated), `scripts/generate-registry.ts`, `apps/docs/app/docs/ai-manifests/page.tsx`, `component-page.tsx` — relationship graph and dependency footprint.
- `packages/mcp-server/src/tools/recipes.ts`, `apps/docs/public/registry/recommendations.json` — shared intent recipes published as a static artifact.
- `apps/docs/lib/search-index.ts`, `apps/docs/components/site/command-palette.tsx` — aliases.
- `apps/docs/components/site/page-feedback.tsx`, `docs-page-meta.tsx` — feedback reasons and edit/a11y links.
- `apps/docs/components/site/privacy-preferences.tsx`, `apps/docs/lib/site.ts`,
  `apps/docs/components/site/analytics.tsx` — reversible consent.
- `apps/docs/components/site/home-page.tsx`, `apps/docs/lib/marketing/home-extras.ts` — install/free/FAQ + benchmark note.
- `apps/docs/lib/structured-data.ts`, `apps/docs/app/page.tsx`, `apps/docs/components/component-page.tsx` — FAQPage + breadcrumb JSON-LD.
- `apps/docs/app/sitemap.ts`, `apps/docs/components/site/footer.tsx` — release date, playground, release line.
- `apps/docs/lib/marketing/en.ts` (privacy, terms, accessibility, stats) and the six other locale stat labels.
- `packages/cli/src/commands/add.ts`, `add.test.ts`, `list.ts`, `init.ts` — `--dry-run` and canonical commands.
- `packages/mcp-server/src/index.ts`, `packages/mcp-server/server.json` — version from package.
- `README.md`, `STRUCTURE.md`, `AGENTS.md`, `.github/workflows/ci.yml` — removed hand-maintained inventories, documented release metadata, widened the generated-file gate.
- `apps/docs/scripts/audit-a11y.ts`, `audit-dark-mode.ts` — playground and catalog in the audit matrix.

## Deliberately out of scope

These are listed above as `Owner` or `Backlog` so they are not mistaken for
completed work: real-user interviews, manual screen-reader testing, trademark
and domain verification, legal review, hosted status page, live-model benchmark
runs, the component relationship graph, and visual/token validation.
