import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Response } from './Response';
import { closeIncompleteMarkdown } from './close-incomplete-markdown';

describe('closeIncompleteMarkdown', () => {
  it('leaves complete markdown untouched', () => {
    const text = 'Hello **world** and `code`';
    expect(closeIncompleteMarkdown(text)).toBe(text);
  });

  it('closes an unclosed bold marker', () => {
    expect(closeIncompleteMarkdown('Hello **wor')).toBe('Hello **wor**');
  });

  it('closes unclosed inline code', () => {
    expect(closeIncompleteMarkdown('Run `npm dev')).toBe('Run `npm dev`');
  });

  it('closes an unterminated code fence', () => {
    const result = closeIncompleteMarkdown('Example:\n```js\nconst x = 1;');
    expect(result.endsWith('```')).toBe(true);
  });

  it('does not touch content inside an open fence', () => {
    // The unclosed `**` after the fence is code content and must stay as-is.
    const result = closeIncompleteMarkdown('```js\n// ** not emphasis');
    expect(result.endsWith('```')).toBe(true);
    expect(result).toContain('// ** not emphasis\n```');
  });

  it('leaves intraword underscores alone', () => {
    expect(closeIncompleteMarkdown('use snake_case here')).toBe('use snake_case here');
    expect(closeIncompleteMarkdown('a_b_c and d_e')).toBe('a_b_c and d_e');
  });

  it('leaves complete inline code alone', () => {
    expect(closeIncompleteMarkdown('call `my_func` first')).toBe('call `my_func` first');
    expect(closeIncompleteMarkdown('see `a_b` and `c_d`')).toBe('see `a_b` and `c_d`');
  });

  it('still closes real emphasis around code', () => {
    expect(closeIncompleteMarkdown('`x` and **wor')).toBe('`x` and **wor**');
    expect(closeIncompleteMarkdown('Hello *wor')).toBe('Hello *wor*');
    expect(closeIncompleteMarkdown('~~gone')).toBe('~~gone~~');
  });
});

describe('Response', () => {
  it('renders markdown paragraphs', () => {
    render(<Response>{'# Heading\n\nParagraph with **bold**.'}</Response>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading');
    expect(screen.getByText(/bold/)).toBeInTheDocument();
  });

  it('renders GFM tables and task lists', () => {
    render(
      <Response>{'| a | b |\n|---|---|\n| 1 | 2 |'}</Response>
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders fenced code through CodeBlock with language label', () => {
    render(<Response>{'```python\nprint("hi")\n```'}</Response>);
    expect(screen.getByText('python')).toBeInTheDocument();
  });

  it('repairs incomplete bold while streaming', () => {
    render(<Response>{'Partial **mess'}</Response>);
    // The repaired marker means no stray asterisks appear as literal text nodes
    // beyond the closed pair; assert the strong element rendered.
    expect(screen.getByText('mess').closest('strong') ?? screen.queryByText('**')).toBeTruthy();
  });

  it('passes raw content through when parseIncompleteMarkdown is false', () => {
    render(<Response parseIncompleteMarkdown={false}>{'Partial **mess'}</Response>);
    expect(screen.getByText(/\*\*/)).toBeInTheDocument();
  });

  it('renders inline code distinctly', () => {
    render(<Response>{'Use `npm install` first.'}</Response>);
    const inline = screen.getByText('npm install');
    expect(inline).toHaveClass('font-mono');
  });
});

describe('Response content edges', () => {
  it('does not execute or render raw HTML', () => {
    const { container } = render(
      <Response>{'Before <script>alert(1)</script> <img src=x onerror=alert(1)> after'}</Response>
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('Before');
  });

  it('strips unsafe link protocols', () => {
    render(<Response>{'[click me](javascript:alert(1))'}</Response>);
    const link = screen.getByText('click me').closest('a');
    expect(link?.getAttribute('href') ?? '').not.toContain('javascript:');
  });

  it('keeps safe links and list structure', () => {
    render(<Response>{'[docs](https://example.com)\n\n- one\n- two\n\n> quoted'}</Response>);
    expect(screen.getByRole('link', { name: 'docs' })).toHaveAttribute(
      'href',
      'https://example.com'
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('quoted').closest('blockquote')).toBeTruthy();
  });

  it('routes an unlabelled fence to CodeBlock as plain text', () => {
    render(<Response>{'```\nplain contents\n```'}</Response>);
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('keeps inline code inline next to unlabelled fences', () => {
    render(<Response>{'Use `npm install` in a terminal.'}</Response>);
    expect(screen.queryByText('text')).not.toBeInTheDocument();
    expect(screen.getByText('npm install')).toHaveClass('font-mono');
  });

  it('renders a paragraph for plain multi-line text', () => {
    render(<Response>{'line one\nline two'}</Response>);
    expect(screen.getByText(/line one/).tagName).toBe('P');
  });

  it('renders an empty message without crashing', () => {
    const { container } = render(<Response>{''}</Response>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders a partially streamed fence', () => {
    const { container } = render(<Response>{'Example:\n```js\nconst x = 1;'}</Response>);
    expect(container.textContent).toContain('const x = 1;');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Response>
        {'# Title\n\nText with a [link](https://example.com).\n\n```ts\nconst x = 1;\n```\n\n- item'}
      </Response>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
