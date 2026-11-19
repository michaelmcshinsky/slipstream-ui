#!/usr/bin/env node
/**
 * Audit gate with a small, explicit allowlist for advisories that have no
 * patched release yet.
 *
 * `pnpm audit` alone cannot distinguish "we forgot to upgrade" from "upstream
 * has not shipped a fix". This script fails on every high/critical advisory
 * except the ones listed below, and prints the allowlist reason each run so a
 * stale exception is visible in review.
 *
 * Run: pnpm check:audit
 */
import { execSync } from 'node:child_process';

type Advisory = {
  module_name: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  github_advisory_id?: string;
  vulnerable_versions: string;
  patched_versions: string;
  title: string;
  url?: string;
};

const ALLOWLIST = new Map<string, string>([
  [
    'GHSA-fc5q-39xc-vjpf',
    'picomatch has no patched release (latest 4.0.7 is vulnerable); reached only from the Tailwind build watcher/fast-glob, not shipped in runtime bundles. Reviewed 2026-11-17; remove when upstream publishes a fix.',
  ],
]);

function auditJson(): { advisories?: Record<string, Advisory> } {
  try {
    return JSON.parse(execSync('pnpm audit --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  } catch (error) {
    const stdout = (error as { stdout?: string }).stdout;
    if (!stdout) throw error;
    return JSON.parse(stdout);
  }
}

const result = auditJson();
const advisories = Object.values(result.advisories ?? {}) as Advisory[];
const blocking: Advisory[] = [];

for (const advisory of advisories) {
  const id = advisory.github_advisory_id ?? advisory.module_name;
  const allowed = ALLOWLIST.has(id);
  const blockingSeverity = advisory.severity === 'high' || advisory.severity === 'critical';
  if (blockingSeverity && !allowed) blocking.push(advisory);
  if (allowed) {
    console.log(`ALLOWED ${id} (${advisory.module_name}, ${advisory.severity})`);
    console.log(`  ${ALLOWLIST.get(id)}`);
  }
}

if (blocking.length > 0) {
  console.error(`\n${blocking.length} unallowlisted high/critical advisory(ies):`);
  for (const advisory of blocking) {
    console.error(
      `  ${advisory.github_advisory_id ?? advisory.module_name} ${advisory.module_name} ${advisory.severity}: ${advisory.title}`
    );
    console.error(`    vulnerable ${advisory.vulnerable_versions}; patched ${advisory.patched_versions}`);
    if (advisory.url) console.error(`    ${advisory.url}`);
  }
  console.error('\nUpgrade, or add a dated reason to scripts/check-audit.ts if no patch exists.');
  process.exit(1);
}

const counts = advisories.reduce<Record<string, number>>((acc, advisory) => {
  acc[advisory.severity] = (acc[advisory.severity] ?? 0) + 1;
  return acc;
}, {});
console.log(
  `Audit gate passed: ${advisories.length} advisory(ies) (${Object.entries(counts)
    .map(([severity, count]) => `${count} ${severity}`)
    .join(', ') || 'none'}); no unallowlisted high/critical findings.`
);
