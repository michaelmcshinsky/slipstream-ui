/**
 * robots.txt as a route handler instead of Next's `robots` metadata export.
 *
 * The metadata export can only emit User-agent/Allow/Sitemap lines. Agent
 * discovery needs comments that point at the canonical machine-readable
 * corpus, and it needs named allow rules for the crawlers that feed AI
 * answers (several of which ignore a bare wildcard group). This file is the
 * single place both audiences are described.
 */
export const dynamic = 'force-static';

const SITE_URL = 'https://slipstreamui.com';

/**
 * Crawlers that index for AI answers, search assistants and agent browsing.
 * Every one is explicitly allowed so an AI answer can cite the docs, the
 * manifests and the registry payloads.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'cohere-ai',
  'meta-externalagent',
  'DuckAssistBot',
  'MistralAI-User',
  'YouBot',
];

export function GET(): Response {
  const lines = [
    '# Slipstream UI - robots.txt',
    '# Canonical machine-readable corpus for AI agents and coding assistants:',
    `#   LLM index (short):     ${SITE_URL}/llms.txt`,
    `#   LLM corpus (full):     ${SITE_URL}/llms-full.txt`,
    `#   Per-component markdown: ${SITE_URL}/llm/components/<id>.md`,
    `#   Manifest registry:      ${SITE_URL}/registry/all.json`,
    '',
    'User-agent: *',
    'Allow: /',
    'Disallow: /thank-you',
    '',
    ...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL}`,
    '',
  ];

  return new Response(`${lines.join('\n')}`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
