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
const ROUTES = process.env.PERF_ROUTES?.split(',') ?? [
  '/',
  '/docs',
  '/docs/components',
  '/docs/components/button',
  '/playground',
  '/articles/validation-benchmark-100-cases',
];
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const METRICS = ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time'];

async function measure(route) {
  // A fresh Chrome per measurement: reusing one instance across navigations
  // intermittently produces NO_NAVSTART and invalidates the trace.
  const chrome = await launchChrome({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'] });
  try {
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
    return result?.lhr;
  } finally {
    await chrome.kill();
  }
}

function invalid(lhr) {
  if (!lhr) return true;
  if (lhr.runtimeError?.code === 'NO_NAVSTART') return true;
  return METRICS.some((id) => lhr.audits?.[id]?.numericValue === undefined);
}

async function main() {
  for (const route of ROUTES) {
    let lhr = await measure(route);
    // Lighthouse occasionally records NO_NAVSTART on a fresh Chrome. Retry up
    // to twice before failing the route.
    for (let attempt = 0; invalid(lhr) && attempt < 2; attempt += 1) {
      console.log(`\n${route}  retrying after ${lhr?.runtimeError?.code ?? 'an invalid trace'}`);
      lhr = await measure(route);
    }

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

    if (lhr.runtimeError) {
      console.error(`  ERROR ${lhr.runtimeError.code}: ${lhr.runtimeError.message}`);
      process.exitCode = 1;
    }

    const missingMetrics = METRICS.filter((id) => metrics[id]?.numericValue === undefined);
    if (missingMetrics.length > 0) {
      console.error(`  ERROR no measurement for: ${missingMetrics.join(', ')}`);
      process.exitCode = 1;
    }

    for (const id of METRICS) {
      const score = metrics[id]?.score ?? 1;
      if (score < 0.9) {
        console.log(`  WARN ${id}: ${metrics[id]?.displayValue}`);
        process.exitCode = 1;
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
