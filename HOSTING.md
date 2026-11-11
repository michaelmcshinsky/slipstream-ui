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
| Docs | Cloudflare Workers (OpenNext) | Worker `slipstream-ui` (repo `apps/docs`); cookie-based locale prevents static export |

### Deploy / provision

- `pnpm --filter slipstream-ui-docs deploy` (or `pnpm deploy:docs` from the root).
- Publish packages with `pnpm changeset` then `pnpm release`.

#### Cloudflare Workers Builds (CI)

The `slipstream-ui` Worker builds from this repo on every push to `main`. Configure in **Workers & Pages → slipstream-ui → Settings → Build**:

| Setting | Value |
|---|---|
| Root directory | *(empty - the repo root)* |
| Build command | `pnpm run build` |
| Deploy command | `pnpm --filter slipstream-ui-docs run deploy` |
| Preview command (only if preview builds are on) | `pnpm --filter slipstream-ui-docs run preview` |

Why these values:

- The root directory must stay at the repo root so the pnpm workspace install resolves the `@slipstream-ui/*` workspace links and turbo builds `packages/*` before the docs app.
- The deploy command must run inside `apps/docs`: it is `opennextjs-cloudflare build && opennextjs-cloudflare deploy`, which produces `.open-next/worker.js` and `.open-next/assets` (the paths `apps/docs/wrangler.jsonc` points at) and then deploys with the Wrangler version pinned in `apps/docs/package.json`.
- Do **not** set the deploy command to a bare `npx wrangler deploy`. At the repo root there is no Wrangler config, so Wrangler treats it as an unconfigured project and fails with `The Cloudflare application detection logic has been run in the root of a workspace instead of targeting a specific project`.
- Do **not** name the Worker `slipstream-ui-docs` in `wrangler.jsonc`. Workers Builds deploys under the name of its own Worker project and overrides a mismatch at deploy time; the `WORKER_SELF_REFERENCE` service binding then still points at the old name and the version upload fails with `Service binding 'WORKER_SELF_REFERENCE' references Worker '<name>' which was not found [code: 10143]`. `wrangler.jsonc` `name` and the self-reference `service` must both equal the Workers Builds Worker name (`slipstream-ui`).
- `turbo run build` alone only runs `next build`; it does not produce `.open-next`, so a deploy that skips the OpenNext build step fails on a missing entrypoint.


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
