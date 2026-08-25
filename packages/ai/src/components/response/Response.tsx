'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@slipstream-ui/core';
import { CodeBlock } from '../code-block';
import { closeIncompleteMarkdown } from './close-incomplete-markdown';

export interface ResponseProps {
  /** Markdown content to render. */
  children: string;
  /**
   * Repair unclosed emphasis/inline-code/fences while streaming so partial
   * chunks render cleanly (default true).
   */
  parseIncompleteMarkdown?: boolean;
  className?: string;
}

/**
 * Streaming-optimized markdown renderer for AI responses.
 *
 * Wraps react-markdown with GFM support and routes fenced code blocks to
 * the CodeBlock component for highlighting + copy.
 */
const Response = React.forwardRef<HTMLDivElement, ResponseProps>(
  ({ children, parseIncompleteMarkdown = true, className, ...props }, ref) => {
    const content = React.useMemo(
      () => (parseIncompleteMarkdown ? closeIncompleteMarkdown(children) : children),
      [children, parseIncompleteMarkdown]
    );

    return (
      <div
        ref={ref}
        className={cn(
          'text-sm space-y-3 [&_a]:text-primary [&_a]:underline underline-offset-2',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
          '[&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold',
          '[&_h3]:text-sm [&_h3]:font-semibold',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
          '[&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:border-border [&_th]:p-1.5 [&_td]:border [&_td]:border-border [&_td]:p-1.5',
          className
        )}
        {...props}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: ({ children }) => <>{children}</>,
            code: ({ className: codeClassName, children: codeChildren }) => {
              const raw = String(codeChildren).replace(/\n$/, '');
              const match = /language-(\w+)/.exec(codeClassName ?? '');
              const isInline = !match && !raw.includes('\n');
              if (isInline) {
                return (
                  <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono before:content-none after:content-none">
                    {raw}
                  </code>
                );
              }
              return <CodeBlock code={raw} language={match?.[1] ?? 'text'} />;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
);
Response.displayName = 'Response';

export { Response };
