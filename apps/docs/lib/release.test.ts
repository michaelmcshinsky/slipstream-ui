import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import releaseJson from '../../../release.json';
import corePackage from '../../../packages/core/package.json';
import mcpPackage from '../../../packages/mcp-server/package.json';
import { RELEASE, releaseLine } from './release';

function readJson(relativePath: string) {
  return JSON.parse(fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8'));
}

describe('release metadata', () => {
  it('derives the version and date from the release sources', () => {
    expect(RELEASE.version).toBe(corePackage.version);
    expect(RELEASE.releaseDate).toBe(releaseJson.releaseDate);
    expect(RELEASE.schemaVersion).toBe(releaseJson.schemaVersion);
    expect(RELEASE.manifestVersion).toBe(releaseJson.manifestVersion);
    expect(RELEASE.packages.mcpServer).toBe(mcpPackage.version);
  });

  it('reports the same counts as the generated registry index', () => {
    const registry = readJson('../public/registry/all.json');
    expect(registry.version).toBe(RELEASE.version);
    expect(registry.count).toBe(RELEASE.components.total);
    expect(registry.counts).toEqual({ core: RELEASE.components.core, ai: RELEASE.components.ai });
    expect(registry.schemaVersion).toBe(RELEASE.registrySchemaVersion);
    expect(registry.manifestVersion).toBe(RELEASE.manifestVersion);
  });

  it('reports the same nodes as the relationship graph', () => {
    const graph = readJson('../public/registry/graph.json');
    expect(graph.nodeCount).toBe(RELEASE.components.total);
    expect(graph.nodes).toHaveLength(RELEASE.components.total);
    expect(graph.version).toBe(RELEASE.version);
    for (const edge of graph.edges) {
      expect(graph.nodes.some((node: { id: string }) => node.id === edge.from)).toBe(true);
      expect(graph.nodes.some((node: { id: string }) => node.id === edge.to)).toBe(true);
    }
  });

  it('publishes recommendation recipes that resolve to graph nodes', () => {
    const recommendations = readJson('../public/registry/recommendations.json');
    const graph = readJson('../public/registry/graph.json');
    const ids = new Set(graph.nodes.map((node: { id: string }) => node.id));

    expect(recommendations.count).toBeGreaterThan(0);
    expect(recommendations.recipes).toHaveLength(recommendations.count);
    for (const recipe of recommendations.recipes) {
      expect(recipe.keywords.length).toBeGreaterThan(0);
      for (const component of recipe.components) {
        expect(ids.has(component.id)).toBe(true);
        expect(component.docs).toMatch(/^https:\/\/slipstreamui\.com\/docs\/components\//);
      }
    }
  });

  it('formats one release line for agent surfaces', () => {
    expect(releaseLine()).toContain(`Version ${RELEASE.version}`);
    expect(releaseLine()).toContain(`${RELEASE.components.total} components`);
    expect(releaseLine()).toContain(`manifest schema v${RELEASE.schemaVersion}`);
  });
});
