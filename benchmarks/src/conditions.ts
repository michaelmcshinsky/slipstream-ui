import type { Condition } from './types';
import type { BenchmarkCase } from './types';
import { manifestById, readComponentMarkdown, readComponentSource } from './manifests';

const SYSTEM_PROMPT =
  'You are a senior React engineer. Produce one JSX usage of the requested Slipstream UI component. ' +
  'Use only documented props. Return code only: no markdown fences, no explanation.';

function truncate(text: string, maxChars: number): string {
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n/* truncated */` : text;
}

function contextFor(condition: Condition, componentId: string): string {
  const manifest = manifestById(componentId);
  const manifestSummary = {
    id: manifest.id,
    name: manifest.name,
    exportName: manifest.exportName,
    description: manifest.description,
    props: manifest.props,
    examples: manifest.examples?.slice(0, 2),
    antiPatterns: manifest.antiPatterns,
  };

  switch (condition) {
    case 'A': {
      const markdown = readComponentMarkdown(componentId);
      return `# Documentation\n\n${truncate(markdown || manifest.description || '', 8000)}`;
    }
    case 'B': {
      const source = readComponentSource(manifest);
      return `# TypeScript source\n\n${truncate(source || manifest.description || '', 8000)}`;
    }
    case 'C':
      return `# COMPONENT_MANIFEST\n\n${JSON.stringify(manifestSummary, null, 2)}`;
    case 'D':
      return [
        '# COMPONENT_MANIFEST',
        JSON.stringify(manifestSummary, null, 2),
        '',
        '# Validation',
        'After writing the JSX, check it against the manifest: every prop must exist, required props must be present, and enum values must be allowed. Return the corrected JSX.',
      ].join('\n');
  }
}

export function buildPrompt(benchmarkCase: BenchmarkCase, condition: Condition): { system: string; user: string } {
  const context = contextFor(condition, benchmarkCase.componentId);
  return {
    system: SYSTEM_PROMPT,
    user: [
      context,
      '',
      `# Task\n${benchmarkCase.prompt}`,
      '',
      'Return exactly one JSX expression using the component. No imports, no fences.',
    ].join('\n'),
  };
}

export function buildRepairPrompt(
  benchmarkCase: BenchmarkCase,
  condition: Condition,
  previousOutput: string,
  issues: string[],
): { system: string; user: string } {
  const base = buildPrompt(benchmarkCase, condition);
  return {
    system: base.system,
    user: [
      base.user,
      '',
      '# Previous output',
      previousOutput,
      '',
      '# Validator findings',
      issues.length > 0 ? issues.map((issue) => `- ${issue}`).join('\n') : '- Output did not validate.',
      '',
      'Return a corrected JSX expression only.',
    ].join('\n'),
  };
}
