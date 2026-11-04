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

## Supply chain

- Packages publish from CI with **npm provenance** (SLSA v1 attestations); every
  release is verifiable on npm.
- Dependency updates are reviewed; known-failing majors (e.g. Prisma 7, Tailwind 4)
  are pinned with a documented rationale in `.github/dependabot.yml` until a
  dedicated migration lands.
- `pnpm audit` runs as part of the release gate.
