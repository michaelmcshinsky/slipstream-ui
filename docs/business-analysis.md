# Slipstream UI — Market, Customer, Competitive & Feasibility Analysis

**Prepared:** 2026-11-05
**Subject:** Slipstream UI (`@slipstream-ui/*`) — an AI-first React component library
**Scope:** US-first, global-English developer market
**Method:** Primary repo inspection + secondary market research + transparent bottom-up modelling

> **How to read this document.** Facts drawn from public sources are cited in
> [Appendix B](#appendix-b--sources) and marked `[S]`. Figures produced by the model in
> this document are marked `[M]` and carry their assumptions inline. Nothing here is a
> purchased market report; where the category has no clean published size, the document
> triangulates and says so. Confidence is stated per section.

**Revision log (2026-11-05, post-review).** Three corrections were applied after a second
pass: (1) component counts are **80** (63 core + 17 AI), not 73 — verified against
`packages/*/src/manifests`; (2) current releases are `0.4.0` (Nov 2026); the `v2.6.4`
tag belongs to the legacy pre-rebuild library; (3) the competitor set was expanded to
include **Nexera UI** and **Matrix UI**, both of which market MCP-based usage validation.
"Validation is unique" is therefore **not** a safe claim; "validation is proven and
measurably better" is the claim to earn.

**Status update (same day).** Several recommendations below have since shipped:
the Tailwind v4 theme contract and a compile fixture (`pnpm verify:tailwind-v4`),
the 100-case benchmark (65.7% structural recall, 0% false positives — see
[`benchmarks.md`](./benchmarks.md)), and the AI Chat Starter
(`apps/starters/ai-chat`). The analysis is retained as the pre-implementation
view; the compatibility matrix is the current source of truth.

---

## Executive summary

**Verdict: the wedge is real, the window is 12–18 months, and the current product is not yet packaged to capture it.**

Slipstream UI has the strongest *technical* answer to a problem the market has only recently named — AI-generated UI that silently drifts from the design system — but it has almost no distribution, a Tailwind-version mismatch with the ecosystem, and a Pro tier whose paid value is mostly "coming soon."

Five findings drive the recommendation:

1. **The pain is now mainstream, not hypothetical.** 90% of professional developers use an AI coding agent weekly and 68% daily; 39% use Claude Code at work (47% in the US). `[S]` Design-system teams report AI hallucination and drift as their top AI concern. `[S]` Slipstream's `validate_usage` tool — which rejects hallucinated props before they ship — addresses the exact failure mode. No competitor in this analysis exposes the same combination of standalone, agent-callable validation across 80 components, but validation itself is no longer novel: Nexera UI, Matrix UI and Marmo all market some form of generated-usage checking. The burden is now to prove Slipstream's validation is measurably better, not merely present.
2. **"Machine-readable manifests + MCP" is becoming table stakes.** Lucent UI, FrogiUI, Lightswind, Neuctra, Marmo, Nexera UI, Matrix UI and shadcn itself now ship manifest/MCP layers. `[S]` The differentiator is no longer *having* a manifest; it is **proven validation, breadth, and distribution**.
3. **The dominant competitor just absorbed the category.** Vercel's AI Elements is deprecated end-November 2026 and has been rebuilt as 21 patterns inside shadcn/ui. `[S]` shadcn has ~123–126k GitHub stars and 7.3–8.7M weekly CLI downloads. `[S]` Competing head-on on "AI chat components" is unwinnable; competing on **validation + full application surface + runtime independence** is defensible.
4. **The category is early but crowded and commoditising fast.** ~55,700 MCP servers are listed in the official registry alone. `[S]` Within 12–18 months, "AI-readable component spec" will be expected, not differentiating. Distribution and trust will decide winners.
5. **The business is viable as a lean, product-led company, not as a paid-search business.** Modelled TAM is ~$250M/yr (range $150–400M), SAM ~$50M (range $35–80M), and a realistic 36-month SOM of ~$1.5M ARR. `[M]` Paid acquisition at $29/mo does not work (CAC $250–500 vs. $695 Pro LTV); open-source distribution, MCP directories, and team/enterprise sales do.

**Recommendation:** spend the next 90 days closing the three gaps that block adoption — **Tailwind v4 support**, **a public proof of `validate_usage` working**, and **a Pro tier with shipped value** — then launch through OSS/MCP channels, not ads.

---

## 0. Evidence base

### 0.1 What was inspected in the repo

| Artefact | Finding |
|---|---|
| `README.md` | 80 components (63 core + 17 AI), 80 manifests, 5 MCP tools, MIT, shadcn-compatible registry, Tailwind 3.4, React 18/19, Node ≥20.9 |
| `packages/*/package.json` | `@slipstream-ui/core` 0.4.0, `ai` 0.4.0, `themes` 0.3.0, `cli` 0.2.1, `mcp-server` 0.2.0, `registry` 0.2.0 |
| `apps/app/src/lib/plans.ts` | Free / Pro $29 / Team $99 (10 seats) / Enterprise $499 (100 seats); license keys with 3 machine activations |
| `docs/competitor-research.md` | Prior competitive notes on shadcn/ui, AI Elements, assistant-ui, Mantine, daisyUI |
| `AGENTS.md` / `.github` | CI gates, axe accessibility audits, Lighthouse audits, npm provenance |
| npm registry (week ending 2026-11-04) | `core` 451 downloads, `ai` 427, `cli` 240 `[S]` |
| GitHub API (2026-11-05) | 3 stars, 0 forks, 15 open issues, repo created 2021-03-10 `[S]` |

### 0.2 Confidence by section

| Section | Confidence | Why |
|---|---|---|
| Market size | Medium-low | No published category; triangulated from adjacent markets + bottom-up |
| Pain points | High | Multiple 2026 sources converge (JetBrains, zeroheight, Gusto, Atlassian, O'Reilly) |
| Customer personas | Medium | Derived from ecosystem behaviour + repo positioning; needs 10 interviews |
| Competitor facts | High | Official docs, changelogs, and pricing pages |
| Financial model | Medium-low | Scenario model, not a forecast; assumptions listed |
| Operational plan | Medium | Based on repo state and standard DevTool playbooks |

---

## 1. Market analysis

### 1.1 Market definition and boundaries

Slipstream does not compete in "all of software development tools" ($7.4B in 2026, 16.1% CAGR `[S]`). It competes in a narrower, younger category:

> **AI-legible React UI infrastructure** — component libraries, copy-in registries, premium blocks/templates, and the machine-readable spec/MCP layer that lets coding agents use them correctly.

Boundaries that matter:

- **In scope:** React/Next.js component libraries, copy-in registries, premium blocks, design-system manifest tooling, MCP servers for UI.
- **Adjacent but not core:** full design-system platforms (Storybook, Chromatic, zeroheight, Supernova), general AI coding assistants, Figma.
- **Buyer:** the developer or design-systems engineer who chooses the UI layer, plus the engineering manager who approves team spend.

### 1.2 Market size and growth

#### Triangulation

| Method | Estimate | Notes |
|---|---|---|
| Top-down from software dev tools | $7.44B (2026) × 3–5% UI-library share = **$220–370M** `[S]`/`[M]` | Mordor: $7.44B → $15.72B by 2031, 16.12% CAGR |
| Top-down from AI developer tools | $12.5B (2025) × 2–4% UI/design-system share = **$250–500M** `[S]`/`[M]` | Vendor estimate, lower confidence; 24.5% CAGR to 2032 |
| Bottom-up (individuals) | 2.1M library choosers × 15% paid × ~$120/yr = **~$38M** `[M]` | Conservative; misses lifetime/block-pack purchases |
| Bottom-up (teams) | 150k product teams × 12% buying UI tooling × ~$1,500/yr = **~$27M** `[M]` | Under-counts agencies and enterprise |
| Ecosystem proxies | shadcn CLI 7.3–8.7M weekly downloads; React used by ~40% of developers `[S]` | Demand signal, not revenue |

**Working TAM (2026): $250M/yr, range $150–400M.** Growing 18–25%/yr, faster than the underlying dev-tools market because AI is expanding both the number of UI authors and the willingness to pay for correctness.

**Authoritative download snapshot (npm API, 7 days to 2026-11-04):** Tailwind CSS 170.8M,
Radix dialog 90.7M, shadcn CLI 17.4M, MUI 13.6M, Headless UI 9.9M, Mantine 3.6M,
Chakra UI 2.1M. `[S]` These are higher than some third-party snapshots cited above
(7.3-8.7M for the shadcn CLI); the npm API is the more current source.

#### Market sizing summary

| Layer | 2026 estimate | Definition | Confidence |
|---|---|---|---|
| **TAM** | **$250M** ($150–400M) | Global annual spend on React UI libraries, premium blocks/templates, and AI UI tooling | Medium-low |
| **SAM** | **$50M** ($35–80M) | AI-first React libraries + manifest/MCP tooling for teams using coding agents | Medium-low |
| **SOM (36 mo)** | **$1.5M ARR** ($0.5–3.0M) | 3% of SAM, captured through OSS + PLG + team sales | Medium |

> The SOM is deliberately modest. It reflects current distribution (3 GitHub stars, ~450 weekly downloads) rather than product quality. Reaching $1.5M ARR requires roughly 1,000–1,500 Pro equivalents, which is a distribution problem, not a product problem.

### 1.3 Demand validation and pain points

The five highest-severity problems Slipstream can address, drawn from 2026 practitioner sources:

| # | Pain point | Severity | Current solutions | Price points | Gap Slipstream can fill |
|---|---|---|---|---|---|
| 1 | **Hallucinated props/variants** — agent invents `intent="confirm"` or `size="lg"` that do not exist | Critical | Human review; TypeScript catches some; shadcn source-in-repo | $0 (shadcn) to $15/mo (21st AI) | `validate_usage` rejects invalid usage *before* it ships. No direct competitor exposes a standalone validator. |
| 2 | **Silent design-system drift** — output looks on-brand but uses off-system spacing, colours, renamed props | Critical | Chromatic visual regression, token linting, docs discipline | $0–$500+/mo | Manifest + composition rules + validation as a CI gate; could extend to a drift audit. |
| 3 | **Agents bypass the design system** — raw HTML/Tailwind instead of the component | High | Prompt engineering, AGENTS.md, MCP | $0–$9.99/mo | MCP-first discovery + a component catalog the agent cannot escape; strongest for private design systems. |
| 4 | **Review doesn't scale** — seniors can review 20–30 components/week; agents generate hundreds | High | Sampling, CI checks, visual review | Tooling + headcount | Deterministic validation reduces review surface; machine-readable anti-patterns. |
| 5 | **AI chat UI is rebuilt from scratch** — streaming, reasoning, tool calls, approvals, citations | Medium-high | AI Elements, assistant-ui, shadcn patterns | $0–$99/mo (assistant-ui cloud optional) | 17 AI components that are runtime-independent (no AI SDK lock-in). |

**Demand signal strength:** Strong for #1–#3 at the team level; moderate for #5 at the individual level (shadcn is free and default). Slipstream's best demand is **where correctness has a cost** — design-system teams, agencies with brand contracts, and regulated/product-critical apps.

### 1.4 Market trends and timing

| Trend | What is changing | Stage | Opportunity for Slipstream | Threat |
|---|---|---|---|---|
| **1. Agentic coding becomes the default UI author** | 90% weekly / 68% daily agent use; Claude Code 39% at work, 47% US `[S]` | Early-mid | Distribution shifts from human docs to MCP/llms.txt; a small library can be discovered by agents directly | Agents default to shadcn; training data favours incumbents |
| **2. Design-system legibility becomes a quality bar** | zeroheight 2026: AI hallucination is a top concern; Gusto/Atlassian publish manifest/MCP work `[S]` | Early | Manifests + validation are the product; B2B "make your DS AI-legible" is a larger adjacent market | Every library adds manifests → commoditisation |
| **3. AI UI components consolidate into shadcn/ui** | AI Elements deprecated end-Nov 2026; rebuilt as 21 shadcn patterns `[S]` | Mid | Migration demand; "runtime-independent alternative" positioning | shadcn owns the default and the distribution |
| **4. Code-ownership/copy-in beats npm packages** | shadcn CLI 7.3–8.7M weekly; the model is copied by nearly every new library `[S]` | Mature/peaking | Slipstream already ships a shadcn-compatible registry | Table stakes; no longer differentiating |
| **5. Tailwind v4 + CSS-first theming** | shadcn and AI Elements target Tailwind 4; Slipstream targets 3.4 `[S]`/repo | Mid | Fast follower opportunity | **Active adoption blocker today** |
| **6. MCP ecosystem explosion** | 55,713 servers in the official registry; 41–49% of software orgs in production/pilot `[S]` | Early-mid | Be present in every registry, with a validation tool agents recommend | Discovery crowding; security scrutiny |

#### Timing verdict

**Enter now, but move fast.** The demand curve is rising (trend 1–2), and the dominant competitor's migration (trend 3) creates a 6–12 month window of user discomfort. However, the moat is eroding: manifests + MCP will be commodity by 2027–2028. The durable advantages are:

1. **Validation quality** (`validate_usage`) and the eval data behind it.
2. **Breadth** (80 components spanning app shell + AI, not just chat).
3. **Runtime independence** (no AI SDK lock-in).
4. **Distribution** — which Slipstream does not yet have.

Historical parallel: Mantine and Chakra succeeded by being *complete and well-documented* while React moved; daisyUI succeeded by owning a styling niche. Libraries that failed (e.g., many 2021-era "Tailwind component" kits) had breadth without distribution or a wedge. Slipstream has a wedge but not distribution.

### 1.5 Market analysis conclusion

**RTL is no longer a differentiator.** shadcn/ui shipped first-class RTL on 2026-01-28 —
the CLI transforms physical Tailwind classes to logical equivalents at install time, and
RTL examples exist for every component. `[S]` Any plan that treats RTL as the primary
wedge is competing with a free, default-distribution incumbent. RTL remains a useful
*secondary* capability, especially for Arabic/Hebrew typography and bidi edge cases that
class transformation does not solve.

- The market is **large enough to build a $1–3M ARR business**, not a venture-scale platform on components alone.
- The **most valuable adjacent market is B2B**: helping teams make their *own* design system AI-legible. That is larger than selling a generic component library and is where the design-system pain is most acute.
- **Timing is good for the next 12–18 months.** Waiting means competing against commodity manifests from shadcn and every copycat.

---

### 1.6 Benchmark baseline (2026-11-05)

The 100-case benchmark in [`docs/benchmarks.md`](./benchmarks.md) measured the
current validator before repair: **65.7% recall, 100% precision, 0% false
positives**. It catches unknown props, invalid enums, missing required props and
missing compound roots reliably, but only 40% of accessibility defects and 10% of
state/streaming defects. The "validation" wedge is therefore **structural, not
semantic** today. Closing that gap is the product work that would justify the
stronger claim.

## 2. Customer insights

### 2.1 Personas

#### Persona A — "The AI-first indie builder" (primary Pro buyer)

| Attribute | Detail |
|---|---|
| Age / location | 24–38, global-English, often US/EU/India |
| Income | $60–140k (salary or founder draw) |
| Occupation | Solo founder, indie hacker, small product team engineer |
| Lifestyle | Ships fast, works in Cursor/Claude Code, learns from X/YouTube/newsletters |
| Values | Speed, ownership, taste, not looking like "AI slop" |
| Daily challenge | Agent generates plausible UI that breaks on real props; debugging costs hours |
| Channels | X, Reddit r/reactjs, Hacker News, YouTube, Discord, GitHub, newsletters |
| Buying behaviour | Self-serve, card in hand, decides in hours; abhors sales calls |
| Pain points | Hallucinated props, inconsistent styling, rework, no time to read docs |
| Objections | "shadcn is free." "I can copy this from GitHub." "Will this survive?" |
| What convinces them | A 60-second demo showing a hallucinated prop rejected; copy-paste install; visible GitHub activity |
| Willingness to pay | $10–30/mo; $99–199 lifetime for blocks |

#### Persona B — "The design-system engineer" (primary Team/Enterprise buyer)

| Attribute | Detail |
|---|---|
| Age / location | 30–45, US/EU, mostly remote |
| Income | $140–220k |
| Occupation | Staff engineer / design-system lead at a 20–500-person product company |
| Lifestyle | Owns an internal system, writes docs nobody reads, reviews PRs all day |
| Values | Correctness, accessibility, governance, low maintenance burden |
| Daily challenge | Agents bypass the system or invent props; drift accumulates one PR at a time |
| Channels | Internal Slack, GitHub, Storybook, conference talks, O'Reilly, design-system communities |
| Buying behaviour | Committee: staff engineer + design lead + eng manager; 2–6 week evaluation |
| Pain points | Review bottleneck, stale docs, no machine-readable spec, AI ignores the system |
| Objections | "We already have our own system." "We'd rather generate manifests ourselves." "Security review of an MCP server." |
| What convinces them | An eval/benchmark, private-manifest support, CI integration, SSO/audit, a reference customer |
| Willingness to pay | $99–499/mo team; $5k–20k/yr enterprise |

#### Persona C — "The agency/studio lead" (fast, pragmatic Team buyer)

| Attribute | Detail |
|---|---|
| Age / location | 30–50, global |
| Income | $100–200k (owner) |
| Occupation | Founder/CTO of a 5–25-person web studio |
| Lifestyle | Juggles multiple client brands, tight deadlines, junior developers |
| Values | Margin, speed, reusable starting points, licence clarity |
| Daily challenge | Every client needs a different theme; juniors ship inconsistent UI |
| Channels | Referrals, Clutch, X/LinkedIn, template marketplaces, 21st/shadcnblocks |
| Buying behaviour | Buys blocks/templates/lifetime licences; repeats purchases; low tolerance for per-seat pricing |
| Pain points | Rebuilding the same app shell, inconsistent theming, accessibility QA |
| Objections | "Per-seat pricing punishes us." "We need white-label rights." |
| What convinces them | Premium blocks, multi-brand theming, agency licence, lifetime option |
| Willingness to pay | $29–99/mo; $199–499 lifetime per kit |

### 2.2 Purchase motivation and willingness to pay

**Primary motivations**

| Motivation | Type | Weight |
|---|---|---|
| Stop wasting hours fixing AI-generated UI | Rational | 35% |
| Ship a professional-looking product without a designer | Emotional + rational | 25% |
| Preserve design-system consistency / brand | Rational + professional pride | 20% |
| Avoid lock-in and own the code | Emotional (control) | 12% |
| Accessibility/compliance confidence | Rational | 8% |

**Budget and decision timeline**

| Segment | Budget | Timeline | Who decides |
|---|---|---|---|
| Indie | $0–30/mo | Minutes–days | Self |
| Design-system team | $100–500/mo | 2–6 weeks | Staff engineer + design lead + manager |
| Agency | $30–100/mo or lifetime | Days–2 weeks | Owner |
| Enterprise | $5k–20k/yr | 3–6 months | Platform eng + security + procurement |

**Feature priorities (ranked)**

1. Correct, stable prop APIs and TypeScript types.
2. Zero-friction MCP setup (one command, works in Claude Code/Cursor/Codex).
3. Validation and error messages that explain *why* usage is wrong.
4. Accessibility (WCAG 2.2 AA, keyboard, reduced motion).
5. Theming/token control (`createTheme`).
6. Framework compatibility (React 19, Next 15/16, **Tailwind v4**).
7. Copy-in ownership and licence clarity.
8. Breadth (app shell, forms, data display), not just chat.

**Common reasons for delay/avoidance**

- Free shadcn + AI Elements covers 80% of the need.
- Switching cost and NIH ("not invented here").
- Per-seat pricing for agencies.
- Uncertainty about project longevity and bus factor.
- Confusion about what MIT does and does not allow.
- Security review of an MCP server.
- Tailwind v3.4 vs v4 mismatch (a hard blocker for new projects).

### 2.3 Messaging that resonates

**Lead message (indie):**
> "Your agent gets the spec, not a guess. 80 components, 80 manifests, and a validator that rejects hallucinated props before they ship."

**Lead message (design-system team):**
> "Stop reviewing AI-generated UI. Slipstream turns your component API into a machine-readable contract your agent must satisfy — and fails the build when it doesn't."

**Proof assets that convert**

- A side-by-side: same prompt, same model, with and without `validate_usage`; count invalid props and time-to-working-screen.
- A 90-second terminal recording: `init` → agent builds a settings page → validation catches one bad prop → fix.
- A migration guide from AI Elements with a codemod.
- Public eval: N prompts × 3 models × prop-validity rate.

**Messages to avoid**

- "World's first AI-native library" — contested and unprovable (FrogiUI, Lucent, Lightswind all claim variants).
- "Better than shadcn" — triggers defensiveness; position as complementary/validated.
- "AI writes your UI" — buyers fear slop; sell control, not autonomy.

### 2.4 Segment prioritisation

| Priority | Segment | Why | Motion |
|---|---|---|---|
| 1 | Design-system engineers at 20–500-person product companies | Highest pain, highest ACV, clear ROI | Content + eval + sales-assist |
| 2 | AI-first indie builders | Largest volume, fastest feedback, lowest CAC | OSS + MCP + launch |
| 3 | Agencies/studios | Repeat purchases, lifetime licences, blocks | Templates + partner programme |
| 4 | Enterprise | Long cycles, needs SSO/audit/SLA not yet shipped | Defer 12 months |

---

## 3. Competitive landscape

### 3.1 Direct competitors

| Competitor | Model / licence | Components | AI spec layer | MCP | Pricing | Strengths | Key weaknesses |
|---|---|---|---|---|---|---|---|
| **shadcn/ui + AI Elements** | Copy-in registry, MIT | ~76 core + 21 AI patterns | Markdown docs; registry schema; no per-component manifest with anti-patterns | Yes (docs MCP) | Free | Default in v0/Lovable/Bolt/Cursor; 123–126k stars; 7.3–8.7M weekly CLI `[S]` | No validation gate; AI Elements migration churn; Tailwind 4 only |
| **assistant-ui** | npm + optional cloud, MIT | Chat primitives | No manifest layer | No | Free; cloud paid | Best runtime/adapter architecture; React/RN/Ink; strong UX | AI-chat only; no general component surface; no agent spec |
| **Lucent UI** | npm, MIT | 67 (28 atoms, 25 molecules, 12 patterns) | **COMPONENT_MANIFEST** per component | **Yes** (3 tools) | Free (early access) | Closest positioning match; `createTheme`, presets, DevTools | Smaller breadth; early access; no validation tool |
| **FrogiUI** | Copy-paste, commercial | 500+ examples | "Component IQ" | **Yes** | Not disclosed | Strong marketing; ChatGPT/Claude/Cursor integrations | Claims are broad; example-heavy rather than API-stable |
| **Lightswind UI** | Copy-in, MIT + Pro | 160+ | Docs/manifests | **Yes** | Pro licence key | Animated components; MCP installs; Pro blocks | Motion-heavy; Pro paywall; less design-system rigour |
| **Neuctra UI** | npm/CLI, MIT | 20+ | Manifest-ish | **Yes** | Free | Clean SaaS focus; hosted/local MCP | Small surface |
| **Marmo UI** | npm + MCP, MIT | Core set | DESIGN.md + live props | **Yes** | Free core; $9.99/mo Pro | On-brand generation; validation before landing | Early; small catalog |
| **21st.dev** | Registry/marketplace | 12,000+ | Prompt + code | **Yes** | $6–15/mo | Massive catalog; designer-made; agent-native | Not a coherent design system; quality varies; marketplace economics |
| **Nexera UI** | npm, MIT | 180 (8 families) | Live prop docs + WCAG evidence; MCP guidebook | **Yes** (marketed) | Free | React Aria, Tailwind v4, RTL, `createTheme`, per-component WCAG 2.2 evidence; closest positioning threat | Very large surface; MCP validation still described as forthcoming; enterprise-oriented, less AI-chat focus |
| **Matrix UI** | npm, MIT | Not verified | MCP discovery + validation tools | **Yes** | Free | Explicitly markets "validate component usage", accessibility checks, theme consistency | Early; claims need independent verification; small mindshare |

### 3.2 Indirect competitors

| Competitor | Why it matters | Price | Threat level |
|---|---|---|---|
| **MUI / MUI X** | Default enterprise React kit; 90+ components; paid X tier | Free core; X paid | Medium (different buyer) |
| **Mantine** | 100+ components + hooks; excellent docs; MIT | Free | Medium |
| **Chakra UI** | 50+ components; strong DX | Free | Low-medium |
| **Ant Design** | Enterprise/data-dense; huge in APAC | Free | Low (different aesthetic) |
| **daisyUI** | Tailwind class-based; 35k stars | Free | Low |
| **Storybook + Chromatic** | Owns design-system workflow and visual regression | Free/paid | High as a *platform* competitor for DS teams |
| **zeroheight / Supernova** | Design-system documentation platforms | Paid | Medium (B2B adjacency) |
| **v0 / Lovable / Bolt** | Generate UI directly, default to shadcn | Subscriptions | High (channel + competitor) |
| **Cursor / Claude Code / Codex** | The actual UI author; could ship their own component knowledge | Subscriptions | High (platform risk) |

### 3.3 Patterns across the competitive set

1. **Manifests and MCP are converging to parity.** Lucent, Frogi, Lightswind, Neuctra, Marmo, 21st and shadcn all have some form. The spec layer is no longer a moat by itself.
2. **Validation is becoming a claimed feature, not a proven one.** Manifests describe; they do not enforce. Marmo validates inside its own generation flow; Nexera and Matrix market MCP validation; Slipstream's `validate_usage` is currently a heuristic regex parser, not an AST/TypeScript-aware checker. The wedge is real only if Slipstream proves it catches errors the others miss — that is the purpose of the 100-case benchmark.
3. **Breadth vs. AI-only.** assistant-ui and AI Elements are AI-chat-only; Slipstream and Lucent cover the full app surface. For a real product, the full surface wins.
4. **Runtime independence is rare.** AI Elements couples to the Vercel AI SDK; assistant-ui is runtime-first but has no spec layer. Slipstream's structural adapter is a genuine differentiator during the AI Elements migration.
5. **Pricing is bifurcating:** free OSS + paid blocks/templates/lifetime (shadcnblocks $149–399, Untitled UI from $349) vs. low-cost subscriptions (21st $6/mo, Marmo $9.99/mo). Slipstream's $29/$99/$499 is at the high end for a library with no shipped premium content.
6. **Distribution beats features.** shadcn wins because agents were trained on it and default to it. Any challenger must be discoverable *inside the agent*, not just on the web.

### 3.4 Market gaps and underserved segments

| Gap | Why competitors ignored it | Unmet need | Difficulty | Slipstream's angle |
|---|---|---|---|---|
| **1. Validation/guardrails** | Manifests are easier to ship than validators; validation requires a real type/eval system | "Don't let the agent ship a prop that doesn't exist" | Medium (already built) | Lead with `validate_usage`; publish eval data; make it a CI gate |
| **2. Private design-system legibility** | Big libraries sell *their* components, not yours | "Make *our* system readable to agents" | High (per-customer schemas) | Productise manifest generation + MCP for private systems; services-assisted |
| **3. Runtime-independent AI UI** | AI Elements is strategically tied to AI SDK | "Don't lock me into one SDK generation" | Medium | Keep the adapter structural; publish compatibility tests |
| **4. Full-surface AI-first library** | Most entrants are chat-only or core-only | "One library for app shell + AI" | Medium | 63 core + 17 AI is already the widest AI-first surface |
| **5. Migration + drift audit** | Incumbents don't want to highlight churn | "Help me move off AI Elements / audit drift" | Low-medium | Codemod + audit report as lead magnets |

### 3.5 SWOT

**Strengths**

- Widest AI-first surface: 63 core + 17 AI components in one system.
- 80 manifests with anti-patterns, a11y and composition rules; drift-checked in CI.
- `validate_usage` — standalone enforcement layer with no direct equivalent among the competitors reviewed.
- Runtime-independent AI adapter (no SDK lock-in).
- shadcn-compatible registry + CLI + MCP server.
- Strong engineering hygiene: typecheck, lint, tests, axe audits, Lighthouse, provenance.
- MIT licence removes adoption friction.

**Weaknesses**

- Distribution: 3 GitHub stars, ~450 weekly downloads, 15 open issues, single maintainer.
- **Tailwind 3.4 only** while the ecosystem moves to v4 — a hard blocker for new projects.
- AI component set (17) is narrower than shadcn's 21 patterns + deep AI SDK integration.
- Pro tier sells licence keys for MIT code; premium templates are "coming soon."
- No hosted/cloud product, no team analytics, no SSO/audit yet.
- Brand unknown; no case studies or public evals.

**Opportunities**

- AI Elements deprecation (end-Nov 2026) → migration demand.
- Design-system teams need private manifests + validation (higher ACV).
- MCP registry listings and agent-native discovery are still cheap.
- Tailwind v4 support unlocks the default new-project stack.
- Premium blocks/templates for agencies; lifetime licences.
- Enterprise licensing (SSO, audit, SLA) once team demand is proven.

**Threats**

- shadcn/Vercel: free, default, and now owns AI Elements patterns.
- Lucent UI: near-identical positioning, already 67 components.
- Frogi/Lightswind/Neuctra/Marmo/21st: fast followers with MCP.
- Commoditisation of manifests within 12–18 months.
- MIT copying and licence-key enforceability.
- Platform risk: Tailwind/Radix breaking changes; React 19/RSC shifts.
- Security scrutiny of MCP servers; maintainer burnout.

### 3.6 Positioning statement

> **For** product teams whose coding agents write UI, **Slipstream UI** is the AI-first React component library that **enforces your component API instead of just describing it**. Unlike shadcn/ui and AI Elements, Slipstream ships 80 components with machine-readable manifests **and** a validator that rejects hallucinated props before they ship — with no runtime lock-in.

**Category label to own:** "validated UI for AI agents" (not "AI-native components").

---

## 4. Business feasibility

### 4.1 TAM / SAM / SOM with assumptions

| Layer | 2026 (base) | Range | Key assumptions |
|---|---|---|---|
| **TAM** | $250M | $150–400M | Global React UI library/block/AI-UI spend; 18–25% growth; triangulated top-down and bottom-up |
| **SAM** | $50M | $35–80M | AI-assisted React teams willing to adopt a third-party AI-first library; ~20% of TAM during the transition |
| **SOM (36 mo)** | $1.5M ARR | $0.5–3.0M | 3% of SAM; ~1,000–1,500 Pro-equivalent subscriptions |

**Bottom-up sanity check (SOM):**

| Segment | Paying units | ARPU/mo | MRR | ARR |
|---|---|---|---|---|
| Pro | 1,200 | $29 | $34,800 | $417,600 |
| Team | 90 | $99 | $8,910 | $106,920 |
| Enterprise | 8 | $499 | $3,992 | $47,904 |
| **Total** | | | **$47,702** | **$572,424** |

The table above is the **base case at month 18**, not month 36. It is below the SOM upper bound; reaching $1.5M requires roughly 3× that base trajectory or a successful team/enterprise motion.

### 4.2 Pricing and unit economics

Current plan structure (`apps/app/src/lib/plans.ts`):

| Plan | Price | Seats | Included | Assessment |
|---|---|---|---|---|
| Free | $0 | 1 | All OSS components, manifests, MCP | Correct; this is the distribution engine |
| Pro | $29/mo | 1 | Licence key, 3 activations, templates/blocks "coming soon" | **Too thin today.** Licence keys for MIT code are not a compelling reason to pay |
| Team | $99/mo | 10 | Shared licensing, team billing | Reasonable if team features ship |
| Enterprise | $499/mo | 100 | Audit log, SSO "coming soon" | Premature; do not sell unshipped features |

**Unit economics (modelled)**

| Plan | Price/mo | COGS/mo | Gross margin | Monthly churn | LTV | Target CAC | LTV/CAC | Payback |
|---|---|---|---|---|---|---|---|---|
| Pro | $29 | $1.20 | 96% | 4% | $695 | $100–150 | 4.6–7.0 | 4–6 mo |
| Team | $99 | $3.20 | 97% | 2% | $4,790 | $600–1,000 | 4.8–8.0 | 6–10 mo |
| Enterprise | $499 | $15.00 | 97% | 1% | $48,400 | $5,000–10,000 | 4.8–9.7 | 10–20 mo |

**Pricing recommendations**

1. **Do not charge for the MIT components.** Charge for what is scarce: validated premium blocks, private-manifest tooling, team governance, support, and evals.
2. **Add an annual plan** (2 months free) to reduce churn and improve cash.
3. **Add a lifetime/agency licence** ($199–499) for the agency persona; per-seat pricing repels them.
4. **Raise Team to $149/mo** only after shipping team analytics/SSO; $99 is fine for now.
5. **Remove or clearly label "coming soon"** features from paid plans. Selling futures erodes trust with developers.

### 4.3 18-month financial scenarios

Assumptions: paid launch at month 1; Pro $29, Team $99, Enterprise $499; 20% of customers on annual (2 months free); churn as above; no enterprise sales hire.

#### Conservative

| Quarter | Pro | Team | Ent | MRR | ARR run-rate |
|---|---|---|---|---|---|
| Q1 | 15 | 1 | 0 | $534 | $6.4k |
| Q2 | 45 | 4 | 0 | $1,701 | $20.4k |
| Q3 | 90 | 10 | 1 | $4,099 | $49.2k |
| Q4 | 150 | 20 | 2 | $7,328 | $87.9k |
| Q5 | 220 | 32 | 3 | $11,045 | $132.5k |
| Q6 | 300 | 45 | 5 | $15,650 | $187.8k |

Cumulative revenue ≈ **$95–100k**.

#### Base

| Quarter | Pro | Team | Ent | MRR | ARR run-rate |
|---|---|---|---|---|---|
| Q1 | 40 | 2 | 0 | $1,358 | $16.3k |
| Q2 | 140 | 10 | 1 | $5,549 | $66.6k |
| Q3 | 320 | 30 | 3 | $13,747 | $165.0k |
| Q4 | 600 | 65 | 6 | $26,829 | $321.9k |
| Q5 | 950 | 110 | 10 | $43,430 | $521.2k |
| Q6 | 1,400 | 170 | 15 | $64,915 | $779.0k |

Cumulative revenue ≈ **$360–390k**.

#### Aggressive

| Quarter | Pro | Team | Ent | MRR | ARR run-rate |
|---|---|---|---|---|---|
| Q1 | 100 | 5 | 0 | $3,395 | $40.7k |
| Q2 | 400 | 30 | 2 | $15,568 | $186.8k |
| Q3 | 1,000 | 90 | 6 | $40,904 | $490.8k |
| Q4 | 2,000 | 200 | 15 | $85,285 | $1.02M |
| Q5 | 3,200 | 350 | 25 | $139,925 | $1.68M |
| Q6 | 4,500 | 500 | 35 | $197,465 | $2.37M |

Cumulative revenue ≈ **$1.1–1.2M**.

**Scenario drivers:** the difference between conservative and aggressive is almost entirely distribution (MCP registry placement, a successful launch, one design-system case study), not product capability.

### 4.4 Break-even and profitability

**Monthly fixed cost (lean, excluding founder draw):**

| Item | Monthly |
|---|---|
| Hosting/infra (Vercel, Neon, Sentry, Resend, analytics) | $500 |
| Contract design/content | $3,000 |
| Legal/accounting/admin | $400 |
| Marketing/experiments | $1,500 |
| Community/support tooling | $500 |
| Contingency | $600 |
| **Total** | **~$6,500** |

Plus Stripe ~3% of revenue.

| Break-even definition | Required MRR | Base case timing |
|---|---|---|
| Cash opex only ($6.5k) | ~$6,700 | Q3 (month 8–10) |
| Opex + $10k founder draw | ~$17,000 | Q4 (month 10–12) |
| Opex + $15k founder draw + contractor | ~$22,000 | Q4–Q5 (month 12–15) |

**Profitability:** at the base case month 18 (~$65k MRR), the business generates roughly **$58k/month gross profit** before founder pay — viable as a bootstrapped company, not yet venture-scale on components alone.

### 4.5 $500 demand-test simulation

**Objective:** estimate whether paid acquisition can seed the funnel.

| Channel | Spend | CPC / CPM | Clicks | Signup rate | Signups | Paid conversion | New paid | CAC |
|---|---|---|---|---|---|---|---|---|
| Google Search (exact: "react ai components", "ai component library") | $250 | $5.50 | 45 | 10% | 4.5 | 15% | 0.7 | ~$357 |
| Dev newsletter sponsorship | $500 | $60 CPM | 120 | 12% | 14.4 | 8% | 1.2 | ~$417 |
| Reddit r/reactjs + X + Dev.to (organic, 8h) | $0 | — | ~800 | 3% | 24 | 6% | 1.4 | ~time |
| MCP registries + `llms.txt` directories | $0 | — | ~30 qualified | 20% | 6 | 15% | 0.9 | $0 |
| Show HN / Product Hunt launch | $0 | — | 300 | 8% | 24 | 5% | 1.2 | $0 |

**Prediction:** 8–20 trials and 2–4 paid conversions in the first $500-equivalent push. **Paid-only CAC $350–500**, which is 1.4–2.8× Pro LTV — **not viable**. Blended CAC with organic/MCP is $0–150, which is viable.

**Recommended channel mix**

1. **MCP registries and agent-native directories** (official MCP registry, Smithery, mcp.so, 21st, awesome lists) — highest intent, lowest cost.
2. **Technical content** with reproducible evals ("we tested 3 models × 100 prompts; here is the invalid-prop rate with and without validation").
3. **OSS contribution and migration guides** (AI Elements → Slipstream; shadcn drift audit).
4. **Launch events** (Show HN, Product Hunt, React newsletter) for spikes, not steady state.
5. **Paid search only for Team/Enterprise intent** ("design system MCP", "AI design system governance"), never for generic Pro.

### 4.6 Operational requirements and month-by-month plan

**Resource requirements**

| Area | Requirement | Cost |
|---|---|---|
| Engineering | 1 founder-engineer (full-time) | Opportunity cost |
| Design | Contract designer for blocks/templates | $1,500–3,000/mo |
| Content/DevRel | Contract writer or founder | $2,000–5,000/mo |
| Support | Founder, then part-time | $0 → $1,500/mo |
| Infra | Vercel/Netlify, Neon Postgres, Stripe, Resend, Sentry, analytics | $500/mo |
| Legal | MIT compliance, privacy (GDPR/CCPA), trademark, licence terms | $2k–5k one-off |
| Security | SBOM, dependency scanning, MCP auth review | $0–5k |

**Month-by-month plan**

| Months | Milestones | Cost focus |
|---|---|---|
| 1–2 | **Tailwind v4 support**; MCP registry listings; Stripe live; pricing page; privacy/terms; `validate_usage` public demo; analytics | Infra + design |
| 3–4 | Public launch (HN/PH/X); AI Elements migration guide + codemod; 5 premium blocks; 10 customer interviews | Launch + content |
| 5–6 | Private-manifest beta (bring-your-own design system); team features; first case study; eval report #1 | Contract dev + content |
| 7–9 | Premium template library; agency/lifetime licence; CI validation action; MCP security hardening | Design + marketing |
| 10–12 | Team analytics; SSO/audit (only if enterprise demand proven); eval report #2; partnership outreach | Engineering |
| 13–18 | Expand AI components; Vue/Svelte feasibility; annual plans; agency programme; consider services | Growth |

**First-year operating budget:** ~$78k fixed + ~$30k marketing/contract + $2–5k legal ≈ **$110–115k**, excluding founder pay.

### 4.7 Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| shadcn/AI Elements absorbs the category | High | High | Do not compete on chat components; lead with validation + full surface + runtime independence |
| Manifests become commodity | High | High | Build the eval/validation moat; publish benchmarks; own "validated UI" category |
| Tailwind v4 gap blocks adoption | High | High | Ship v4 support in 60 days; keep v3 compatibility |
| MIT copying / licence enforcement | High | Medium | Accept it; monetise blocks, private manifests, support, and team governance — not the OSS code |
| Low distribution / no launch traction | Medium-high | High | MCP directories, OSS, newsletters, eval content; target 3 launches in 90 days |
| Single-maintainer bus factor | High | High | Publish roadmap, recruit 2–3 contributors, document governance, consider a foundation/escrow later |
| MCP security concerns | Medium | Medium | Least-privilege server, no write tools, audit logs, signed releases, security.txt (already present) |
| Paid tier value gap | High | High | Ship templates/blocks/team features before charging; remove "coming soon" from paid plans |
| Platform changes (React 19/RSC, Radix→Base UI) | Medium | Medium | Compatibility matrix; adapter tests; deprecation policy |
| Accessibility regression | Medium | High | Keep axe CI gate; publish VPAT-style statement; never market beyond audited scope |

### 4.8 30-day validation plan (with kill criteria)

| Experiment | Success metric | Kill signal |
|---|---|---|
| 1. Ship Tailwind v4 compatibility | Docs demo builds on v4; tests pass | Not shippable in 60 days |
| 2. Publish `validate_usage` eval | 100 prompts × 3 models; measurable invalid-prop reduction | No measurable difference vs. baseline manifests |
| 3. List in 3+ MCP registries | 100+ qualified sessions in 30 days | <20 sessions |
| 4. AI Elements migration guide + codemod | 200 page views; 20 installs | <5 installs |
| 5. 10 customer interviews (5 indie, 5 DS leads) | 3 confirm WTP ≥$29/$99; 2 ask for private manifests | <1 confirms WTP |

**Strategic kill/pivot criteria (90 days):** if fewer than 10% of trial users invoke `validate_usage` and fewer than 2% convert to paid after 60 days, the "validation" wedge is not resonating. In that case, pivot toward **B2B private-manifest/design-system legibility services** (higher ACV, clearer ROI) rather than continuing to market a generic component library.

---

## Appendix A — Assumptions register

| ID | Assumption | Value | Confidence | How to test |
|---|---|---|---|---|
| A1 | Professional developers worldwide | ~20M | Medium | Cross-check JetBrains/SO populations |
| A2 | Share using React regularly | 35% | Medium | npm/Stack Overflow trend |
| A3 | Share choosing UI tooling | 30% | Low | Survey |
| A4 | Paid share of choosers | 12–15% | Low | Competitor revenue estimates |
| A5 | Average annual spend (individual) | $120 | Medium | Pricing pages |
| A6 | Product teams buying UI tooling | 12% of 150k | Low | Bottom-up interviews |
| A7 | Average team spend | $1,500/yr | Medium | Pricing pages |
| A8 | Free→paid conversion | 2–4%/mo active | Medium | Cohort data after launch |
| A9 | Pro monthly churn | 4% | Medium | Cohort data |
| A10 | Team monthly churn | 2% | Low | Cohort data |
| A11 | Enterprise monthly churn | 1% | Low | Cohort data |
| A12 | Blended CAC (organic) | $0–150 | Low | Channel experiments |
| A13 | Paid CAC | $250–500 | Medium | $500 test |
| A14 | Fixed opex | $6.5k/mo | Medium | Actuals |
| A15 | Founder draw | $10k/mo | — | Decision |

---

## Appendix B — Sources

Market and adoption

- JetBrains, *AI Coding Agents: Adoption Trends* (Aug 2026) — 90% weekly / 68% daily; Claude Code 39%, Copilot 21%, Codex 16%, Cursor 12%; 15,509 respondents, May–Jul 2026. https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026
- Quashbugs, *AI Coding Assistant Statistics 2026* (Aug 2026) — corroborates JetBrains figures. https://quashbugs.com/blog/ai-coding-assistant-statistics
- Cyborb, *AI coding statistics 2026* (Sep 2026) — 47% of code agent-written. https://cyborb.ai/blog/ai-coding-statistics-2026
- Mordor Intelligence, *Software Development Tools Market* (2026) — $7.44B → $15.72B by 2031, 16.12% CAGR. https://www.mordorintelligence.com/industry-reports/software-development-tools-market
- PW Consulting, *AI Developer Tools Market* (Jun 2026) — $12.5B (2025) → $57.96B (2032), 24.5% CAGR (vendor estimate). https://pmarketresearch.com/it/ai-developer-tools-market
- Stacklok, *State of MCP in Software 2026* — 41–49% of software orgs in limited/broad production; 80% of primary users are developers; security is top obstacle (64%). https://stacklok.com/resources/state-of-mcp-in-software-2026/
- Gravity, *MCP Adoption Statistics 2026* (Oct 2026) — 55,713 servers in the official registry; 20,761 on Smithery. https://gravity.fast/data/mcp-adoption-statistics/
- Zuplo, *The State of MCP* (Dec 2025) — 70% have 2–7 MCP servers; 49% measure ROI by productivity. https://zuplo.com/mcp-report

Competitors

- shadcn/ui changelog, *October 2026 — Trace, Code Block and AI Elements* — 21 patterns; AI Elements migration. https://ui.shadcn.com/docs/changelog/2026-10-ai-elements
- shadcn/ui, *AI Elements* — copy-in patterns, no package. https://ui.shadcn.com/docs/ai-elements
- Vercel, `vercel/ai-elements` — deprecation notice, end of November 2026. https://github.com/vercel/ai-elements
- Vercel AI Elements docs — Tailwind 4 / React 19 prerequisites. https://elements.ai-sdk.dev/docs/setup
- shadcn-ui GitHub org — 126k stars, 13k forks (Oct 2026). https://github.com/orgs/shadcn-ui/repositories
- Untitled UI, *Untitled UI vs shadcn/ui* (Sep 2026) — 123,709 stars; 7.31M weekly CLI downloads. https://www.untitledui.com/blog/untitled-ui-vs-shadcn
- webconsulting.at, *shadcn/ui code ownership* (Oct 2025, updated Aug 2026) — 122.5k stars; 8.7M weekly CLI. https://www.webconsulting.at/blog/shadcn-ui-code-ownership
- assistant-ui — MIT + optional cloud. https://github.com/assistant-ui/assistant-ui · https://www.assistant-ui.com/pricing
- Lucent UI — 67 components, COMPONENT_MANIFEST, MCP. https://www.lucentui.com/ · https://www.lucentui.dev/
- FrogiUI — Component IQ, MCP, 500+ examples. https://frogiui.com/
- Lightswind UI — 160+ components, MCP, Pro licence. https://unpkg.com/lightswind@3.2.4/README.md
- Neuctra UI — MCP, CLI. https://ui.neuctra.com/
- Marmo UI — free core MCP; $9.99/mo Pro. https://www.marmoui.com/pricing
- 21st.dev — 12,000+ components; $6/mo Builder. https://21st.dev/pricing
- shadcnblocks — $149–399 lifetime. https://www.shadcnblocks.com/
- Mantine — MIT. https://mantine.dev/getting-started/
- daisyUI — Tailwind plugin. https://daisyui.com/docs/intro/
- Nexera UI — 180 components, React Aria, Tailwind v4, RTL, WCAG evidence, MCP guidebook. https://www.nexera-ui.com/ · https://www.nexera-ui.com/get-started
- Matrix UI — MCP discovery and usage validation claims. https://matrix-ui.com/docs/ai/mcp-overview
- shadcn/ui, *January 2026 — RTL Support* — CLI-level class transformation. https://ui.shadcn.com/docs/changelog/2026-01-rtl
- npm downloads API (7 days to 2026-11-04) — Tailwind 170.8M, Radix dialog 90.7M, shadcn 17.4M, MUI 13.6M, Headless UI 9.9M, Mantine 3.6M, Chakra 2.1M. https://api.npmjs.org/downloads/point/last-week/tailwindcss

Customer / design-system pain

- zeroheight, *Design Systems Report 2026* — React dominant; AI hallucination a top concern; 39% code generation. https://report.zeroheight.com/
- Gusto Engineering, *Eval-Driven Design Systems* (Jul 2026) — hallucinated props, schema-grounding. https://engineering.gusto.com/eval-driven-design-systems-8f781dc2dacb
- Atlassian, *Teaching AI to speak our design language* (Jun 2026) — structured content, MCP, measured accuracy gains. https://www.atlassian.com/blog/ai-at-work/teaching-ai-to-speak-our-design-language
- O'Reilly, *The Design System as the Control Plane for AI-Generated UI* (Aug 2026). https://www.oreilly.com/radar/the-design-system-as-the-control-plane-for-ai-generated-ui
- Superdesign, *Why AI Breaks Your Design System* (Jun 2026) — drift mechanics. https://superdesign.dev/blog/ai-design-system-drift
- Metacto, *Generative UI in Production* (Jun 2026) — hallucinated components/props as failure mode #1. https://www.metacto.com/blogs/generative-ui-production-guide
- Codexical, *The AI Design System Trap* (Apr 2026) — semantic layer and review bottleneck. https://www.codexical.com/posts/2026-04-22-ai-design-system-coherence

Slipstream UI

- Repository README, `packages/*/package.json`, `apps/app/src/lib/plans.ts`, `.github/workflows`, npm registry, GitHub API — read 2026-11-05.
- npm downloads (week ending 2026-11-04): `@slipstream-ui/core` 451, `@slipstream-ui/ai` 427, `@slipstream-ui/cli` 240. https://api.npmjs.org/downloads/point/last-week/@slipstream-ui/core
- GitHub: 3 stars, 0 forks, 15 open issues. https://github.com/michaelmcshinsky/slipstream-ui

---

## Appendix C — Confidence and what would change this analysis

**What would strengthen the analysis**

- 10–15 customer interviews (personas are currently derived, not observed).
- Actual competitor revenue/usage (private; estimated from downloads and pricing).
- A real 30-day paid + organic test rather than the simulation in §4.5.
- Churn and conversion data from Slipstream's own cohorts.

**What would change the conclusion**

| Change | Effect on recommendation |
|---|---|
| Tailwind v4 support ships within 60 days | Removes the largest adoption blocker; raise base case 20–30% |
| A design-system customer signs at $5k+/yr | Pivot emphasis to private-manifest B2B; SOM rises |
| shadcn ships a `validate_usage` equivalent | Wedge collapses; differentiate on breadth or pivot to services |
| AI Elements migration guide gets 10k+ installs | Aggressive case becomes plausible |
| Paid CAC stays above $400 after tests | Abandon paid acquisition entirely; stay OSS/PLG |
| Fewer than 2% of trials convert in 60 days | Reposition or pivot per §4.8 |

**Bottom line:** Slipstream UI has a real, defensible technical wedge at the right moment, but the binding constraint is distribution and packaging — not engineering. The next 90 days should be judged on **Tailwind v4 shipped, `validate_usage` proven publicly, and three distribution surfaces live**, not on component count.
