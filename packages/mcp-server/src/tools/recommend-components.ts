import { loadRegistry } from '../registry';
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

type Recipe = {
  keywords: string[];
  components: { id: string; reason: string }[];
};

/**
 * Curated intent recipes. These are the combinations a developer actually
 * asks for ("build a chat UI", "add a filterable table", "make a settings
 * form"), expressed against the same manifest ids the rest of the server uses.
 * Lexical matching still runs, so an unlisted goal is not a dead end.
 */
const RECIPES: Recipe[] = [
  {
    keywords: ['chat', 'conversation', 'messaging', 'assistant', 'chatbot'],
    components: [
      { id: 'conversation', reason: 'Scroll-managed message transcript' },
      { id: 'prompt-input', reason: 'Composer with attachments and stop control' },
      { id: 'message', reason: 'User/assistant message rows' },
      { id: 'response', reason: 'Streaming-safe markdown responses' },
      { id: 'streaming-indicator', reason: 'Generating state with an accessible label' },
      { id: 'message-actions', reason: 'Copy, retry and feedback controls' },
    ],
  },
  {
    keywords: ['agent', 'tool', 'approval', 'human in the loop', 'workflow'],
    components: [
      { id: 'tool-call', reason: 'Tool status, arguments and results' },
      { id: 'confirmation', reason: 'Approval gate before a destructive action' },
      { id: 'chain-thought', reason: 'Agent task progress' },
      { id: 'reasoning', reason: 'Collapsible reasoning steps' },
      { id: 'prompt-input', reason: 'Task composer' },
      { id: 'conversation', reason: 'Agent transcript' },
    ],
  },
  {
    keywords: ['rag', 'citation', 'citations', 'source', 'sources', 'grounded'],
    components: [
      { id: 'sources', reason: 'Numbered reference list' },
      { id: 'inline-citation', reason: 'Per-claim citation chips' },
      { id: 'response', reason: 'Markdown answer body' },
      { id: 'conversation', reason: 'Answer transcript' },
    ],
  },
  {
    keywords: ['dashboard', 'admin', 'analytics', 'metrics', 'overview'],
    components: [
      { id: 'app-shell', reason: 'Sidebar + header application frame' },
      { id: 'metric-card', reason: 'KPI tiles' },
      { id: 'data-table', reason: 'Sortable, paginated data' },
      { id: 'filter-bar', reason: 'Search and reset controls' },
      { id: 'page-header', reason: 'Page title and actions' },
    ],
  },
  {
    keywords: ['table', 'data grid', 'list', 'sort', 'filterable'],
    components: [
      { id: 'data-table', reason: 'Columns, sorting, pagination and selection' },
      { id: 'filter-bar', reason: 'Filter/search toolbar' },
      { id: 'pagination', reason: 'Page navigation' },
      { id: 'badge', reason: 'Status cells' },
      { id: 'empty-state', reason: 'Zero-result state' },
    ],
  },
  {
    keywords: ['form', 'input', 'validation', 'submit', 'fields'],
    components: [
      { id: 'form', reason: 'Semantic form with submit handling' },
      { id: 'form-field', reason: 'Label, hint and error wiring' },
      { id: 'input', reason: 'Text input' },
      { id: 'textarea', reason: 'Multi-line text' },
      { id: 'select', reason: 'Native select' },
      { id: 'checkbox', reason: 'Boolean choice' },
      { id: 'button', reason: 'Submit action' },
    ],
  },
  {
    keywords: ['settings', 'preferences', 'profile', 'account', 'toggle', 'toggles'],
    components: [
      { id: 'form', reason: 'Settings form' },
      { id: 'form-layout', reason: 'Sectioned form layout' },
      { id: 'input', reason: 'Text fields' },
      { id: 'switch', reason: 'On/off preferences' },
      { id: 'select', reason: 'Option pickers' },
      { id: 'button', reason: 'Save action' },
    ],
  },
  {
    keywords: ['auth', 'login', 'sign in', 'signup', 'sign up', 'password'],
    components: [
      { id: 'auth-layout', reason: 'Centered or split auth surface' },
      { id: 'form-field', reason: 'Field labels and errors' },
      { id: 'input', reason: 'Email field' },
      { id: 'password-input', reason: 'Password reveal control' },
      { id: 'button', reason: 'Submit action' },
    ],
  },
  {
    keywords: ['upload', 'file', 'attachment', 'drag and drop'],
    components: [
      { id: 'file-upload', reason: 'Drag-and-drop file picker' },
      { id: 'progress', reason: 'Per-file progress' },
      { id: 'form-field', reason: 'Label and error wiring' },
      { id: 'button', reason: 'Upload action' },
    ],
  },
  {
    keywords: ['onboarding', 'wizard', 'step', 'stepper', 'checkout'],
    components: [
      { id: 'stepper', reason: 'Step progress and navigation' },
      { id: 'form', reason: 'Step form' },
      { id: 'form-layout', reason: 'Consistent field spacing' },
      { id: 'button', reason: 'Next/back actions' },
    ],
  },
  {
    keywords: ['modal', 'dialog', 'confirm', 'delete'],
    components: [
      { id: 'dialog', reason: 'Focus-trapped modal' },
      { id: 'confirm-dialog', reason: 'Destructive confirmation flow' },
      { id: 'button', reason: 'Trigger and confirm actions' },
    ],
  },
  {
    keywords: ['navigation', 'nav', 'menu', 'header', 'sidebar'],
    components: [
      { id: 'site-header', reason: 'Marketing/app header' },
      { id: 'app-shell', reason: 'Sidebar application frame' },
      { id: 'breadcrumb', reason: 'Hierarchy trail' },
      { id: 'link-tabs', reason: 'Route-based tabs' },
      { id: 'bottom-nav', reason: 'Mobile primary destinations' },
    ],
  },
  {
    keywords: ['notification', 'toast', 'alert', 'status'],
    components: [
      { id: 'toast', reason: 'Transient notification with actions' },
      { id: 'alert', reason: 'Inline status message' },
      { id: 'badge', reason: 'Compact status label' },
    ],
  },
  {
    keywords: ['marketing', 'landing', 'homepage', 'hero', 'pricing'],
    components: [
      { id: 'hero', reason: 'Landing hero' },
      { id: 'feature-grid', reason: 'Feature benefits' },
      { id: 'cta-section', reason: 'Conversion band' },
      { id: 'testimonial', reason: 'Social proof' },
      { id: 'stat-band', reason: 'Proof metrics' },
      { id: 'site-footer', reason: 'Footer navigation' },
    ],
  },
];

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
