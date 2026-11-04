/**
 * Lighthouse lab measurement for the docs site (mobile profile by default).
 *
 * Field data (CrUX) needs production traffic and cannot be produced locally;
 * this script is the Lab half of the CWV story and is what CI should gate on.
 *
 * Plain .mjs on purpose: tsx/esbuild's keepNames helper leaks into Lighthouse's
 * in-page evaluate and crashes it with "__name is not defined".
 *
 * Usage:
 *   pnpm --filter slipstream-ui-docs build
 *   pnpm --filter slipstream-ui-docs start -- -p 3111
 *   pnpm --filter slipstream-ui-docs audit:perf -- http://localhost:3111
 */
import { launch as launchChrome } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const BASE = process.argv[2] ?? 'http://localhost:3111';
const ROUTES = ['/', '/docs', '/docs/components/button'];
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

async function main() {
  const chrome = await launchChrome({ chromeFlags: ['--headless=new', '--no-sandbox'] });

  try {
    for (const route of ROUTES) {
      const result = await lighthouse(
        `${BASE}${route}`,
        { port: chrome.port, output: 'json', logLevel: 'error' },
        {
          extends: 'lighthouse:default',
          settings: {
            formFactor: 'mobile',
            screenEmulation: {
              mobile: true,
              width: 412,
              height: 823,
              deviceScaleFactor: 1.75,
              disabled: false,
            },
          },
        }
      );

      const lhr = result?.lhr;
      if (!lhr) {
        console.error(`FAIL ${route}: no Lighthouse result`);
        process.exitCode = 1;
        continue;
      }

      const scores = CATEGORIES.map(
        (id) => `${id.slice(0, 4)} ${Math.round((lhr.categories[id]?.score ?? 0) * 100)}`
      ).join('  ');
      const metrics = lhr.audits;
      console.log(`\n${route}  ${scores}`);
      console.log(
        `  LCP ${metrics['largest-contentful-paint']?.displayValue}  CLS ${metrics['cumulative-layout-shift']?.displayValue}  TBT ${metrics['total-blocking-time']?.displayValue}`
      );

      for (const id of ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time']) {
        const score = metrics[id]?.score ?? 1;
        if (score < 0.9) {
          console.log(`  WARN ${id}: ${metrics[id]?.displayValue}`);
          process.exitCode = 1;
        }
      }
    }
  } finally {
    await chrome.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
