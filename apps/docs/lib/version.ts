// Single source of truth for the version shown across the docs.
// Read from the published package so `pnpm version-packages` is the only
// place a bump is needed — no hard-coded "v0.x.y" strings to forget.
import corePackage from '../../../packages/core/package.json';

export const VERSION: string = corePackage.version;
