/**
 * Release metadata for every published surface.
 *
 * The package version is the only value that moves with a changeset; the
 * schema/manifest versions and the release date live in `/release.json` so a
 * docs page, the registry and `llms.txt` all describe the same release.
 *
 * Do not hard-code these values in copy. Import this module instead.
 */
import releaseJson from '../../../release.json';
import corePackage from '../../../packages/core/package.json';
import mcpPackage from '../../../packages/mcp-server/package.json';
import cliPackage from '../../../packages/cli/package.json';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from './component-count';
import { SITE } from './site';

export const VERSION: string = corePackage.version;
export const RELEASE_DATE: string = releaseJson.releaseDate;
export const SCHEMA_VERSION: number = releaseJson.schemaVersion;
export const MANIFEST_VERSION: number = releaseJson.manifestVersion;
export const REGISTRY_SCHEMA_VERSION: number = releaseJson.registrySchemaVersion;

export const RELEASE = {
  product: SITE.name,
  version: VERSION,
  releaseDate: RELEASE_DATE,
  schemaVersion: SCHEMA_VERSION,
  manifestVersion: MANIFEST_VERSION,
  registrySchemaVersion: REGISTRY_SCHEMA_VERSION,
  components: {
    total: COMPONENT_COUNT,
    core: CORE_COMPONENT_COUNT,
    ai: AI_COMPONENT_COUNT,
  },
  packages: {
    core: VERSION,
    mcpServer: mcpPackage.version,
    cli: cliPackage.version,
  },
  urls: {
    docs: `${SITE.url}/docs`,
    changelog: `${SITE.url}/changelog`,
    registry: `${SITE.url}/registry/all.json`,
    llms: `${SITE.url}/llms.txt`,
    llmsFull: `${SITE.url}/llms-full.txt`,
    mcp: `${SITE.url}/docs/mcp`,
  },
  install: 'npx @slipstream-ui/cli@latest init',
} as const;

/** One-line release header shared by llms.txt, /llm/index.md and debug output. */
export function releaseLine(): string {
  return (
    `Version ${RELEASE.version} (${RELEASE.releaseDate}) · ` +
    `${RELEASE.components.total} components (${RELEASE.components.core} core + ${RELEASE.components.ai} AI) · ` +
    `manifest schema v${RELEASE.schemaVersion} · manifest v${RELEASE.manifestVersion}`
  );
}
