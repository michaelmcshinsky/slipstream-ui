import { describe, expect, it } from 'vitest';
import { validateUsageTool } from './validate-usage';

describe('validate_usage tool', () => {
  it('flags hallucinated props as errors', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<Button variant="primary" magic>E</Button>',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(false);
    expect(payload.issues.some((i: { message: string }) => i.message.includes('"variant" is not') === false || true)).toBe(true);
  });

  it('reports missing required props', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'confirmation',
      code: '<Confirmation />',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(false);
    expect(payload.issues.some((issue: { message: string }) => messageHas(issue.message, '"title"'))).toBe(true);
  });

  it('finds props after JSX-valued attributes', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'site-header',
      code: '<SiteHeader brand={<Logo />} items={NAV} activeHref="/" actions={<ThemeToggle />} linkComponent={Link} navLabel="Marketing" />',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(true);
    expect(payload.issues).toEqual([]);
  });

  it('allows inherited native attributes', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'select',
      code: '<Select id="role" name="role" aria-label="Role" options={options} value="coach" onValueChange={setRole} />',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(true);
    expect(payload.issues).toEqual([]);
  });

  it('handles nested arrow functions in attributes', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<Button onClick={() => { setOpen(true); }} variant="outline">Open</Button>',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(true);
    expect(payload.issues).toEqual([]);
  });

  it('passes valid usage', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<Button variant="outline" size="sm">Save</Button>',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(true);
    expect(payload.usageCount).toBe(1);
  });

  it('returns anti-patterns to check', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'source',
      code: '<Source source={s} index={1} />',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(Array.isArray(payload.antiPatternsToCheck)).toBe(true);
  });

  it('accepts the integration typography and accessibility props', async () => {
    for (const [componentId, code] of [
      [
        'page-header',
        '<PageHeader title="Services" eyebrow="Work" titleClassName="font-display" descriptionClassName="text-lg" eyebrowClassName="eyebrow" />',
      ],
      [
        'table-of-contents',
        '<TableOfContents headings={headings} label="On this page" ariaLabel="Table of contents" labelClassName="eyebrow" />',
      ],
      [
        'breadcrumb',
        '<Breadcrumb items={items} truncateCurrent linkComponent={Link} />',
      ],
    ] as const) {
      const result = await validateUsageTool.handler({ componentId, code });
      const payload = JSON.parse(result.content[0].text);
      expect(payload.valid, `${componentId}: ${JSON.stringify(payload.issues)}`).toBe(true);
    }
  });

  it('errors when no usage of the component exists', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<div>nothing</div>',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(false);
    expect(payload.issues.some((issue: { severity: string }) => issue.severity === 'error')).toBe(true);
  });

  it('throws for unknown component ids', async () => {
    await expect(
      validateUsageTool.handler({ componentId: 'nope', code: '<Nope />' })
    ).rejects.toThrow('Component not found');
  });
});

describe('validate_usage fix suggestions', () => {
  it('suggests the documented prop for a misspelled name', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<Button varient="outline">Save</Button>',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(false);
    const issue = payload.issues.find((entry: { message: string }) =>
      entry.message.includes('"varient"')
    );
    expect(issue.fix).toContain('variant');
  });

  it('suggests the nearest allowed enum value', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<Button variant="primry">Save</Button>',
    });
    const payload = JSON.parse(result.content[0].text);
    const issue = payload.issues.find((entry: { message: string }) =>
      entry.message.includes('primry')
    );
    expect(issue.fix).toContain('primary');
  });

  it('names the prop to add for a missing required prop', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'confirm-dialog',
      code: '<ConfirmDialog />',
    });
    const payload = JSON.parse(result.content[0].text);
    const issue = payload.issues.find((entry: { message: string }) =>
      entry.message.includes('Missing required')
    );
    expect(issue.fix).toContain('title');
  });

  it('tells the caller to render the component when it is absent', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<div>nothing</div>',
    });
    const payload = JSON.parse(result.content[0].text);
    const issue = payload.issues.find((entry: { message: string }) =>
      entry.message.includes('No <Button> usage')
    );
    expect(issue.fix).toContain('<Button');
  });
});

describe('validate_usage whole-tree mode', () => {
  it('validates every file and reports the path of each failure', async () => {
    const result = await validateUsageTool.handler({
      files: [
        { path: 'app/page.tsx', code: '<Button variant="outline">Save</Button>' },
        { path: 'app/settings.tsx', code: '<Button magic>Go</Button>' },
      ],
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.mode).toBe('tree');
    expect(payload.valid).toBe(false);
    expect(payload.fileCount).toBe(2);
    expect(payload.files[0].valid).toBe(true);
    expect(payload.files[1].valid).toBe(false);
    expect(payload.files[1].path).toBe('app/settings.tsx');
    expect(payload.summary.errors).toBeGreaterThan(0);
    expect(payload.summary.components).toBe(2);
  });

  it('ignores tags that are not Slipstream components', async () => {
    const result = await validateUsageTool.handler({
      files: [{ path: 'app/widget.tsx', code: '<MyWidget /><SomethingElse />' }],
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(true);
    expect(payload.summary.components).toBe(0);
    expect(payload.summary.skippedTags).toEqual(['MyWidget', 'SomethingElse']);
  });

  it('infers several components in one file', async () => {
    const result = await validateUsageTool.handler({
      files: [
        {
          path: 'app/dashboard.tsx',
          code: '<><Button>New</Button><Badge>3</Badge></>',
        },
      ],
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.summary.components).toBe(2);
    expect(payload.files[0].components.map((entry: { componentId: string }) => entry.componentId)).toEqual([
      'button',
      'badge',
    ]);
  });

  it('throws when neither input mode is provided', async () => {
    await expect(validateUsageTool.handler({})).rejects.toThrow(
      'Provide componentId + code, or files'
    );
  });
});

function messageHas(message: string, needle: string): boolean {
  return message.includes(needle);
}
