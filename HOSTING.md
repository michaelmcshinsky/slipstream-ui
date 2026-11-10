# Hosting & running — slipstream-ui

Central plan: `D:\Projects\HOSTING.md`. Implementation status: `D:\Projects\HOSTING-STATUS.md`.

React component library, docs app, playground, starters, CLI, MCP server and registry.

## Parts

| Part | Path / service | Role |
|---|---|---|
| Core packages | `packages/core, ai, themes` | published npm packages |
| CLI / MCP / registry | `packages/cli, mcp-server, registry` | published npm packages |
| Docs | `apps/docs` | Next.js docs app; Worker |
| Playground / app / starters | `apps/*` | local/dev only |
| Tooling | `tooling/*` | shared ESLint, Tailwind, TypeScript and Vitest configs |
| Workspace packages | `packages/*` | Shared libraries; built, typechecked and tested through the root commands |

## Run locally

Package manager: **pnpm (lockfile detected)**. Node: see `.nvmrc` / `engines` if present.

```bash
pnpm install
pnpm dev
pnpm --filter slipstream-ui-docs dev
```

### Root commands

| Task | Command |
|---|---|
| dev | `pnpm dev` |
| build | `pnpm build` |
| test | `pnpm test` |
| typecheck | `pnpm typecheck` |
| lint | `pnpm lint` |

### Per-app commands

| App | Dev | Build | Start | Test |
|---|---|---|---|---|
| app | `pnpm --filter slipstream-app dev` | `pnpm --filter slipstream-app build` | `pnpm --filter slipstream-app start` | `pnpm --filter slipstream-app test` |
| docs | `pnpm --filter slipstream-ui-docs dev` | `pnpm --filter slipstream-ui-docs build` | `pnpm --filter slipstream-ui-docs start` | `—` |
| playground | `pnpm --filter slipstream-ui-playground dev` | `pnpm --filter slipstream-ui-playground build` | `—` | `—` |

## Hosting

| Part | Host | How |
|---|---|---|
| Packages | npm | Changesets + `pnpm release` |
| Docs | Cloudflare Workers (OpenNext) | `slipstream-ui-docs`; cookie-based locale prevents static export |

### Deploy / provision

- `pnpm --filter slipstream-ui-docs deploy`.
- Publish packages with `pnpm changeset` then `pnpm release`.

## Environment

- `apps/docs/.env.example` — copy/configure; never commit real values.
- `apps/app/.env.example` — copy/configure; never commit real values.

## Verify

```bash
pnpm typecheck
pnpm test
pnpm validate:manifests
pnpm --filter slipstream-ui-docs build
```

---

See also: `D:\Projects\HOSTING.md` (portfolio plan), `D:\Projects\RUNBOOK.md` (operations), `D:\Projects\HOSTING-STATUS.md` (what is verified).
