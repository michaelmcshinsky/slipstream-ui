# Slipstream UI — Agent Guidelines

Rules for AI agents working **in this repository** (not consuming the library).

## Project overview

Slipstream UI is an AI-first React component library. Every component ships a machine-readable `COMPONENT_MANIFEST`; the same manifests power the docs, the shadcn-compatible registry, the LLM markdown routes and the MCP server.

## Repository architecture

pnpm workspace + Turborepo. **Never** edit `D:/Projects/_modernization/slipstream-ui`; this repo is `D:/Documents/Projects/slipstream-ui`.

- `packages/core` (`@slipstream-ui/core`) — 63 components: atoms, molecules, overlays, forms, data display, app/marketing chrome, content typography
- `packages/ai` (`@slipstream-ui/ai`) — 17 AI chat/agent components
- `packages/themes` (`@slipstream-ui/themes`) — `createTheme()` + presets + CSS-variable contract
- `packages/cli` (`@slipstream-ui/cli`) — `init` / `add` / `list` / `diff`
- `packages/registry` (`@slipstream-ui/registry`) — manifest-registry resolution used by CLI + MCP
- `packages/mcp-server` (`@slipstream-ui/mcp-server`) — five MCP tools
- `apps/docs` — Next.js 16 App Router docs + marketing site (built with the library)
- `apps/app` — reference dashboard (auth, billing, admin)
- `apps/playground` — Vite sandbox
- `tooling/*` — shared Tailwind preset, ESLint, TypeScript, Vitest configs (private)
- `scripts/*` — manifest validation, registry/LLM generation, package audit, publish wrapper

## Adding a component (the pipeline)

1. **Source** — `packages/<pkg>/src/components/<dir>/<Name>.tsx`
   - `type`, never `interface`; no `any` (use `unknown` + guards)
   - `'use client'` only when the component uses hooks/handlers
   - export from the directory's `index.ts` and add `export * from './components/<dir>'` to `src/index.ts`
2. **Manifest** — `src/manifests/<id>.manifest.json`
   - Must document **every non-inherited prop** declared by any `*Props` type in that directory (the drift checker is directory-scoped)
   - Sections: description, designIntent, props, examples, antiPatterns, accessibility, contentGuidelines, compositionRules, relatedComponents
3. **Tests** — colocated `<Name>.test.tsx`: behavior, keyboard/interaction where relevant, and a `jest-axe` assertion
4. **Docs** — `apps/docs/app/docs/components/<slug>/page.tsx` (server, exports metadata) + `demo.tsx` (`'use client'` when interactive)
   - add the entry to `apps/docs/lib/nav.ts` and `apps/docs/lib/search-index.ts`
5. **Generate** — `pnpm generate:registry` and `pnpm generate:llm-docs` (updates `/registry`, `/llm`, `llms.txt`, README stats, `lib/component-count.ts`)
6. **Verify** — `pnpm validate:manifests` (schema + TS↔manifest drift), then the full gate below

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm validate:manifests
pnpm generate:registry
pnpm generate:llm-docs
```

Note: app package names are unscoped (`slipstream-ui-docs`, `slipstream-app`), so `--filter` needs the real name.

## Styling and theming

- Tailwind CSS **3.4** with `tooling/tailwind-config`; dark mode via `.dark` and CSS variables
- Use semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`, `text-info`…). Never hardcode palette colors.
- Dynamic class names are purged: use literal class maps or inline `style` (see `Grid`/`Drawer` size maps).
- Status colors: `success`, `warning`, `info` (teal-cyan), `destructive`; ink/white foregrounds are pre-audited.
- Layering: 10 docked · 30 sticky · 40 chrome · 50 overlays · **60 toasts**. Don't exceed the ladder.
- Motion is opt-in (`animate` props) and must include `motion-reduce` safety.

## Accessibility

- keyboard operation for every interactive component; visible focus rings
- correct roles/aria (`aria-current`, `aria-expanded`, `aria-activedescendant`, labels)
- jest-axe must pass; reduced-motion respected
- focus restore/trap for overlays

## Docs site specifics

- Metadata per route (server components export `metadata`; client pages get a one-line layout)
- Component pages pair `page.tsx` + `demo.tsx`; keep them in sync with the manifest
- Site config (contact email/address) lives in `apps/docs/lib/site.ts`
- Analytics is consent-gated via `NEXT_PUBLIC_ANALYTICS_SRC`; never load before consent

## MCP server

`packages/mcp-server` exposes: `list_components`, `search_components`, `get_component_manifest`, `get_usage_examples`, `validate_usage`. Keep tool schemas and manifests consistent.

## Releases

Changesets with a linked `core`/`ai`/`themes` group. Add a changeset for any published-package change; CI publishes on version commits with provenance.

## Priority order

1. Correctness and robustness
2. Maintainability and readability
3. Performance
4. Convention
