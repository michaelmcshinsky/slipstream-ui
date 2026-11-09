/**
 * Dark-mode audit over every component page and the docs site chrome.
 *
 * For each route:
 *  - loads the page with the persisted dark theme and dismissed consent banner
 *  - verifies documentElement has the `dark` class
 *  - runs axe-core WCAG 2.2 A/AA
 *  - flags large light backgrounds outside intentional inverse/brand sections
 *  - captures a screenshot for visual review
 *
 * Usage:
 *   pnpm --filter slipstream-ui-docs build
 *   pnpm --filter slipstream-ui-docs start -- -p 3111
 *   pnpm --filter slipstream-ui-docs audit:dark -- http://localhost:3111
 */
import { chromium, type BrowserContext, type Page } from 'playwright-core';
import { source as axeSource } from 'axe-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:3111';
const ROOT = path.resolve(__dirname, '../../..');
const OUT = path.join(os.tmpdir(), 'slipstream-dark-audit');
const REPORT = path.join(ROOT, 'reports', 'dark-mode-audit.md');

const SITE_ROUTES = [
  '/',
  '/docs',
  '/docs/components',
  '/docs/templates',
  '/docs/patterns',
  '/docs/mcp',
  '/docs/cli',
  '/docs/ai-manifests',
  '/docs/installation',
  '/docs/compatibility',
  '/docs/tailwind-v4',
  '/docs/theming',
  '/docs/roadmap',
  '/docs/guides/ai-chat-ui',
  '/docs/guides/streaming',
  '/docs/guides/state-threads',
  '/docs/guides/vercel-ai-sdk',
  '/docs/guides/accessibility-ai',
  '/docs/guides/agent-integration',
  '/docs/guides/ide-setup',
  '/docs/guides/testing',
  '/docs/guides/migrating-from-shadcn',
  '/docs/guides/react-hook-form',
  '/changelog',
  '/about',
  '/accessibility',
  '/contact',
  '/privacy',
  '/terms',
  '/thank-you',
];

function componentRoutes(): string[] {
  const routes = new Set<string>();

  // Enumerate the docs component pages directly so pages that share a source
  // directory with another export (for example CheckboxGroup under checkbox)
  // are still audited.
  const componentsDir = path.join(ROOT, 'apps/docs/app/docs/components');
  if (fs.existsSync(componentsDir)) {
    for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (!fs.existsSync(path.join(componentsDir, entry.name, 'page.tsx'))) continue;
      routes.add(`/docs/components/${entry.name}`);
    }
  }

  // Manifests stay the source of truth: a manifest without a page should show
  // up as a failure rather than silently dropping out of the audit.
  for (const pkg of ['core', 'ai']) {
    const dir = path.join(ROOT, 'packages', pkg, 'src', 'manifests');
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((entry) => entry.endsWith('.manifest.json'))) {
      const manifest = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as { id: string };
      const routeId = manifest.id === 'source' ? 'sources' : manifest.id;
      routes.add(`/docs/components/${routeId}`);
    }
  }

  return [...routes];
}

type AxeNode = { target: string[]; html: string; failureSummary?: string };
type AxeViolation = { id: string; impact: string | null; help: string; nodes: AxeNode[] };
type LightSurface = { tag: string; className: string; area: number; background: string };

async function audit(page: Page, route: string): Promise<{
  violations: AxeViolation[];
  darkApplied: boolean;
  bodyBackground: string;
  lightSurfaces: LightSurface[];
}> {
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForLoadState('load').catch(() => undefined);
  await page.waitForTimeout(400);
  await page.addScriptTag({ content: axeSource });

  const state = (await page.evaluate(`(() => {
    const parse = (value) => {
      const match = value.match(/rgba?\\(([^)]+)\\)/);
      if (!match) return null;
      const parts = match[1].split(',').map((part) => Number(part.trim()));
      return [parts[0], parts[1], parts[2], parts[3] ?? 1];
    };
    const luminance = (rgb) => {
      const channel = (value) => {
        const c = value / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
    };

    const darkApplied = document.documentElement.classList.contains('dark');
    const bodyBackground = getComputedStyle(document.body).backgroundColor;
    const lightSurfaces = [];

    for (const element of Array.from(document.querySelectorAll('body *'))) {
      if (['IMG', 'SVG', 'VIDEO', 'CANVAS', 'PICTURE'].includes(element.tagName)) continue;
      if (element.closest('[data-tone="inverse"], [data-tone="brand"]')) continue;
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.1) continue;
      const parsed = parse(style.backgroundColor);
      if (!parsed || parsed[3] < 0.9) continue;
      const lum = luminance([parsed[0], parsed[1], parsed[2]]);
      const rect = element.getBoundingClientRect();
      const area = rect.width * rect.height;
      if (lum > 0.82 && area > 12000) {
        lightSurfaces.push({
          tag: element.tagName.toLowerCase(),
          className: element.className?.toString().slice(0, 120) ?? '',
          area: Math.round(area),
          background: style.backgroundColor,
        });
      }
    }

    return { darkApplied, bodyBackground, lightSurfaces };
  })()`)) as {
    darkApplied: boolean;
    bodyBackground: string;
    lightSurfaces: LightSurface[];
  };

  const results = (await page.evaluate(async () => {
    // @ts-expect-error injected by addScriptTag
    return window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      resultTypes: ['violations'],
    });
  })) as { violations: AxeViolation[] };

  return { ...state, violations: results.violations };
}

async function main(): Promise<void> {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });

  const routes = [...SITE_ROUTES, ...componentRoutes()];
  const uniqueRoutes = [...new Set(routes)];
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context: BrowserContext = await browser.newContext({
    colorScheme: 'dark',
    viewport: { width: 1440, height: 1000 },
  });
  await context.addInitScript(() => {
    try {
      localStorage.setItem('slipstream-theme', 'dark');
      localStorage.setItem('slipstream-consent', 'denied');
    } catch {
      // Storage can be blocked in hardened profiles; the class below still applies the theme.
    }
    document.documentElement.classList.add('dark');
  });
  const page = await context.newPage();

  const rows: Array<{
    route: string;
    failures: number;
    themes: boolean;
    surfaces: number;
    screenshot: string;
  }> = [];
  let totalViolations = 0;
  let themeFailures = 0;
  let surfaceWarnings = 0;

  for (const [index, route] of uniqueRoutes.entries()) {
    const name = `${String(index + 1).padStart(3, '0')}-${route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'}`;
    const screenshot = path.join(OUT, `${name}.jpg`);
    const result = await audit(page, route);
    await page.screenshot({ path: screenshot, type: 'jpeg', quality: 70 });

    totalViolations += result.violations.length;
    if (!result.darkApplied) themeFailures += 1;
    surfaceWarnings += result.lightSurfaces.length;
    rows.push({
      route,
      failures: result.violations.length,
      themes: result.darkApplied,
      surfaces: result.lightSurfaces.length,
      screenshot,
    });

    const status = result.violations.length === 0 && result.darkApplied ? 'PASS' : 'FAIL';
    console.log(`${status} ${route} dark=${result.darkApplied} violations=${result.violations.length} lightSurfaces=${result.lightSurfaces.length}`);
    for (const violation of result.violations) {
      console.log(`  [${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help} (${violation.nodes.length})`);
      for (const node of violation.nodes.slice(0, 3)) {
        console.log(`    ${node.target.join(' ')}`);
        if (node.failureSummary) console.log(`    ${node.failureSummary.split('\n').join(' | ')}`);
      }
    }
    for (const surface of result.lightSurfaces.slice(0, 3)) {
      console.log(`  light surface: <${surface.tag}> ${surface.background} area=${surface.area} class=${surface.className}`);
    }
  }

  await browser.close();

  const failures = rows.filter((row) => row.failures > 0 || !row.themes);
  const lines = [
    '# Dark-mode audit',
    '',
    `- Date: ${new Date().toISOString()}`,
    `- Base URL: ${BASE}`,
    `- Routes: ${uniqueRoutes.length}`,
    `- Violation groups: ${totalViolations}`,
    `- Theme not applied: ${themeFailures}`,
    `- Large light surface warnings: ${surfaceWarnings}`,
    `- Screenshots: ${OUT}`,
    '',
    totalViolations === 0 && themeFailures === 0
      ? '**Result: every audited route rendered in dark mode with no WCAG 2.2 A/AA axe violations.**'
      : '**Result: failures found. See the failing routes below.**',
    '',
    '## Failing routes',
    '',
    failures.length === 0
      ? 'None.'
      : [
          '| Route | Violations | Dark applied |',
          '|---|---|---|',
          ...failures.map((row) => `| \`${row.route}\` | ${row.failures} | ${row.themes ? 'yes' : 'no'} |`),
        ].join('\n'),
    '',
    '## Light surface warnings',
    '',
    surfaceWarnings === 0
      ? 'None. No large light background was found outside intentional inverse/brand sections.'
      : 'Large light backgrounds were found. Review the screenshots and the flagged routes.',
    '',
  ];
  fs.writeFileSync(REPORT, lines.join('\n'));

  console.log(`\n${uniqueRoutes.length} routes, ${totalViolations} violation group(s), ${themeFailures} theme failure(s), ${surfaceWarnings} light-surface warning(s).`);
  console.log(`Report: ${REPORT}`);
  console.log(`Screenshots: ${OUT}`);
  process.exit(totalViolations > 0 || themeFailures > 0 ? 1 : 0);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
