import { describe, expect, it } from 'vitest';
import { buildAiInstruction } from './copy-for-ai';
import { RELEASE } from './release';

const manifest = {
  componentId: 'button',
  id: 'button',
  name: 'Button',
  description: 'A clickable button.',
  package: '@slipstream-ui/core',
  packageVersion: '0.8.0',
  importPath: '@slipstream-ui/core',
  exportName: 'Button',
  docs: 'https://slipstreamui.com/docs/components/button',
  props: [
    { name: 'variant', type: "'default' | 'primary'", required: false, defaultValue: 'default', description: 'Visual style' },
    { name: 'onClick', type: '() => void', required: true, description: 'Fires on press' },
  ],
  examples: [{ title: 'Primary action', description: 'A save button', code: '<Button variant="primary">Save</Button>' }],
  antiPatterns: [{ title: 'Nested buttons', explanation: 'Do not nest interactive controls', example: '<Button><Button /></Button>' }],
  accessibility: [{ feature: 'Keyboard', implementation: 'Enter and Space activate the button' }],
  compositionRules: [{ component: 'ButtonGroup', relationship: 'Groups related actions' }],
  relatedComponents: ['ButtonGroup'],
};

describe('buildAiInstruction', () => {
  const text = buildAiInstruction(manifest, 'button');

  it('includes the release contract and canonical locations', () => {
    expect(text).toContain('# Slipstream UI: Button');
    expect(text).toMatch(new RegExp(`Release: ${RELEASE.version.replace(/\./g, '\\.')}`));
    expect(text).toContain('manifest schema v1');
    expect(text).toContain("import { Button } from '@slipstream-ui/core'");
    expect(text).toContain('https://slipstreamui.com/docs/components/button');
    expect(text).toContain('https://slipstreamui.com/registry/button.json');
  });

  it('lists required and optional props with exact names', () => {
    expect(text).toContain('## Required props');
    expect(text).toMatch(/^- onClick$/m);
    expect(text).toContain('variant');
    expect(text).toContain('required');
    expect(text).toContain('default: default');
  });

  it('carries examples, anti-patterns, accessibility and composition', () => {
    expect(text).toContain('## Examples');
    expect(text).toContain('<Button variant="primary">Save</Button>');
    expect(text).toContain('## Anti-patterns');
    expect(text).toContain('Do not nest interactive controls');
    expect(text).toContain('## Accessibility');
    expect(text).toContain('Enter and Space activate the button');
    expect(text).toContain('## Composition');
    expect(text).toContain('ButtonGroup');
  });

  it('states the limits of static validation', () => {
    expect(text).toContain('static validation is not a visual or semantic guarantee');
  });
});
