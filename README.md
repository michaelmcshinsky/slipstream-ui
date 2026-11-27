# Slipstream UI

The AI-first React component library — your AI already knows how to use it.

[![CI](https://github.com/michaelmcshinsky/slipstream-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/michaelmcshinsky/slipstream-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm core](https://img.shields.io/npm/v/@slipstream-ui/core.svg?label=%40slipstream-ui%2Fcore)](https://www.npmjs.com/package/@slipstream-ui/core)
[![npm ai](https://img.shields.io/npm/v/@slipstream-ui/ai.svg?label=%40slipstream-ui%2Fai)](https://www.npmjs.com/package/@slipstream-ui/ai)
[![npm core downloads](https://img.shields.io/npm/dm/@slipstream-ui/core.svg?label=%40slipstream-ui%2Fcore%20downloads)](https://www.npmjs.com/package/@slipstream-ui/core)
[![npm mcp downloads](https://img.shields.io/npm/dm/@slipstream-ui/mcp-server.svg?label=%40slipstream-ui%2Fmcp-server%20downloads)](https://www.npmjs.com/package/@slipstream-ui/mcp-server)
[![GitHub stars](https://img.shields.io/github/stars/michaelmcshinsky/slipstream-ui?style=flat&logo=github)](https://github.com/michaelmcshinsky/slipstream-ui/stargazers)

<!-- generated:stats:start -->
**114 components** · 114 machine-readable specs · MCP `validate_usage` · MIT
<!-- generated:stats:end -->

[Docs](https://slipstreamui.com/docs) · [Changelog](https://slipstreamui.com/changelog) · [Templates](https://slipstreamui.com/docs/templates) · [Articles](https://slipstreamui.com/articles) · [MCP server](https://slipstreamui.com/docs/mcp)

## Overview

Slipstream UI is a React component library built for AI-assisted development. Every component ships a machine-readable `COMPONENT_MANIFEST` — exact props, defaults, anti-patterns, composition rules and accessibility requirements — so coding agents generate correct UI instead of guessing from training data.

- **AI reads the spec, not the source** — manifests over MCP, canonical markdown routes, and a `validate_usage` tool that rejects hallucinated props before they ship
- **Stateless by design** — bring any backend (Vercel AI SDK, LangGraph, raw streams); components render, you own state and transport
- **Complete surface** - core components across forms, overlays, data tables, app shell, marketing chrome and content typography, plus the AI chat and agent set
- **Accessible** — jest-axe suites on every component, keyboard and screen-reader behavior, reduced-motion variants
- **Themeable to the token** — one `createTheme()` call emits every CSS variable; dark mode and presets switch instantly
- **shadcn-compatible registry** — install real source files with `npx shadcn add`, or use the packages; your codebase, your rules

## Quick start

```bash
# 1. Initialize (detects Next.js/Vite + Tailwind, writes config and theme variables)
npx @slipstream-ui/cli@latest init

# 2. Or install the packages directly
pnpm add @slipstream-ui/core @slipstream-ui/ai

# 3. Or copy source files through the shadcn-compatible registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json
```

Requirements: Node.js **>= 20.9**, React 18 or 19, and Tailwind CSS **3.4+ or 4.x** (or the prebuilt stylesheets, with no Tailwind at all).

## Architecture

pnpm workspace + Turborepo monorepo:

| Path | Published as | Role |
|---|---|---|
| `packages/core` | `@slipstream-ui/core` | Core components: atoms, molecules, overlays, forms, data display, app/marketing chrome, content typography |
| `packages/ai` | `@slipstream-ui/ai` | AI components: chat, streaming markdown, tool calls, reasoning, approvals |
| `packages/themes` | `@slipstream-ui/themes` | `createTheme()` + default/dark/violet/zinc presets and the CSS-variable contract |
| `packages/cli` | `@slipstream-ui/cli` | `init` / `add` / `list` / `diff` |
| `packages/registry` | `@slipstream-ui/registry` | Shared manifest-registry resolution for the CLI and MCP server |
| `packages/mcp-server` | `@slipstream-ui/mcp-server` | MCP server exposing six tools to AI clients |
| `apps/docs` | — | Next.js 16 App Router documentation + marketing site (built with this library) |
| `apps/app` | — | Reference dashboard (auth, billing, admin) built with this library |
| `apps/playground` | — | Vite sandbox for component work |
| `tooling/*` | private | Shared Tailwind preset, ESLint, TypeScript and Vitest configs |
| `scripts/*` | — | Manifest validation, registry/LLM-doc generation, package audit, publish wrapper |

### The component pipeline

Every component flows through the same path, and CI enforces it:

1. **Source** — `packages/<pkg>/src/components/<dir>/` with JSDoc'd types and a barrel export
2. **Manifest** — `src/manifests/<id>.manifest.json` (props, examples, anti-patterns, a11y, composition)
3. **Drift check** — `pnpm validate:manifests` verifies schema **and** TypeScript↔manifest parity per directory
4. **Registry** — `pnpm generate:registry` emits installable payloads at `/registry/*.json`
5. **Agent docs** — `pnpm generate:llm-docs` emits `/llm/*.md`, `llms.txt`, and the README stats block
6. **MCP** — agents query the same manifests and edge functions gitignore-free

## Component inventory

The authoritative list is generated from the manifests:

- [Component catalog](https://slipstreamui.com/docs/components) — searchable, grouped, with live demos
- [`/registry/all.json`](https://slipstreamui.com/registry/all.json) — every component id, package, tier and docs URL

A hand-written inventory used to live here; it drifted. The generated files are the source of truth.

## For AI agents

- [`/llms.txt`](https://slipstreamui.com/llms.txt) — top-level agent index
- [`/llm/index.md`](https://slipstreamui.com/llm/index.md) — full component index; per-component references at `/llm/components/<id>.md`
- [`/registry/all.json`](https://slipstreamui.com/registry/all.json) — every manifest plus installer payload
- [`/registry/graph.json`](https://slipstreamui.com/registry/graph.json) — composition/related edges for choosing a coherent set of components
- [`/registry/recommendations.json`](https://slipstreamui.com/registry/recommendations.json) — the intent recipes behind `recommend_components`
- **MCP server** - `recommend_components`, `list_components`, `search_components`, `get_component_manifest`, `get_usage_examples`, `validate_usage` ([setup](https://slipstreamui.com/docs/mcp))

```tsx
import { Button } from '@slipstream-ui/core';
import { Conversation, PromptInput } from '@slipstream-ui/ai';
import { toast, Toaster } from '@slipstream-ui/core';

export function ChatApp() {
  const [messages, setMessages] = useState([{ id: '1', role: 'user', content: 'Hello!' }]);
  return (
    <>
      <Conversation messages={messages} />
      <PromptInput
        onSubmit={(text) => {
          setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', content: text }]);
          toast.success('Message queued');
        }}
      />
      <Toaster />
    </>
  );
}
```

## Documentation site

`apps/docs` is a Next.js 16 App Router site: marketing pages, 80 component pages with live demos, nine guides, templates, the interactive MCP playground, and the canonical agent surfaces. It also ships the operational pieces:

- Metadata per route (title/description, canonical, OG/Twitter cards, 1200×630 image), favicon set + web manifest
- `robots.txt` + dynamic `sitemap.xml`
- Legal pages (`/privacy`, `/terms`), `/about`, `/accessibility`, `/contact` (Netlify forms -> `/thank-you`), custom 404
- Cookie consent banner that gates analytics — Google Analytics 4 by default; `NEXT_PUBLIC_GA_MEASUREMENT_ID` overrides the property, or set `NEXT_PUBLIC_ANALYTICS_SRC` plus optional `NEXT_PUBLIC_ANALYTICS_DOMAIN` for a Plausible-style script. Nothing loads without consent
- Structured data (Organization, WebSite, SoftwareApplication, BreadcrumbList) and hardened response headers (CSP in report-only, frame-ancestors, HSTS, Permissions-Policy); report vulnerabilities via `/.well-known/security.txt`
- Contact details live in `apps/docs/lib/site.ts`

## Development

```bash
pnpm install             # install dependencies
pnpm dev                 # run all packages in dev mode
pnpm build               # build all packages
pnpm typecheck           # type check
pnpm lint                # lint
pnpm test                # unit + interaction tests (vitest, jest-axe)
pnpm validate:manifests  # manifest schema + TS↔manifest drift
pnpm generate:registry   # regenerate /registry payloads
pnpm generate:llm-docs   # regenerate /llm docs, llms.txt + README stats
```

Useful filters: `pnpm dev:docs`, `pnpm dev:playground`, `pnpm --filter slipstream-ui-docs build`.

### Site audits

Run against a production build (server on port 3111):

```bash
pnpm --filter slipstream-ui-docs build
pnpm --filter slipstream-ui-docs start -- -p 3111
pnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111   # axe-core, light + dark, 13 routes
pnpm --filter slipstream-ui-docs audit:perf -- http://localhost:3111   # Lighthouse mobile (lab)
```

`audit:a11y` exits non-zero on any WCAG 2.2 A/AA violation. `audit:perf` reports Lighthouse scores plus LCP/CLS/TBT for the home, docs index, and a component page.

## Quality gates

CI runs on every push and PR: typecheck → lint → test → build → manifest validation → registry/LLM generation. The release workflow publishes with npm provenance on version commits.

## Release

Releases use [Changesets](https://github.com/changesets/changesets) with a linked group of `core`/`ai`/`themes`:

```bash
pnpm changeset            # describe the change (minor for new components/props)
pnpm version-packages     # bump versions + changelogs (needs GITHUB_TOKEN)
git push                  # CI publishes all unpublished versions with provenance
```

Published packages: `@slipstream-ui/{core,ai,themes,cli,registry,mcp-server}`.

## Adoption

Real numbers, updated 2026-11-20 (npm last-month downloads per package; packages overlap
because one install can pull several):

| Package | Monthly downloads |
|---|---|
| `@slipstream-ui/core` | 2,272 |
| `@slipstream-ui/ai` | 1,927 |
| `@slipstream-ui/themes` | 1,710 |
| `@slipstream-ui/mcp-server` | 1,408 |
| `@slipstream-ui/cli` | 1,074 |
| `@slipstream-ui/registry` | 708 |

GitHub: 3 stars, 0 forks ([repo](https://github.com/michaelmcshinsky/slipstream-ui)).
The library is also used in production by several apps in the maintainer's portfolio.
Early days — the [migration guide](docs/migration-guide.md) is the intended on-ramp from
shadcn/ui.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md) (guidelines for AI agents working in this repo). Security reports go through [SECURITY.md](SECURITY.md).

## License

MIT - see [LICENSE](LICENSE). The license covers source code and
content only; it does not grant rights to the Slipstream UI name, logo
or other brand identifiers, and modified distributions must not imply
endorsement (see [NOTICE](NOTICE)).

---

Built by [Michael McShinsky](https://mcshinsky.net). Design notes and the reasoning behind manifests-over-MCP are written up at [mcshinsky.net/work](https://mcshinsky.net/work/).
