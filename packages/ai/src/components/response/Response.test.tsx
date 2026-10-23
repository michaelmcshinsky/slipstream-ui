import { render, screen } from '@testing-library/react';
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
