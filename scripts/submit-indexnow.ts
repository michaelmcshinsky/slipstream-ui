#!/usr/bin/env node
/**
 * Submits the site's URLs to IndexNow (https://www.indexnow.org/documentation),
 * which forwards them to Bing, Yandex, Seznam and Naver in one request.
 *
 * IndexNow proves ownership by fetching `<key>.txt` from the site root, so the
 * key lives in `apps/docs/public/<key>.txt` - Next serves `public/` at the site
 * root and the OpenNext build copies it into the Worker assets. This script
 * derives the key, its filename and `keyLocation` from that single file so the
 * committed key cannot drift from the one it advertises.
 *
 * Usage:
 *   pnpm submit:indexnow
 *   pnpm submit:indexnow --origin https://slipstream-ui.mmcshinsky.workers.dev
 *   pnpm submit:indexnow --limit 20 --dry-run
 *
 * Flags:
 *   --origin <url>  Site to submit. Defaults to SITE.url in apps/docs/lib/site.ts;
 *                   pass the workers.dev origin while the custom domain is unset.
 *   --limit <n>     Submit at most n URLs, for a spot check.
 *   --dry-run       Print the payload instead of calling IndexNow.
 *
 * IndexNow answers 200 (accepted) or 202 (accepted, key validation pending).
 * Anything else is reported as a failure so a broken deploy is visible.
 */

import fs from 'fs';
import path from 'path';
import { SITE } from '../apps/docs/lib/site';

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'apps', 'docs', 'public');
const ENDPOINT = 'https://api.indexnow.org/indexnow';

/** IndexNow key files are lowercase hex and 8-128 characters, plus the extension. */
const KEY_FILE_PATTERN = /^[0-9a-f]{8,128}\.txt$/;

type Options = {
  origin: string;
  limit: number;
  dryRun: boolean;
};

type KeyFile = {
  key: string;
  file: string;
};

function parseArgs(argv: string[]): Options {
  const options: Options = {
    origin: process.env.INDEXNOW_ORIGIN || SITE.url,
    limit: Number.POSITIVE_INFINITY,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--origin') {
      const value = argv[index + 1];
      if (!value) fail('--origin needs a URL');
      options.origin = value;
      index += 1;
    } else if (arg === '--limit') {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value <= 0) fail('--limit needs a positive integer');
      options.limit = value;
      index += 1;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else {
      fail(`Unknown argument: ${arg}`);
    }
  }

  options.origin = options.origin.replace(/\/+$/, '');
  new URL(options.origin); // throws on a malformed origin, before any network call
  return options;
}

function fail(message: string): never {
  console.error(`submit-indexnow: ${message}`);
  process.exit(1);
}

function readKeyFile(): KeyFile {
  const candidates = fs.readdirSync(PUBLIC).filter((entry) => KEY_FILE_PATTERN.test(entry));
  if (candidates.length !== 1) {
    fail(
      `expected exactly one <key>.txt in ${path.relative(ROOT, PUBLIC)}, found ${candidates.length}`,
    );
  }

  const file = candidates[0];
  const key = fs.readFileSync(path.join(PUBLIC, file), 'utf8').trim();
  if (`${key}.txt` !== file) {
    fail(`${file} must contain the key that names it (found "${key}")`);
  }

  return { key, file };
}

async function sitemapUrls(origin: string): Promise<string[]> {
  const response = await fetch(`${origin}/sitemap.xml`);
  if (!response.ok) fail(`sitemap: HTTP ${response.status} from ${origin}/sitemap.xml`);

  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) =>
    match[1].replace(/&amp;/g, '&'),
  );
  if (locations.length === 0) fail('sitemap listed no URLs');

  // The sitemap declares the canonical domain; while the Worker is only
  // reachable on another origin, submit paths against the origin we serve.
  const urls = locations.map((location) => new URL(new URL(location).pathname, origin).toString());
  return [...new Set(urls)];
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const { key, file } = readKeyFile();
  const urls = (await sitemapUrls(options.origin)).slice(0, options.limit);
  const payload = {
    host: new URL(options.origin).host,
    key,
    keyLocation: `${options.origin}/${file}`,
    urlList: urls,
  };

  if (options.dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    console.log(`submit-indexnow: dry run, ${urls.length} URLs for ${payload.host}`);
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (response.status !== 200 && response.status !== 202) {
    const detail = await response.text().catch(() => '');
    fail(`IndexNow rejected the submission: HTTP ${response.status} ${detail}`.trim());
  }

  console.log(
    `submit-indexnow: ${response.status === 202 ? 'accepted (key validation pending)' : 'accepted'} ` +
      `${urls.length} URLs for ${payload.host} via ${payload.keyLocation}`,
  );
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
