# Slipstream UI — Repository Structure

```
slipstream-ui/
├── package.json                  # root scripts (dev, build, typecheck, lint, test, validate, generate, release)
├── pnpm-workspace.yaml
├── turbo.json
├── README.md                     # overview + architecture
├── AGENTS.md                     # rules for AI agents working in this repo
├── STRUCTURE.md                  # this file
├── SETUP.md                      # local development setup
├── CONTRIBUTING.md
├── SECURITY.md
│
├── packages/
│   ├── core/                     # @slipstream-ui/core — 63 components
│   │   ├── src/
│   │   │   ├── components/<dir>/ # component + barrel + colocated tests
│   │   │   ├── manifests/        # one COMPONENT_MANIFEST per component
│   │   │   ├── types/manifest.ts # manifest schema
│   │   │   ├── utils/            # cn, gap, presence (overlay exit window)
│   │   │   └── index.ts
│   │   └── dist/
│   │
│   ├── ai/                       # @slipstream-ui/ai — 17 AI components
│   │   └── src/
│   │       ├── components/
│   │       ├── manifests/
│   │       └── index.ts
│   │
│   ├── themes/                   # @slipstream-ui/themes — createTheme + presets
│   │   └── src/{presets,create-theme.ts,types.ts}
│   │
│   ├── cli/                      # @slipstream-ui/cli — init/add/list/diff
│   ├── registry/                 # @slipstream-ui/registry — shared registry resolution
│   ├── mcp-server/               # @slipstream-ui/mcp-server — five MCP tools
│   └── db/                       # private — database helpers for apps/app
│
├── apps/
│   ├── docs/                     # Next.js 16 App Router docs + marketing site
│   │   ├── app/                  # routes (docs, components, guides, privacy, terms, contact…)
│   │   │   ├── layout.tsx        # metadata, theme pre-paint, cookie banner, analytics
│   │   │   ├── sitemap.ts        # dynamic sitemap
│   │   │   ├── robots.ts
│   │   │   ├── manifest.ts       # web app manifest
│   │   │   ├── icon.png / apple-icon.png / favicon.ico
│   │   │   └── loading.tsx
│   │   ├── components/           # site chrome, demos, docs shell
│   │   ├── lib/                  # nav, search index, component count, version, site config
│   │   └── public/               # og image, lockup, registry/, llm/, llms.txt
│   │
│   ├── app/                      # reference dashboard (auth, billing, admin, API routes)
│   └── playground/               # Vite sandbox
│
├── tooling/
│   ├── tailwind-config/          # shared Tailwind preset (tokens, motion, z-index notes)
│   ├── eslint-config/
│   ├── typescript-config/
│   └── vitest-config/
│
├── scripts/
│   ├── validate-manifests.ts     # manifest schema validation
│   ├── check-manifest-sync.ts    # TS ↔ manifest drift (directory-scoped)
│   ├── generate-registry.ts      # /registry payloads
│   ├── generate-llm-docs.ts      # /llm docs, llms.txt, README stats, component counts
│   ├── audit-packages.ts
│   └── publish.cjs               # changeset publish wrapper (provenance in CI, off locally)
│
├── .changeset/                   # pending release notes
└── .github/workflows/
    ├── ci.yml                    # typecheck → lint → test → build → validate → generate
    └── release.yml               # changesets/action with provenance (Node 22)
```

## Component pipeline

```
source + manifest + tests
        │
        ├─ pnpm validate:manifests   (schema + TS↔manifest drift)
        ├─ pnpm generate:registry    → apps/docs/public/registry/*.json
        ├─ pnpm generate:llm-docs    → apps/docs/public/llm/*.md, llms.txt, README stats
        └─ MCP server                (queries the same manifests at runtime)
```

## Tech stack

- React 18/19, TypeScript 5, Tailwind CSS 3.4 (`tailwindcss-animate`, `@tailwindcss/typography` in docs)
- Next.js 16 (docs/app), Vite 8 (playground)
- tsup for package builds (ESM + CJS + d.ts), vitest + @testing-library + jest-axe
- pnpm 8.15 workspaces, Turborepo, Changesets with npm provenance
