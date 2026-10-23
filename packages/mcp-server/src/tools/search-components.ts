import { loadRegistry } from '../registry';
import type { McpTool } from './types';

interface SearchHit {
  id: string;
  name: string;
  package: string;
  tier: string;
  description: string;
  /** Which fields matched the query, so agents can judge relevance. */
  matchedFields: string[];
  score: number;
}

/**
 * Deterministic lexical search across component capability fields. Every hit
 * reports which fields matched and a stable score, so agents can explain why
 * a component was returned (KC-026 / KC-045: lexical, not "semantic").
 */
export const searchComponentsTool: McpTool = {
  definition: {
    name: 'search_components',
    description:
      'Search Slipstream UI components by keyword. Matches component names, ids, descriptions, prop names and anti-pattern titles, and returns why each component matched.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keywords to search for, e.g. "chat streaming" or "modal focus".' },
        package: { type: 'string', enum: ['@slipstream-ui/core', '@slipstream-ui/ai'] },
        limit: { type: 'number', description: 'Maximum results (default 10).' },
      },
      required: ['query'],
    },
  },
  handler: async (args) => {
    const query = typeof args?.query === 'string' ? args.query.trim().toLowerCase() : '';
    if (!query) {
      return { content: [{ type: 'text', text: 'Error: query is required.' }], isError: true };
    }
    const limit = typeof args?.limit === 'number' && args.limit > 0 ? Math.min(args.limit, 50) : 10;
    const terms = query.split(/\s+/).filter(Boolean);

    let hits: SearchHit[] = [];
    for (const entry of loadRegistry()) {
      if (typeof args?.package === 'string' && entry.package !== args.package) continue;

      const matchedFields = new Set<string>();
      let score = 0;
      const fields: [string, string, number][] = [
        ['id', entry.id ?? '', 10],
        ['name', entry.name ?? '', 10],
        ['description', entry.description ?? '', 5],
      ];
      const propNames = Array.isArray(entry.props) ? entry.props.map((prop) => prop.name).join(' ') : '';
      fields.push(['props', propNames, 3]);
      const antiPatterns = Array.isArray(entry.antiPatterns)
        ? entry.antiPatterns.map((pattern) => `${pattern.title} ${pattern.explanation}`).join(' ')
        : '';
      fields.push(['antiPatterns', antiPatterns, 1]);

      for (const term of terms) {
        for (const [fieldName, haystack, weight] of fields) {
          if (haystack.toLowerCase().includes(term)) {
            matchedFields.add(fieldName);
            score += weight;
          }
        }
      }
      // Every term must match somewhere for the component to count.
      const allTermsMatched = terms.every((term) =>
        fields.some(([, haystack]) => haystack.toLowerCase().includes(term)),
      );
      if (!allTermsMatched || score === 0) continue;

      hits.push({
        id: entry.id,
        name: entry.name,
        package: entry.package,
        tier: entry.tier,
        description: entry.description,
        matchedFields: [...matchedFields].sort(),
        score,
      });
    }

    hits = hits.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit);
    return { content: [{ type: 'text', text: JSON.stringify({ query, count: hits.length, results: hits }, null, 2) }] };
  },
};
