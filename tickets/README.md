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

## Epic 6: Internationalization

| ID | Title | Epic | Priority | Hours | Milestone | Depends on |
|---|---|---|---|---|---|---|
| [SLIP-060](SLIP-060.md) | Internationalize every app | 6 | P1 | 120h | M6 Internationalization |  |
| [SLIP-061](SLIP-061.md) | Localize P0 core component labels | 6 | P1 | 6h | M6 Internationalization | SLIP-060 |
| [SLIP-062](SLIP-062.md) | Localize P1 core component labels | 6 | P1 | 8h | M6 Internationalization | SLIP-061 |
| [SLIP-063](SLIP-063.md) | Localize AI timestamps and remaining AI labels | 6 | P1 | 5h | M6 Internationalization | SLIP-060 |
| [SLIP-064](SLIP-064.md) | Docs locale routing, shell and switcher | 6 | P1 | 16h | M6 Internationalization | SLIP-060 |
| [SLIP-065](SLIP-065.md) | Translate docs navigation, search and content | 6 | P2 | 80h | M6 Internationalization | SLIP-064 |
| [SLIP-066](SLIP-066.md) | Dashboard locale shell and user preference | 6 | P2 | 24h | M6 Internationalization | SLIP-060 |
| [SLIP-067](SLIP-067.md) | Localize transactional emails | 6 | P2 | 12h | M6 Internationalization | SLIP-066 |
| [SLIP-068](SLIP-068.md) | Playground locale toggle and RTL/CI audit | 6 | P2 | 8h | M6 Internationalization | SLIP-060 |

## Epic 7: Axial adoption

Canonical analysis: [`../reports/axial-adoption-gap-analysis.md`](../reports/axial-adoption-gap-analysis.md).
Epic 7 covers the marketing, data, marketplace, platform and AI-block gaps
identified from axial.net.

| ID | Title | Epic | Priority | Hours | Milestone | Depends on |
|---|---|---|---|---|---|---|
| [SLIP-070](SLIP-070.md) | Marketing blocks II: logo cloud, feature grid/row, testimonial, process, article, newsletter, contact, announcement | 7 | P0 | 18h | M7 Axial adoption |  |
| [SLIP-071](SLIP-071.md) | Marketing blocks III: video testimonial, team grid, pricing table, audio embed | 7 | P1 | 16h | M7 Axial adoption | SLIP-070 |
| [SLIP-072](SLIP-072.md) | Content hub: featured post, promo card, tag filter, author card, share bar, related posts | 7 | P1 | 18h | M7 Axial adoption | SLIP-070 |
| [SLIP-073](SLIP-073.md) | Filter panel, multi-select and date-range primitives for dashboards | 7 | P0 | 18h | M7 Axial adoption | SLIP-070 |
| [SLIP-074](SLIP-074.md) | Charts package with accessible bar, line, area, sparkline and table fallback | 7 | P0 | 28h | M7 Axial adoption | SLIP-070 |
| [SLIP-075](SLIP-075.md) | Marketplace cards: deal, entity/profile, tombstone, document and load-more | 7 | P0 | 18h | M7 Axial adoption | SLIP-070 |
| [SLIP-076](SLIP-076.md) | App shell II: topbar, user menu, notifications, saved search and inbox | 7 | P1 | 26h | M7 Axial adoption | SLIP-075 |
| [SLIP-077](SLIP-077.md) | Forms conversion kit: wizard, phone, currency, error summary and result panels | 7 | P0 | 24h | M7 Axial adoption | SLIP-070 |
| [SLIP-078](SLIP-078.md) | SEO package: metadata, JSON-LD, FAQ, article, breadcrumb and sitemap helpers | 7 | P0 | 14h | M7 Axial adoption |  |
| [SLIP-079](SLIP-079.md) | Consent package: provider, cookie banner, preferences and script gating | 7 | P0 | 14h | M7 Axial adoption |  |
| [SLIP-080](SLIP-080.md) | Icons and media package: Icon, IconButton, IconTile, SocialLinks, Media and Figure | 7 | P0 | 14h | M7 Axial adoption |  |
| [SLIP-081](SLIP-081.md) | SiteHeader and SiteFooter v2: utility bar, mega menu, contact and newsletter | 7 | P0 | 14h | M7 Axial adoption | SLIP-070 |
| [SLIP-082](SLIP-082.md) | Block manifests, page recipes and validate_page for the AI-first layer | 7 | P0 | 24h | M7 Axial adoption | SLIP-070, SLIP-081 |
| [SLIP-083](SLIP-083.md) | Page templates and CMS mappings for marketing, directory and dashboard pages | 7 | P1 | 24h | M7 Axial adoption | SLIP-070, SLIP-073, SLIP-075, SLIP-081 |
| [SLIP-084](SLIP-084.md) | Storybook, visual regression and published accessibility report | 7 | P1 | 18h | M7 Axial adoption | SLIP-070 |
| [SLIP-085](SLIP-085.md) | Tailwind v4 real-app certification and RSC/no-JS compatibility matrix | 7 | P1 | 14h | M7 Axial adoption | SLIP-070 |
| [SLIP-086](SLIP-086.md) | VPAT/ACR, browser support matrix and 1.0 support policy | 7 | P1 | 18h | M7 Axial adoption | SLIP-084 |
| [SLIP-087](SLIP-087.md) | Localize the new marketing, data and marketplace surfaces | 7 | P2 | 16h | M7 Axial adoption | SLIP-070, SLIP-073, SLIP-075 |

## Epic 8: Integration hardening

| ID | Title | Epic | Priority | Hours | Milestone | Depends on |
|---|---|---|---|---|---|---|
| [SLIP-090](SLIP-090.md) | fix: validate_usage handles JSX-valued props and native attributes | 8 | P0 | 3h | M8 Integration hardening |  |
| [SLIP-091](SLIP-091.md) | fix: keep AppShell rail viewport-height and Sidebar parents active | 8 | P0 | 2h | M8 Integration hardening |  |
| [SLIP-092](SLIP-092.md) | feat: expose accessible SiteHeader navigation labels | 8 | P1 | 1h | M8 Integration hardening |  |
| [SLIP-093](SLIP-093.md) | test: add visual regression coverage for AppShell and SiteHeader | 8 | P2 | 4h | M8 Integration hardening |  |
| [SLIP-094](SLIP-094.md) | perf: audit prebuilt CSS size and tree-shaking | 8 | P2 | 3h | M8 Integration hardening |  |
| [SLIP-095](SLIP-095.md) | docs: document react-hook-form compatibility for value-based controls | 8 | P1 | 2h | M8 Integration hardening |  |
| [SLIP-096](SLIP-096.md) | test: add a prebuilt stylesheet export smoke test | 8 | P1 | 3h | M8 Integration hardening |  |
| [SLIP-097](SLIP-097.md) | feat: add an AuthLayout split/aside variant | 8 | P2 | 6h | M8 Integration hardening |  |
| [SLIP-098](SLIP-098.md) | feat: add a PageHeader document-head helper | 8 | P3 | 3h | M8 Integration hardening |  |
| [SLIP-099](SLIP-099.md) | chore: publish core, themes, and mcp-server after the integration fixes | 8 | P0 | 2h | M8 Integration hardening |  |

**Total:** 70 tickets, 837h across all ticket files. Epics 0-5 are 33 tickets /
193h; Epic 6 is 9 tickets / 279h; Epic 7 is 18 tickets / 336h; Epic 8 is 10
tickets / 29h. SLIP-060 is an umbrella ticket, so its 120h overlaps the child
i18n tickets.

## Integration hardening (2026-11-07)

Consumer-integration fixes and follow-ups. These are outside the original
90-day product backlog and use the 090-100 ID range.

| ID | Title | Epic | Priority | Hours | Milestone | Depends on |
|---|---|---|---|---|---|---|
| [SLIP-090](SLIP-090.md) | fix: validate_usage handles JSX-valued props and native attributes | 6 | P0 | 3h | M6 Integration hardening |  |
| [SLIP-091](SLIP-091.md) | fix: keep AppShell rail viewport-height and Sidebar parents active | 6 | P0 | 2h | M6 Integration hardening |  |
| [SLIP-092](SLIP-092.md) | feat: expose accessible SiteHeader navigation labels | 6 | P1 | 1h | M6 Integration hardening |  |
| [SLIP-093](SLIP-093.md) | test: add visual regression coverage for AppShell and SiteHeader | 6 | P2 | 4h | M6 Integration hardening | SLIP-091, SLIP-092 |
| [SLIP-094](SLIP-094.md) | perf: audit prebuilt CSS size and tree-shaking | 6 | P2 | 3h | M6 Integration hardening |  |
| [SLIP-095](SLIP-095.md) | docs: document react-hook-form compatibility for value-based controls | 6 | P1 | 2h | M6 Integration hardening |  |
| [SLIP-096](SLIP-096.md) | test: add a prebuilt stylesheet export smoke test | 6 | P1 | 3h | M6 Integration hardening |  |
| [SLIP-097](SLIP-097.md) | feat: add an AuthLayout split/aside variant | 6 | P2 | 6h | M6 Integration hardening |  |
| [SLIP-098](SLIP-098.md) | feat: add a PageHeader document-head helper | 6 | P3 | 3h | M6 Integration hardening |  |
| [SLIP-099](SLIP-099.md) | chore: publish core, themes, and mcp-server after the integration fixes | 6 | P0 | 2h | M6 Integration hardening | SLIP-090, SLIP-091, SLIP-092 |
| [SLIP-100](SLIP-100.md) | docs: regenerate registry and LLM docs after the concurrent component work | 6 | P1 | 1h | M6 Integration hardening |  |
| [SLIP-101](SLIP-101.md) | docs: call out React dedupe when Slipstream is consumed from a linked checkout | 6 | P2 | 1h | M6 Integration hardening |  |

**Integration total:** 12 tickets, 31h (10 done, 2 open: SLIP-093 visual
regression and SLIP-099 publish).