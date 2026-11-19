# Security Policy

## Supported versions

Security fixes are applied to the latest published minor of each package
(`@slipstream-ui/{core,ai,themes,cli,registry,mcp-server}`) on the default branch.
Older minors are not patched; upgrade to the latest release.

## Reporting a vulnerability

Please report security vulnerabilities privately via GitHub Security Advisories
(or email the maintainer through the profile linked on https://github.com/michaelmcshinsky).

Do **not** open a public issue for security reports.

You can expect an acknowledgement within 72 hours and an initial assessment within
two weeks. Fixes for confirmed vulnerabilities are released as soon as practical.

## Open advisories

- **GHSA-fc5q-39xc-vjpf (picomatch, high, reviewed 2026-11-17).** No patched
  release exists yet (4.0.7 is the latest and is vulnerable). The path is
  build-time only: `tailwindcss@3` → `chokidar`/`fast-glob` → `picomatch`; it is
  not shipped in runtime bundles. `pnpm check:audit` allowlists this advisory
  with the same reason and fails on every other high/critical finding. Remove
  the allowlist when upstream publishes a fix.

## Supply chain

- Packages publish from CI with **npm provenance** (SLSA v1 attestations); every
  release is verifiable on npm.
- Dependency updates are reviewed; known-failing majors (e.g. Prisma 7, Tailwind 4)
  are pinned with a documented rationale in `.github/dependabot.yml` until a
  dedicated migration lands.
- `pnpm check:audit` runs as part of the release gate; it fails on unallowlisted
  high/critical advisories and prints each allowlisted reason.
