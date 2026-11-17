import { loadRegistry } from '../registry';
import { RECIPES, type Recipe } from './recipes';
import type { McpTool } from './types';

type Recommendation = {
  id: string;
  name: string;
  package: string;
  tier: string;
  docs: string;
  reason: string;
  score: number;
};

function docsFor(id: string): string {
  const route = id === 'source' ? 'sources' : id;
  return `https://slipstreamui.com/docs/components/${route}`;
}

function matchedRecipe(goal: string): Recipe | undefined {
  let best: { recipe: Recipe; hits: number } | undefined;
  for (const recipe of RECIPES) {
    const hits = recipe.keywords.filter((keyword) => goal.includes(keyword)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { recipe, hits };
  }
  return best?.recipe;
}

export const recommendComponentsTool: McpTool = {
  definition: {
    name: 'recommend_components',
    description:
      'Recommend a coherent set of Slipstream UI components for a goal, such as "build a chat UI", "filterable table", "settings form" or "agent dashboard". Returns ids, reasons and docs URLs; pair with get_component_manifest before generating code.',
    inputSchema: {
      type: 'object',
      properties: {
        goal: {
          type: 'string',
          description: 'What the developer is building, in natural language.',
        },
        limit: { type: 'number', description: 'Maximum recommendations (default 6, max 12).' },
        package: { type: 'string', enum: ['@slipstream-ui/core', '@slipstream-ui/ai'] },
      },
      required: ['goal'],
    },
  },
  handler: async (args) => {
    const goal = typeof args?.goal === 'string' ? args.goal.trim().toLowerCase() : '';
    if (!goal) {
      return { content: [{ type: 'text', text: 'Error: goal is required.' }], isError: true };
    }
    const limit =
      typeof args?.limit === 'number' && args.limit > 0 ? Math.min(Math.floor(args.limit), 12) : 6;
    const pkg = typeof args?.package === 'string' ? args.package : undefined;
    const registry = loadRegistry();
    const byId = new Map(registry.map((manifest) => [manifest.id, manifest]));

    const scored = new Map<string, { reason: string; score: number }>();
    const add = (id: string, reason: string, score: number) => {
      const previous = scored.get(id);
      if (!previous || score > previous.score) scored.set(id, { reason, score });
    };

    const recipe = matchedRecipe(goal);
    if (recipe) {
      recipe.components.forEach((entry, index) => {
        add(entry.id, entry.reason, 100 - index);
      });
    }

    // Lexical fallback/augmentation: every goal term that appears in a
    // component's name or description adds a small amount. This keeps an
    // unlisted goal useful without pretending to be semantic search.
    const terms = goal.split(/[^a-z0-9]+/).filter((term) => term.length > 2);
    for (const manifest of registry) {
      const haystack = `${manifest.name} ${manifest.description}`.toLowerCase();
      const hits = terms.filter((term) => haystack.includes(term)).length;
      if (hits > 0) add(manifest.id, `Matches "${terms.find((term) => haystack.includes(term))}"`, hits * 5);
    }

    const recommendations: Recommendation[] = [...scored.entries()]
      .map(([id, entry]) => {
        const manifest = byId.get(id);
        return manifest
          ? {
              id,
              name: manifest.name,
              package: manifest.package,
              tier: manifest.tier,
              docs: docsFor(id),
              reason: entry.reason,
              score: entry.score,
            }
          : undefined;
      })
      .filter((entry): entry is Recommendation => Boolean(entry))
      .filter((entry) => !pkg || entry.package === pkg)
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
      .slice(0, limit);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              goal,
              count: recommendations.length,
              recommendations,
              notes: [
                'Call get_component_manifest for each id before generating code.',
                'validate_usage checks the generated JSX against the same manifests.',
                'The relationship graph at https://slipstreamui.com/registry/graph.json lists composition edges.',
              ],
            },
            null,
            2
          ),
        },
      ],
    };
  },
};
