/**
 * Automated accessibility audit (axe-core) over the built docs site, run once
 * per color scheme.
 *
 * This is a regression net, not a substitute for a manual WCAG audit: axe
 * catches roughly a third of issues and cannot judge task flows, focus order
 * across pages, or the quality of alt text.
 *
 * Usage:
 *   pnpm --filter slipstream-ui-docs build
 *   pnpm --filter slipstream-ui-docs start -- -p 3111
 *   pnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111
 *
 * Exits non-zero when any WCAG 2.2 A/AA violation is found.
 */
import { chromium, type Page } from 'playwright-core';
import { source as axeSource } from 'axe-core';

const BASE = process.argv[2] ?? 'http://localhost:3111';

const ROUTES = [
  '/',
  '/docs',
  '/docs/getting-started',
  '/docs/installation',
  '/docs/ai-first',
  '/docs/ai-manifests',
  '/docs/components/button',
  '/docs/components/conversation',
  '/docs/components/hero',
  '/docs/components/stepper',
  '/docs/components/range-slider',
  '/docs/components/table-of-contents',
  '/docs/mcp',
  '/docs/templates',
  '/changelog',
  '/about',
  '/accessibility',
  '/contact',
  '/privacy',
  '/terms',
];

const SCHEMES = ['light', 'dark'] as const;

type AxeNode = { target: string[]; html: string; failureSummary?: string };
type AxeViolation = { id: string; impact: string | null; help: string; nodes: AxeNode[] };

async function auditPage(page: Page, route: string): Promise<AxeViolation[]> {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axeSource });
  const results = (await page.evaluate(async () => {
    // @ts-expect-error injected by addScriptTag
    return window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      resultTypes: ['violations'],
    });
  })) as { violations: AxeViolation[] };
  return results.violations;
}

async function main(): Promise<void> {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  let total = 0;

  for (const scheme of SCHEMES) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const route of ROUTES) {
      const label = `${route} (${scheme})`;
      const violations = await auditPage(page, route);
      total += violations.length;
      if (violations.length === 0) {
        console.log(`PASS ${label}`);
        continue;
      }
      console.log(`FAIL ${label}`);
      for (const violation of violations) {
        console.log(
          `  [${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help} (${violation.nodes.length})`
        );
        for (const node of violation.nodes.slice(0, 3)) {
          console.log(`    ${node.target.join(' ')}`);
          if (node.failureSummary) console.log(`    ${node.failureSummary.split('\n').join(' | ')}`);
        }
      }
    }
  }

  await browser.close();
  console.log(`\n${ROUTES.length * SCHEMES.length} page runs, ${total} violation group(s).`);
  process.exit(total > 0 ? 1 : 0);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
