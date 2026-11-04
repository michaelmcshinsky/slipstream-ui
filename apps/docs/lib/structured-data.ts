/**
 * JSON-LD graph builders for the docs site.
 *
 * Kept as plain functions (no React) so the same objects can be reused by
 * metadata generators or tests, and so the shape of each entity lives in one
 * place rather than being hand-written per page.
 */
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from './component-count';
import { SITE } from './site';
import { VERSION } from './version';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

const ORGANIZATION_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

function absolute(path: string): string {
  return new URL(path, SITE.url).toString();
}

export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    url: SITE.url,
    logo: absolute('/slipstream-lockup.png'),
    description: `${SITE.tagline} - AI-native React components with machine-readable specs and an MCP server.`,
    sameAs: [SITE.repo, SITE.social.github],
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    description:
      'AI-first React component library: every component ships a machine-readable manifest, an MCP server, and a usage validator.',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
  };
}

export function softwareApplicationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'React UI component library',
    operatingSystem: 'Any (browser)',
    url: SITE.url,
    description:
      `${COMPONENT_COUNT} AI-native React components (${CORE_COMPONENT_COUNT} core + ${AI_COMPONENT_COUNT} AI), each shipping a machine-readable COMPONENT_MANIFEST, an MCP server, and a validate_usage tool that catches hallucinated props before code ships.`,
    softwareVersion: VERSION,
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: SITE.repo,
    programmingLanguage: ['TypeScript', 'JavaScript'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
