#!/usr/bin/env node
/**
 * Fail when the site's release notes disagree with the packages.
 *
 * `release.json` owns the date, the core package owns the version, and
 * `apps/docs/lib/releases.ts` is what the changelog and llms release block
 * show. A changeset bump that forgets the site release notes would otherwise
 * publish a package with no matching "current" release.
 *
 * Run: pnpm check:release (also part of validate:manifests / CI).
 */
import fs from 'node:fs';
import path from 'node:path';
import { RELEASES } from '../apps/docs/lib/releases';

const ROOT = path.resolve(__dirname, '..');
const coreVersion = (
  JSON.parse(fs.readFileSync(path.join(ROOT, 'packages', 'core', 'package.json'), 'utf8')) as {
    version: string;
  }
).version;
const releaseJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'release.json'), 'utf8')) as {
  releaseDate: string;
};

const MONTHS: Record<string, string> = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};

function isoDate(display: string): string | undefined {
  const match = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/.exec(display.trim());
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return undefined;
  return `${match[3]}-${month}-${match[2].padStart(2, '0')}`;
}

const failures: string[] = [];
const warnOnly = process.argv.includes('--warn');
const latest = RELEASES[0];

if (!latest) {
  failures.push('apps/docs/lib/releases.ts has no releases.');
} else {
  if (latest.version !== coreVersion) {
    failures.push(
      `Latest site release is ${latest.version}, but @slipstream-ui/core is ${coreVersion}. Add the release entry before publishing.`
    );
  }
  const date = isoDate(latest.date);
  if (!date) {
    failures.push(`Latest site release date "${latest.date}" is not "Month D, YYYY".`);
  } else if (date !== releaseJson.releaseDate) {
    failures.push(
      `Latest site release date ${date} does not match release.json (${releaseJson.releaseDate}).`
    );
  }
}

if (failures.length > 0) {
  console.error('Release metadata is inconsistent:');
  for (const failure of failures) console.error(`  ${failure}`);
  if (warnOnly) {
    console.error(
      '\n--warn: continuing. The version PR must add the site release entry and release.json date; validate:manifests enforces it before merge.'
    );
    process.exit(0);
  }
  process.exit(1);
}

console.log(`Release metadata matches: ${coreVersion} on ${releaseJson.releaseDate}.`);
