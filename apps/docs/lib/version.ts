// Single source of truth for the version shown across the docs.
// Read from the published package so `pnpm version-packages` is the only
// place a bump is needed — no hard-coded "v0.x.y" strings to forget.
export { VERSION, RELEASE, RELEASE_DATE, SCHEMA_VERSION, MANIFEST_VERSION, releaseLine } from './release';
