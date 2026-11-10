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
const SOFTWARE_ID = `${SITE.url}/#software`;

const DESCRIPTION = `${COMPONENT_COUNT} AI-native React components (${CORE_COMPONENT_COUNT} core + ${AI_COMPONENT_COUNT} AI) where every component ships a machine-readable COMPONENT_MANIFEST, an MCP server, and a validate_usage tool that catches hallucinated props before code ships.`;

const NPM_URL = 'https://www.npmjs.com/org/slipstream-ui';

function absolute(path: string): string {
  return new URL(path || '/', SITE.url).toString();
}

export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    alternateName: 'Slipstream',
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: absolute('/slipstream-lockup.png'),
      width: 1200,
      height: 630,
    },
    description: `${SITE.tagline} - AI-native React components with machine-readable specs and an MCP server.`,
    sameAs: [SITE.repo, SITE.social.github, NPM_URL],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'technical support',
      email: SITE.contact.email,
      url: absolute('/contact'),
      availableLanguage: ['English'],
    },
    knowsAbout: [
      'React component libraries',
      'AI coding agents',
      'Model Context Protocol',
      'Machine-readable component manifests',
      'Tailwind CSS',
      'Web accessibility (WCAG 2.2)',
    ],
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
    copyrightHolder: { '@id': ORGANIZATION_ID },
  };
}

export function softwareApplicationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'SoftwareSourceCode'],
    '@id': SOFTWARE_ID,
    name: SITE.name,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'React UI component library',
    operatingSystem: 'Any (browser)',
    url: SITE.url,
    description: DESCRIPTION,
    softwareVersion: VERSION,
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: SITE.repo,
    programmingLanguage: ['TypeScript', 'JavaScript'],
    runtimePlatform: 'Node.js 20.9+ and modern browsers',
    keywords: `${COMPONENT_COUNT} React components, AI components, COMPONENT_MANIFEST, MCP server, shadcn registry`,
    screenshot: absolute('/og.png'),
    featureList: [
      `${COMPONENT_COUNT} accessible React components (${CORE_COMPONENT_COUNT} core + ${AI_COMPONENT_COUNT} AI)`,
      'COMPONENT_MANIFEST JSON for every component',
      'MCP server with list_components, search_components, get_component_manifest, get_usage_examples and validate_usage',
      'shadcn-compatible registry install path',
      'Stateless AI chat and agent components',
      'WCAG 2.2 AA target with automated axe coverage',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
    publisher: { '@id': ORGANIZATION_ID },
    targetProduct: { '@id': SOFTWARE_ID },
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

export type TechArticleInput = {
  title: string;
  description: string;
  path: string;
  /** Group the article belongs to - "Components", "Guides", "Getting started". */
  section?: string;
};

/**
 * Documentation page schema. `audience` is explicit about the second reader:
 * coding agents that fetch these pages or their markdown twins.
 */
export function techArticleSchema({
  title,
  description,
  path,
  section,
}: TechArticleInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: absolute(path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(path) },
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
    proficiencyLevel: 'Expert',
    ...(section ? { articleSection: section } : {}),
    audience: [
      {
        '@type': 'Audience',
        audienceType: 'Software developers',
      },
      {
        '@type': 'Audience',
        audienceType: 'AI coding agents and MCP clients',
      },
    ],
    about: [
      { '@type': 'Thing', name: 'React component library' },
      { '@type': 'Thing', name: 'AI-assisted development' },
    ],
  };
}

export type WebPageInput = {
  /** Schema.org subtype: AboutPage, ContactPage, PrivacyPolicy, TermsOfService, CollectionPage. */
  type: string;
  name: string;
  description: string;
  path: string;
};

export function webPageSchema({ type, name, description, path }: WebPageInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: absolute(path),
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
  };
}

export type ArticleInput = {
  headline: string;
  description: string;
  path: string;
  /** ISO 8601 date of the latest release covered by the page. */
  dateModified: string;
};

export function articleSchema({
  headline,
  description,
  path,
  dateModified,
}: ArticleInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: absolute(path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(path) },
    dateModified,
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
    about: { '@type': 'SoftwareApplication', '@id': SOFTWARE_ID, name: SITE.name },
  };
}

/** ItemList for the component directory - helps engines understand the catalog. */
export function componentCollectionSchema(
  components: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Slipstream UI components (${COMPONENT_COUNT})`,
    description: DESCRIPTION,
    url: absolute('/docs/components'),
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: components.length,
      itemListElement: components.map((component, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: component.name,
        url: absolute(component.path),
      })),
    },
  };
}
