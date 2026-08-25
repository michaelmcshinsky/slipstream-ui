Monorepo scaffold is ready at:
/home/workdir/artifacts/slipstream-ui
Layout
textslipstream-ui/
├── package.json                 # Root (pnpm + turbo + changesets)
├── pnpm-workspace.yaml
├── turbo.json
├── README.md
├── AGENTS.md                    # Rules for AI agents working in this repo
├── STRUCTURE.md                 # Full tree + dependency graph
├── LICENSE
│
├── packages/
│   ├── core/                    # @slipstream-ui/core
│   │   └── src/
│   │       ├── components/      # Atoms / molecules
│   │       ├── types/manifest.ts  # COMPONENT_MANIFEST schema
│   │       └── manifests/       # One manifest per component
│   ├── ai/                      # @slipstream-ui/ai  (Message, Conversation, Reasoning, ToolCall…)
│   ├── themes/                  # createTheme() + presets
│   ├── mcp-server/              # MCP server for agents
│   └── cli/                     # `npx slipstream-ui` (init | add | list)
│
├── apps/
│   ├── docs/                    # Next.js docs site
│   └── playground/              # Vite playground
│
├── tooling/
│   ├── typescript-config/       # base / react-library / nextjs
│   ├── eslint-config/
│   └── tailwind-config/
│
├── scripts/
│   └── generate-manifests.ts
└── .github/workflows/ci.yml
Key design choices already baked in









































PieceDecisionPackage managerpnpm workspacesTask runnerTurborepoVersioningChangesetsBuild (libraries)tsup (ESM + .d.ts)ManifestsFirst-class — schema lives in core, every component will ship oneAI guidanceAGENTS.md + MCP server packageCLICommander-based skeleton (init / add / list)ThemingSeparate @slipstream-ui/themes with createTheme()
Commands (once you pnpm install)
Bashpnpm install
pnpm dev          # runs all packages/apps in parallel
pnpm build
pnpm typecheck
pnpm generate:manifests

Recommended next steps (pick one):

Implement the first atom (Button) + its full COMPONENT_MANIFEST
Flesh out the MCP server tools (list_components, get_component_manifest, …)
Scaffold the docs site (Next.js + basic landing page)
Define the first AI components set (Message / Conversation / PromptInput)

Which one do you want to tackle first?