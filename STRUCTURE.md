# Slipstream UI - Repository Structure

## Directory Tree

```
slipstream-ui/
├── package.json                 # Root package.json
├── pnpm-workspace.yaml         # Workspace configuration
├── turbo.json                  # Turborepo configuration
├── README.md                   # Project overview
├── AGENTS.md                   # Guidelines for AI agents
├── STRUCTURE.md                # This file
├── LICENSE
│
├── packages/
│   ├── core/                    # @slipstream-ui/core
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── components/      # Atoms / molecules
│   │   │   │   ├── button/
│   │   │   │   ├── input/
│   │   │   │   ├── badge/
│   │   │   │   └── ...
│   │   │   ├── types/
│   │   │   │   └── manifest.ts  # COMPONENT_MANIFEST schema
│   │   │   ├── manifests/       # One manifest per component
│   │   │   └── index.ts
│   │   └── dist/                # Build output
│   │
│   ├── ai/                      # @slipstream-ui/ai
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── components/      # AI interaction components
│   │   │   │   ├── message/
│   │   │   │   ├── conversation/
│   │   │   │   ├── prompt-input/
│   │   │   │   ├── reasoning/
│   │   │   │   ├── tool-call/
│   │   │   │   └── ...
│   │   │   ├── types/
│   │   │   ├── manifests/
│   │   │   └── index.ts
│   │   └── dist/
│   │
│   ├── themes/                  # @slipstream-ui/themes
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── presets/
│   │   │   ├── create-theme.ts
│   │   │   └── index.ts
│   │   └── dist/
│   │
│   ├── mcp-server/              # MCP server for agents
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── tools/
│   │   │   │   ├── list-components.ts
│   │   │   │   ├── get-manifest.ts
│   │   │   │   └── ...
│   │   │   └── server.ts
│   │   └── dist/
│   │
│   ├── db/                      # @slipstream-ui/db
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # SQLite schema (users, teams, billing, licensing)
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── index.ts         # Prisma client singleton
│   │       └── seed.ts
│   │
│   ├── registry/                # @slipstream-ui/registry
│   │   ├── package.json
│   │   └── src/
│   │       └── index.ts         # Manifest loader used by MCP server + CLI
│   │
│   └── cli/                     # CLI tool
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts
│       │   ├── commands/
│       │   │   ├── init.ts
│       │   │   ├── add.ts
│       │   │   └── list.ts
│       │   └── utils/
│       └── dist/
│
├── apps/
│   ├── app/                     # SaaS dashboard (Next.js)
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── vitest.config.ts     # Isolated temp-SQLite test setup
│   │   ├── prisma -> ../../packages/db  (uses @slipstream-ui/db)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── api/         # Auth, teams, billing, licensing, admin, v1
│   │       │   ├── dashboard/
│   │       │   └── admin/
│   │       ├── components/
│   │       ├── lib/             # session, teams, licenses, billing, api core
│   │       └── test/
│   │
│   ├── docs/                    # Next.js docs site
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── docs/
│   │   │       └── [...path]/
│   │   ├── components/
│   │   ├── content/
│   │   │   └── docs/
│   │   │       ├── introduction.mdx
│   │   │       ├── installation.mdx
│   │   │       └── ...
│   │   └── public/
│   │
│   └── playground/              # Vite playground
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── index.html
│
├── tooling/
│   ├── typescript-config/       # Shared TypeScript configs
│   │   ├── package.json
│   │   ├── base.json
│   │   ├── react-library.json
│   │   └── nextjs.json
│   │
│   ├── eslint-config/          # Shared ESLint configs
│   │   ├── package.json
│   │   ├── index.js
│   │   └── ...
│   │
│   └── tailwind-config/        # Shared Tailwind config
│       ├── package.json
│       └── tailwind.config.js
│
├── scripts/
│   ├── validate-manifests.ts  # Deep manifest schema/invariant validation
│   ├── generate-registry.ts   # Deterministic /registry/* payload generation
│   └── generate-llm-docs.ts   # LLM-oriented docs generation
│
└── .github/
    └── workflows/
        └── ci.yml
```

## Dependency Graph

```
apps/docs → @slipstream-ui/core, @slipstream-ui/ai, @slipstream-ui/themes
apps/app → @slipstream-ui/core, @slipstream-ui/db
apps/playground → @slipstream-ui/core, @slipstream-ui/ai

@slipstream-ui/ai → @slipstream-ui/core
@slipstream-ui/themes → (standalone)
@slipstream-ui/db → (standalone; Prisma client + schema)
@slipstream-ui/registry → (standalone; reads core/ai manifests)
@slipstream-ui/cli → @slipstream-ui/core, @slipstream-ui/ai, @slipstream-ui/registry
@slipstream-ui/mcp-server → @slipstream-ui/core, @slipstream-ui/ai, @slipstream-ui/registry

tooling/* → (used by all packages)
```

## Package Purposes

### @slipstream-ui/core
Base UI components (atoms and molecules) that are not AI-specific. These are the building blocks for all other components.

### @slipstream-ui/ai
AI-specific interaction components that handle chat, reasoning, tool calls, streaming, and other AI agent UI patterns.

### @slipstream-ui/themes
Theming system with `createTheme()` function and preset themes. Uses CSS variables for runtime theming.

### @slipstream-ui/db
Prisma schema and client for the SaaS app: users, sessions, teams, memberships, invites, subscriptions, payments, license keys/activations, API keys and audit logs. SQLite for local/test; the schema is provider-portable.

### @slipstream-ui/registry
Loads COMPONENT_MANIFESTs from core/ai for consumers that must not import the component source (MCP server, CLI).

### @slipstream-ui/mcp-server
MCP (Model Context Protocol) server that allows AI agents to query component manifests, list components, and get usage examples without hallucinating.

### @slipstream-ui/cli
CLI tool for installing and managing Slipstream UI components in projects. Supports `init`, `add`, and `list` commands.

### apps/app
Next.js SaaS dashboard: auth, teams/RBAC, billing (mock + Stripe providers), licensing/activations, admin console and a versioned external API (`/api/v1`). Tested against an isolated per-run SQLite database.

### apps/docs
Next.js documentation site that serves both marketing landing page and component documentation. Auto-generates some content from manifests.

### apps/playground
Vite-based playground for testing components interactively during development.

## Build Order

1. tooling/* (no dependencies)
2. @slipstream-ui/themes (no dependencies)
3. @slipstream-ui/db (no dependencies)
4. @slipstream-ui/registry (no dependencies)
5. @slipstream-ui/core (no dependencies)
6. @slipstream-ui/ai (depends on core)
7. @slipstream-ui/mcp-server (depends on core, ai, registry)
8. @slipstream-ui/cli (depends on core, ai, registry)
9. apps/* (depend on core, ai, themes, db)
