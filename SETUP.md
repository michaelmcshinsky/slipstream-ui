# Slipstream UI — Setup Guide

Set up the repository for local development.

## Prerequisites

- **Node.js >= 20.9** (Next.js 16 requirement; CI and release run on Node 22)
- **pnpm 8.15** (`packageManager` field in `package.json`)
- **Git**

## Initial setup

```bash
git clone https://github.com/michaelmcshinsky/slipstream-ui.git
cd slipstream-ui
pnpm install
```

### Optional local environment

Create `apps/docs/.env.local` to enable consent-gated analytics on the docs site:

```bash
# Privacy-friendly script URL (e.g. Plausible). Nothing loads without consent.
NEXT_PUBLIC_ANALYTICS_SRC=
# Optional banner domain attribute (Plausible)
NEXT_PUBLIC_ANALYTICS_DOMAIN=
```

`apps/app` expects database/auth/billing variables — see `apps/app/.env.example` when present.

## Verify the install

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm validate:manifests
```

## Development

```bash
pnpm dev              # all packages + apps in watch mode
pnpm dev:docs         # docs site only
pnpm dev:playground   # Vite playground only
```

App package names are unscoped, so filters use the real name:

```bash
pnpm --filter slipstream-ui-docs build
pnpm --filter slipstream-app test
```

## Working with manifests and generated docs

```bash
pnpm validate:manifests   # schema + TypeScript↔manifest drift (CI gate)
pnpm generate:registry    # regenerate apps/docs/public/registry/*.json
pnpm generate:llm-docs    # regenerate /llm docs, llms.txt, README stats, component counts
```

Any component change needs a manifest update or the drift check fails.

## Troubleshooting

- **`--filter @scope/app` matches nothing** — app packages are unscoped (`slipstream-ui-docs`, `slipstream-app`, `slipstream-ui-playground`).
- **Docs types are stale after changing core** — rebuild core first (`pnpm --filter @slipstream-ui/core build`); the docs consume `dist` types.
- **`pnpm version-packages` fails with a GitHub token error** — the changelog generator needs `GITHUB_TOKEN`; run `$env:GITHUB_TOKEN = (gh auth token)` first.
- **Local publish fails with "Automatic provenance generation not supported"** — `publishConfig.provenance` only works in CI; `pnpm release` uses `scripts/publish.cjs`, which disables provenance outside GitHub Actions.
- **App tests fail under parallel turbo runs** — the Prisma fixture suites can contend on a shared database; re-run the `slipstream-app` task in isolation.

## Release

```bash
pnpm changeset            # add a changeset (minor for new components/props)
pnpm version-packages     # bump versions + changelogs
git push                  # CI publishes unpublished versions with npm provenance
```

See [AGENTS.md](AGENTS.md) for the component pipeline and [STRUCTURE.md](STRUCTURE.md) for the layout.
