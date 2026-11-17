/**
 * Docs route smoke test: every component page and the key marketing routes must
 * render a heading instead of a stuck loading skeleton or a 404.
 *
 * The audit's top docs complaint was "Loading documentation…" on component
 * pages, so this runs against the production build and also clicks through a
 * sample of sidebar links to catch client-side navigation failures.
 *
 * Usage:
 *   pnpm --filter slipstream-ui-docs build
 *   pnpm --filter slipstream-ui-docs start -- -p 3111
 *   pnpm --filter slipstream-ui-docs smoke:routes -- http://localhost:3111
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:3111';
const ROOT = path.resolve(import.meta.dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'app', 'docs', 'components');

const EXTRA_ROUTES = [
  '/',
  '/docs',
  '/docs/getting-started',
  '/docs/installation',
  '/docs/compatibility',
  '/docs/theming',
  '/docs/ai-first',
  '/docs/ai-manifests',
  '/docs/mcp',
  '/docs/templates',
  '/docs/cli',
  '/docs/roadmap',
  '/playground',
  '/articles',
  '/articles/validation-benchmark-100-cases',
  '/articles/component-contract-not-gallery',
  '/accessibility',
  '/accessibility/scorecard',
  '/changelog',
  '/privacy',
  '/terms',
];

function componentSlugs(): string[] {
  return fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(COMPONENTS_DIR, entry.name, 'page.tsx')))
    .map((entry) => entry.name)
    .sort();
}

async function main(): Promise<void> {
  const routes = [...EXTRA_ROUTES, ...componentSlugs().map((slug) => `/docs/components/${slug}`)];
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const failures: string[] = [];
  let pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(`console: ${message.text()}`);
  });

  for (const route of routes) {
    pageErrors = [];
    const response = await page.goto(`${BASE}${route}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    if (!response || response.status() !== 200) {
      failures.push(`${route}: HTTP ${response?.status() ?? 'no response'}`);
      continue;
    }

    try {
      await page.waitForFunction(() => document.querySelector('h1') !== null, undefined, { timeout: 10_000 });
      // The route loading boundary can coexist with the streamed page until
      // React removes it; wait for the skeleton to actually disappear.
      await page.waitForFunction(
        () => !document.body.innerText.includes('Loading documentation'),
        undefined,
        { timeout: 10_000 }
      );
    } catch {
      failures.push(`${route}: h1 or content did not settle within 10s (stuck loading?)`);
      continue;
    }

    const body = await page.locator('body').innerText();
    if (body.includes('Loading documentation')) failures.push(`${route}: loading skeleton still visible`);
    if (body.includes('This page streamed into the void')) failures.push(`${route}: rendered the 404 page`);
    if (body.includes('This page couldn’t load') || body.includes("This page couldn't load")) {
      failures.push(`${route}: rendered the error boundary`);
    }
    const runtime = pageErrors.find((error) => /Element type is invalid|Cannot read|is not a function/.test(error));
    if (runtime) failures.push(`${route}: runtime error: ${runtime.slice(0, 180)}`);
  }

  // Client-side sidebar navigation: a fixed set that covers plain, overlay,
  // data and AI pages.
  await page.goto(`${BASE}/docs/components/button`, { waitUntil: 'domcontentloaded' });
  for (const slug of ['input', 'data-table', 'conversation', 'prompt-input', 'dialog', 'hero']) {
    const link = page.locator(`a[href="/docs/components/${slug}"]`).first();
    if ((await link.count()) === 0 || !(await link.isVisible())) {
      // Groups are collapsed unless active; skip rather than fail the gate on
      // navigation chrome that is intentionally hidden.
      continue;
    }
    await link.click();
    try {
      await page.waitForURL(`**/docs/components/${slug}`, { timeout: 10_000 });
      await page.waitForFunction(
        () => document.querySelector('h1') !== null && !document.body.innerText.includes('Loading documentation'),
        undefined,
        { timeout: 10_000 }
      );
    } catch {
      failures.push(`nav ${slug}: did not render after click`);
      continue;
    }
    const body = await page.locator('body').innerText();
    if (body.includes('Loading documentation')) failures.push(`nav ${slug}: loading skeleton still visible`);
  }

  await browser.close();

  console.log(`Checked ${routes.length} routes directly and up to 6 client-side navigations.`);
  if (failures.length > 0) {
    console.error(`Failures (${failures.length}):`);
    for (const failure of failures) console.error(`  ${failure}`);
    process.exit(1);
  }
  console.log('Docs route smoke test passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
