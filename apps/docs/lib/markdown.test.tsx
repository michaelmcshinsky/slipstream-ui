import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MarkdownContent, parseMarkdown, renderInline, slugifyHeading } from './markdown';

describe('parseMarkdown', () => {
  it('parses headings and gives duplicate headings unique ids', () => {
    const blocks = parseMarkdown('# One\n\n## Two\n\n## Two');
    expect(blocks).toEqual([
      { type: 'heading', level: 1, id: 'one', text: 'One' },
      { type: 'heading', level: 2, id: 'two', text: 'Two' },
      { type: 'heading', level: 2, id: 'two-2', text: 'Two' },
    ]);
  });

  it('joins wrapped paragraph lines and keeps code fences intact', () => {
    const blocks = parseMarkdown('First line\nsecond line.\n\n```ts\nconst x = 1;\n```');
    expect(blocks[0]).toEqual({ type: 'paragraph', text: 'First line second line.' });
    expect(blocks[1]).toEqual({ type: 'code', language: 'ts', code: 'const x = 1;' });
  });

  it('parses ordered and unordered lists', () => {
    const blocks = parseMarkdown('- one\n- two\n\n1. first\n2. second');
    expect(blocks[0]).toEqual({ type: 'list', ordered: false, items: ['one', 'two'] });
    expect(blocks[1]).toEqual({ type: 'list', ordered: true, items: ['first', 'second'] });
  });

  it('parses a GFM table with alignment', () => {
    const blocks = parseMarkdown('| Metric | Value |\n|---|--:|\n| Recall | **65.7%** |\n| Precision | 100% |');
    expect(blocks[0]).toEqual({
      type: 'table',
      headers: ['Metric', 'Value'],
      align: ['left', 'right'],
      rows: [
        ['Recall', '**65.7%**'],
        ['Precision', '100%'],
      ],
    });
  });

  it('parses blockquotes and horizontal rules', () => {
    const blocks = parseMarkdown('> A claim.\n> Still quoted.\n\n---');
    expect(blocks[0]).toEqual({ type: 'blockquote', text: 'A claim. Still quoted.' });
    expect(blocks[1]).toEqual({ type: 'hr' });
  });

  it('keeps inline code containing pipes from becoming a table', () => {
    const blocks = parseMarkdown('Use `a | b` in a sentence.');
    expect(blocks).toEqual([{ type: 'paragraph', text: 'Use `a | b` in a sentence.' }]);
  });
});

describe('slugifyHeading', () => {
  it('produces stable anchor ids', () => {
    expect(slugifyHeading('What this means')).toBe('what-this-means');
    expect(slugifyHeading('**Bold** and `code`')).toBe('bold-and-code');
  });
});

describe('renderInline', () => {
  it('renders bold, italic, inline code and links', () => {
    const html = renderToStaticMarkup(
      <p>{renderInline('**bold** *italic* `code` [docs](/docs)')}</p>
    );
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
    expect(html).toContain('font-mono');
    expect(html).toContain('href="/docs"');
  });

  it('refuses unsafe link protocols', () => {
    const html = renderToStaticMarkup(
      <p>{renderInline('[click](javascript:alert(1))')}</p>
    );
    expect(html).not.toContain('javascript:');
    expect(html).toContain('click');
  });

  it('marks external links with rel and a new target', () => {
    const html = renderToStaticMarkup(<p>{renderInline('[repo](https://github.com/x/y)')}</p>);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe('MarkdownContent', () => {
  it('server-renders article text, tables and code in the initial HTML', () => {
    const html = renderToStaticMarkup(
      <MarkdownContent markdown={'## Result\n\n| Metric | Value |\n|---|---|\n| Recall | 65.7% |\n\n```bash\npnpm bench\n```'} />
    );
    expect(html).toContain('<h2');
    expect(html).toContain('Result');
    expect(html).toContain('<table');
    expect(html).toContain('Recall');
    expect(html).toContain('pnpm bench');
  });
});
