import * as React from 'react';
import type { ReactNode } from 'react';
import { ScrollablePre, ScrollableRegion } from '@/components/scrollable-region';

/** Local class joiner: this file is a server component, so it must not pull
 *  the client-barrel `cn` helper from @slipstream-ui/core. */
function cx(...values: (string | false | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}

export type MarkdownAlign = 'left' | 'center' | 'right';

export type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; id: string; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; language: string; code: string }
  | { type: 'blockquote'; text: string }
  | { type: 'table'; headers: string[]; align: MarkdownAlign[]; rows: string[][] }
  | { type: 'hr' };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function splitRow(line: string): string[] {
  let value = line.trim();
  if (value.startsWith('|')) value = value.slice(1);
  if (value.endsWith('|')) value = value.slice(0, -1);
  return value.split('|').map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const cells = splitRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));
}

function tableAlign(line: string): MarkdownAlign[] {
  return splitRow(line).map((cell) => {
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    return 'left';
  });
}

function listMatch(line: string): { ordered: boolean; text: string } | null {
  const match = /^\s*(?:([-*+])|(\d+)\.)\s+(.+)$/.exec(line);
  if (!match) return null;
  return { ordered: Boolean(match[2]), text: match[3] };
}

function isBlockStart(line: string): boolean {
  return (
    /^#{1,4}\s+/.test(line) ||
    /^```/.test(line) ||
    /^>\s?/.test(line) ||
    /^(-{3,}|\*{3,})\s*$/.test(line) ||
    listMatch(line) !== null
  );
}

/**
 * Parse the markdown subset used by the published articles: headings,
 * paragraphs, ordered/unordered lists, fenced code, blockquotes, GFM tables
 * and horizontal rules. Inline bold, italic, code and links are rendered by
 * `renderInline`.
 */
export function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  const usedIds = new Map<string, number>();
  let index = 0;

  const headingId = (text: string) => {
    const base = slugifyHeading(text) || 'section';
    const seen = usedIds.get(base) ?? 0;
    usedIds.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  };

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^```/.test(line)) {
      const language = line.slice(3).trim();
      index += 1;
      const code: string[] = [];
      while (index < lines.length && !/^```/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: 'code', language, code: code.join('\n') });
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      const text = heading[2].trim();
      blocks.push({
        type: 'heading',
        level: heading[1].length as 1 | 2 | 3 | 4,
        id: headingId(text),
        text,
      });
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push({ type: 'hr' });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push({ type: 'blockquote', text: quote.join(' ') });
      continue;
    }

    if (line.includes('|') && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      const headers = splitRow(line);
      const align = tableAlign(lines[index + 1]);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(splitRow(lines[index]));
        index += 1;
      }
      blocks.push({ type: 'table', headers, align, rows });
      continue;
    }

    const firstItem = listMatch(line);
    if (firstItem) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = listMatch(lines[index]);
        if (item && item.ordered === firstItem.ordered) {
          items.push(item.text);
          index += 1;
          continue;
        }
        // A wrapped continuation line belongs to the previous item.
        if (items.length > 0 && /^\s{2,}\S/.test(lines[index]) && !isBlockStart(lines[index])) {
          items[items.length - 1] += ` ${lines[index].trim()}`;
          index += 1;
          continue;
        }
        break;
      }
      blocks.push({ type: 'list', ordered: firstItem.ordered, items });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      if (lines[index].includes('|') && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
        break;
      }
      paragraph.push(lines[index].trim());
      index += 1;
    }
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    } else {
      index += 1;
    }
  }

  return blocks;
}

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*|_[^_\n]+_)/g;

function safeHref(href: string): string | undefined {
  const value = href.trim();
  if (value.startsWith('/') || value.startsWith('#')) return value;
  if (/^(https?:|mailto:)/.test(value)) return value;
  return undefined;
}

/** Render inline markdown (bold, italic, code, links) as React nodes. */
export function renderInline(text: string, keyPrefix = 'inline'): ReactNode[] {
  const parts = text.split(INLINE_PATTERN).filter((part) => part !== '');
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={key} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const href = safeHref(link[2]);
      if (!href) return <span key={key}>{link[1]}</span>;
      const external = /^https?:/.test(href);
      return (
        <a
          key={key}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {link[1]}
        </a>
      );
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <span key={key}>{part}</span>;
  });
}

function headingClass(level: 1 | 2 | 3 | 4): string {
  if (level === 1) return 'mt-10 text-2xl font-bold tracking-tight first:mt-0';
  if (level === 2) return 'mt-10 text-xl font-semibold tracking-tight';
  if (level === 3) return 'mt-8 text-lg font-semibold';
  return 'mt-6 text-base font-semibold';
}

/**
 * Server-renderable markdown article body. Deliberately not a client
 * component: the text, code and tables are in the initial HTML so search
 * engines and answer engines can read the article without JavaScript.
 */
export function MarkdownContent({ markdown, className }: { markdown: string; className?: string }) {
  const blocks = parseMarkdown(markdown);

  return (
    <div className={cx('max-w-none text-[15px] leading-7 text-muted-foreground', className)}>
      {blocks.map((block, blockIndex) => {
        switch (block.type) {
          case 'heading': {
            const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4';
            return (
              <Tag key={`${block.id}-${blockIndex}`} id={block.id} className={headingClass(block.level)}>
                {renderInline(block.text, `h-${blockIndex}`)}
              </Tag>
            );
          }
          case 'paragraph':
            return (
              <p key={`p-${blockIndex}`} className="mt-4">
                {renderInline(block.text, `p-${blockIndex}`)}
              </p>
            );
          case 'list': {
            const Tag = block.ordered ? 'ol' : 'ul';
            return (
              <Tag
                key={`l-${blockIndex}`}
                className={cx('mt-4 space-y-2 pl-5', block.ordered ? 'list-decimal' : 'list-disc')}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`li-${blockIndex}-${itemIndex}`}>
                    {renderInline(item, `li-${blockIndex}-${itemIndex}`)}
                  </li>
                ))}
              </Tag>
            );
          }
          case 'code':
            return (
              <ScrollablePre
                key={`c-${blockIndex}`}
                className="mt-5 overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 font-mono text-xs leading-relaxed text-foreground"
              >
                <code>{block.code}</code>
              </ScrollablePre>
            );
          case 'blockquote':
            return (
              <blockquote
                key={`b-${blockIndex}`}
                className="mt-5 border-l-2 border-primary/40 pl-4 text-foreground"
              >
                {renderInline(block.text, `b-${blockIndex}`)}
              </blockquote>
            );
          case 'table':
            return (
              <ScrollableRegion key={`t-${blockIndex}`} label="Table" className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {block.headers.map((header, cellIndex) => (
                        <th
                          key={`th-${cellIndex}`}
                          className={cx(
                            'p-3 font-medium',
                            block.align[cellIndex] === 'right'
                              ? 'text-right'
                              : block.align[cellIndex] === 'center'
                                ? 'text-center'
                                : 'text-left'
                          )}
                        >
                          {renderInline(header, `th-${blockIndex}-${cellIndex}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={`tr-${rowIndex}`} className="border-t border-border">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`td-${rowIndex}-${cellIndex}`}
                            className={cx(
                              'p-3',
                              block.align[cellIndex] === 'right'
                                ? 'text-right'
                                : block.align[cellIndex] === 'center'
                                  ? 'text-center'
                                  : 'text-left'
                            )}
                          >
                            {renderInline(cell, `td-${rowIndex}-${cellIndex}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollableRegion>
            );
          case 'hr':
            return <hr key={`hr-${blockIndex}`} className="mt-8 border-border" />;
          default:
            return null;
        }
      })}
    </div>
  );
}

