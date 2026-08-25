#!/usr/bin/env node
/**
 * Generate component manifests from TypeScript types
 * 
 * This script reads component files and generates COMPONENT_MANIFEST JSON files.
 * In a full implementation, this would use TypeScript compiler API to extract types,
 * JSDoc comments, and generate comprehensive manifests.
 */

import fs from 'fs';
import path from 'path';

// For now, this is a placeholder that validates existing manifests
const CORE_MANIFESTS_DIR = path.join(__dirname, '../packages/core/src/manifests');
const AI_MANIFESTS_DIR = path.join(__dirname, '../packages/ai/src/manifests');

function validateManifest(manifestPath: string): boolean {
  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    // Basic validation
    const requiredFields = ['id', 'name', 'tier', 'description', 'designIntent', 'props', 'examples', 'accessibility', 'package', 'importPath', 'version'];
    
    for (const field of requiredFields) {
      if (!manifest[field]) {
        console.error(`Missing required field "${field}" in ${manifestPath}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`Error validating ${manifestPath}:`, error);
    return false;
  }
}

function main() {
  console.log('Validating component manifests...');

  let validCount = 0;
  let invalidCount = 0;

  // Validate core manifests
  if (fs.existsSync(CORE_MANIFESTS_DIR)) {
    const coreManifests = fs.readdirSync(CORE_MANIFESTS_DIR).filter(f => f.endsWith('.json'));
    for (const manifestFile of coreManifests) {
      const manifestPath = path.join(CORE_MANIFESTS_DIR, manifestFile);
      if (validateManifest(manifestPath)) {
        validCount++;
      } else {
        invalidCount++;
      }
    }
  }

  // Validate AI manifests
  if (fs.existsSync(AI_MANIFESTS_DIR)) {
    const aiManifests = fs.readdirSync(AI_MANIFESTS_DIR).filter(f => f.endsWith('.json'));
    for (const manifestFile of aiManifests) {
      const manifestPath = path.join(AI_MANIFESTS_DIR, manifestFile);
      if (validateManifest(manifestPath)) {
        validCount++;
      } else {
        invalidCount++;
      }
    }
  }

  console.log(`\nValidation complete: ${validCount} valid, ${invalidCount} invalid`);
  
  if (invalidCount > 0) {
    process.exit(1);
  }
}

main();
