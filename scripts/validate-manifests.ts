#!/usr/bin/env node
/**
 * Validates COMPONENT_MANIFEST files across the workspace packages.
 *
 * Checks each manifest against the schema documented in
 * packages/core/src/types/manifest.ts plus the invariants the registry
 * generator (scripts/generate-registry.ts) relies on:
 *
 * - required fields exist with the right types (not merely truthy values)
 * - tier / package / version are within their allowed value sets
 * - prop schema entries are well-formed and free of duplicate names
 * - examples, accessibility, content guidelines and composition rules are
 *   structurally valid
 * - component IDs are unique across packages and match their filenames
 * - the component's source directory exists and contains installable source
 * - declared export names are actually exported from that source directory
 *
 * Exits non-zero when any manifest fails, listing every problem found.
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');

const PACKAGES = [
  { name: '@slipstream-ui/core', dir: path.join(ROOT, 'packages', 'core') },
  { name: '@slipstream-ui/ai', dir: path.join(ROOT, 'packages', 'ai') },
] as const;

const ALLOWED_TIERS = new Set(['atom', 'molecule', 'organism', 'pattern']);
const ALLOWED_PACKAGE_NAMES = new Set<string>(PACKAGES.map((pkg) => pkg.name));
const SEMVER_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const KEBAB_CASE_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const MANIFEST_SUFFIX = '.manifest.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => isNonEmptyString(entry));
}

type ErrorList = string[];

function checkExampleLike(
  value: unknown,
  field: string,
  errors: ErrorList,
): void {
  if (!Array.isArray(value)) {
    errors.push(`${field} must be an array`);
    return;
  }
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`${field}[${index}] must be an object`);
      return;
    }
    if (!isNonEmptyString(entry.title)) errors.push(`${field}[${index}].title must be a non-empty string`);
    if (!isNonEmptyString(entry.code)) errors.push(`${field}[${index}].code must be a non-empty string`);
    if (entry.description !== undefined && !isNonEmptyString(entry.description)) {
      errors.push(`${field}[${index}].description must be a non-empty string when present`);
    }
  });
}

function checkProps(value: unknown, errors: ErrorList): void {
  if (!Array.isArray(value)) {
    errors.push('props must be an array');
    return;
  }
  const seenNames = new Set<string>();
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`props[${index}] must be an object`);
      return;
    }
    if (!isNonEmptyString(entry.name)) {
      errors.push(`props[${index}].name must be a non-empty string`);
    } else {
      if (seenNames.has(entry.name)) errors.push(`props[${index}] duplicates prop name "${entry.name}"`);
      seenNames.add(entry.name);
    }
    if (!isNonEmptyString(entry.type)) errors.push(`props[${index}].type must be a non-empty string`);
    if (typeof entry.required !== 'boolean') errors.push(`props[${index}].required must be a boolean`);
    if (!isNonEmptyString(entry.description)) errors.push(`props[${index}].description must be a non-empty string`);
    if (entry.enum !== undefined && !isStringArray(entry.enum)) {
      errors.push(`props[${index}].enum must be an array of non-empty strings`);
    }
    if (entry.examples !== undefined && !Array.isArray(entry.examples)) {
      errors.push(`props[${index}].examples must be an array`);
    }
    if (
      entry.enum !== undefined &&
      isStringArray(entry.enum) &&
      typeof entry.defaultValue === 'string' &&
      !entry.enum.includes(entry.defaultValue)
    ) {
      errors.push(`props[${index}].defaultValue "${entry.defaultValue}" is not listed in enum`);
    }
  });
}

function checkAntiPatterns(value: unknown, errors: ErrorList): void {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push('antiPatterns must be an array');
    return;
  }
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`antiPatterns[${index}] must be an object`);
      return;
    }
    if (!isNonEmptyString(entry.title)) errors.push(`antiPatterns[${index}].title must be a non-empty string`);
    if (!isNonEmptyString(entry.explanation)) errors.push(`antiPatterns[${index}].explanation must be a non-empty string`);
    if (entry.example !== undefined && !isNonEmptyString(entry.example)) {
      errors.push(`antiPatterns[${index}].example must be a non-empty string when present`);
    }
    if (entry.code !== undefined || entry.description !== undefined) {
      errors.push(`antiPatterns[${index}] uses legacy fields; use "explanation" (prose) and optional "example" (snippet)`);
    }
  });
}

function checkAccessibility(value: unknown, errors: ErrorList): void {
  if (!Array.isArray(value)) {
    errors.push('accessibility must be an array');
    return;
  }
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`accessibility[${index}] must be an object`);
      return;
    }
    if (!isNonEmptyString(entry.feature)) errors.push(`accessibility[${index}].feature must be a non-empty string`);
    if (!isNonEmptyString(entry.implementation)) {
      errors.push(`accessibility[${index}].implementation must be a non-empty string`);
    }
    if (entry.userRequirements !== undefined && !isNonEmptyString(entry.userRequirements)) {
      errors.push(`accessibility[${index}].userRequirements must be a non-empty string when present`);
    }
  });
}

function checkContentGuidelines(value: unknown, errors: ErrorList): void {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push('contentGuidelines must be an array');
    return;
  }
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`contentGuidelines[${index}] must be an object`);
      return;
    }
    if (!isNonEmptyString(entry.contentType)) {
      errors.push(`contentGuidelines[${index}].contentType must be a non-empty string`);
    }
    if (!isStringArray(entry.guidelines) || entry.guidelines.length === 0) {
      errors.push(`contentGuidelines[${index}].guidelines must be a non-empty array of strings`);
    }
  });
}

function checkCompositionRules(value: unknown, errors: ErrorList): void {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push('compositionRules must be an array');
    return;
  }
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`compositionRules[${index}] must be an object`);
      return;
    }
    if (!isNonEmptyString(entry.component)) errors.push(`compositionRules[${index}].component must be a non-empty string`);
    if (!isNonEmptyString(entry.relationship)) {
      errors.push(`compositionRules[${index}].relationship must be a non-empty string`);
    }
    if (entry.example !== undefined && !isNonEmptyString(entry.example)) {
      errors.push(`compositionRules[${index}].example must be a non-empty string when present`);
    }
  });
}

/**
 * A component's source directory is installable when it exists under
 * src/components/ and ships at least one non-test TypeScript source file —
 * the same criterion the registry generator uses to emit registry payloads.
 */
function checkSourceDirectory(
  packageDir: string,
  sourceDir: string,
  errors: ErrorList,
): void {
  const componentDir = path.join(packageDir, 'src', 'components', sourceDir);
  if (!fs.existsSync(componentDir)) {
    errors.push(`source directory src/components/${sourceDir} does not exist`);
    return;
  }
  const sourceFiles = fs
    .readdirSync(componentDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && /\.(tsx|ts)$/.test(entry.name) && !entry.name.endsWith('.test.tsx') && !entry.name.endsWith('.test.ts'),
    );
  if (sourceFiles.length === 0) {
    errors.push(`source directory src/components/${sourceDir} contains no installable .ts/.tsx files`);
  }
}

/** Checks that `exportName` is exported by some file in the component directory. */
function checkExportName(packageDir: string, sourceDir: string, exportName: string, errors: ErrorList): void {
  const componentDir = path.join(packageDir, 'src', 'components', sourceDir);
  if (!fs.existsSync(componentDir)) return; // already reported by checkSourceDirectory
  const exportPatterns = [
    new RegExp(`export\\s+(?:async\\s+)?(?:function|const|class|let|var)\\s+${exportName}\\b`),
    new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`),
  ];
  const files = fs
    .readdirSync(componentDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(tsx|ts)$/.test(entry.name) && !/\.test\.(tsx|ts)$/.test(entry.name));
  const found = files.some((file) => {
    const content = fs.readFileSync(path.join(componentDir, file.name), 'utf8');
    return exportPatterns.some((pattern) => pattern.test(content));
  });
  if (!found) {
    errors.push(`exportName "${exportName}" is not exported from src/components/${sourceDir}`);
  }
}

function validateManifest(manifest: unknown, filePath: string, packageDir: string): ErrorList {
  const errors: ErrorList = [];
  if (!isRecord(manifest)) return [`${filePath}: manifest must be a JSON object`];

  for (const field of ['id', 'name', 'tier', 'description', 'designIntent', 'package', 'importPath', 'version'] as const) {
    if (!isNonEmptyString(manifest[field])) errors.push(`${field} must be a non-empty string`);
  }

  if (isNonEmptyString(manifest.id)) {
    if (!KEBAB_CASE_PATTERN.test(manifest.id)) errors.push(`id "${manifest.id}" must be kebab-case`);
    const expectedFile = `${manifest.id}${MANIFEST_SUFFIX}`;
    if (path.basename(filePath) !== expectedFile) {
      errors.push(`filename must be "${expectedFile}" to match id "${manifest.id}"`);
    }
  }

  if (isNonEmptyString(manifest.tier) && !ALLOWED_TIERS.has(manifest.tier)) {
    errors.push(`tier "${manifest.tier}" must be one of: ${[...ALLOWED_TIERS].join(', ')}`);
  }

  if (isNonEmptyString(manifest.package) && !ALLOWED_PACKAGE_NAMES.has(manifest.package)) {
    errors.push(`package "${manifest.package}" must be one of: ${[...ALLOWED_PACKAGE_NAMES].join(', ')}`);
  }

  if (isNonEmptyString(manifest.version) && !SEMVER_PATTERN.test(manifest.version)) {
    errors.push(`version "${manifest.version}" must be a semver string (e.g. 1.0.0)`);
  }

  if (
    isNonEmptyString(manifest.importPath) &&
    isNonEmptyString(manifest.package) &&
    !manifest.importPath.startsWith(manifest.package)
  ) {
    errors.push(`importPath "${manifest.importPath}" must start with package "${manifest.package}"`);
  }

  checkProps(manifest.props, errors);
  checkExampleLike(manifest.examples, 'examples', errors);
  if (manifest.examples !== undefined && Array.isArray(manifest.examples) && manifest.examples.length === 0) {
    errors.push('examples must contain at least one entry');
  }
  if (manifest.antiPatterns !== undefined) checkAntiPatterns(manifest.antiPatterns, errors);
  checkAccessibility(manifest.accessibility, errors);
  if (manifest.accessibility !== undefined && Array.isArray(manifest.accessibility) && manifest.accessibility.length === 0) {
    errors.push('accessibility must contain at least one entry');
  }
  checkContentGuidelines(manifest.contentGuidelines, errors);
  checkCompositionRules(manifest.compositionRules, errors);
  if (manifest.relatedComponents !== undefined && !isStringArray(manifest.relatedComponents)) {
    errors.push('relatedComponents must be an array of non-empty strings');
  }
  if (manifest.sourceDir !== undefined && !isNonEmptyString(manifest.sourceDir)) {
    errors.push('sourceDir must be a non-empty string when present');
  }
  if (manifest.exportName !== undefined && !isNonEmptyString(manifest.exportName)) {
    errors.push('exportName must be a non-empty string when present');
  }

  // Registry-installation invariants (mirrors scripts/generate-registry.ts).
  const sourceDir = isNonEmptyString(manifest.sourceDir) ? manifest.sourceDir : manifest.id;
  if (isNonEmptyString(manifest.id)) {
    checkSourceDirectory(packageDir, sourceDir, errors);
    if (isNonEmptyString(manifest.exportName)) {
      checkExportName(packageDir, sourceDir, manifest.exportName, errors);
    }
  }

  return errors;
}

function main(): void {
  console.log('Validating component manifests...');

  const invalidCountRef = { count: 0 };
  let validCount = 0;
  const idsSeen = new Map<string, string>();

  for (const { name, dir } of PACKAGES) {
    const manifestDir = path.join(dir, 'src', 'manifests');
    if (!fs.existsSync(manifestDir)) continue;

    const manifestFiles = fs
      .readdirSync(manifestDir)
      .filter((file) => file.endsWith('.json'))
      .sort();

    for (const manifestFile of manifestFiles) {
      const manifestPath = path.join(manifestDir, manifestFile);
      let parsed: unknown;
      try {
        parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch (error) {
        console.error(`✗ ${path.relative(ROOT, manifestPath)}: invalid JSON (${(error as Error).message})`);
        invalidCountRef.count++;
        continue;
      }

      const errors = validateManifest(parsed, manifestPath, dir);

      if (isRecord(parsed) && isNonEmptyString(parsed.id)) {
        const previous = idsSeen.get(parsed.id);
        if (previous) {
          errors.push(`duplicate component id "${parsed.id}" (also declared in ${previous})`);
        } else {
          idsSeen.set(parsed.id, `${name}:${path.relative(ROOT, manifestPath)}`);
        }
      }

      if (errors.length > 0) {
        invalidCountRef.count++;
        console.error(`✗ ${name} ${path.relative(ROOT, manifestPath)}`);
        for (const error of errors) console.error(`    - ${error}`);
      } else {
        validCount++;
      }
    }
  }

  console.log(`\nValidation complete: ${validCount} valid, ${invalidCountRef.count} invalid`);
  if (invalidCountRef.count > 0) process.exit(1);
}

main();
