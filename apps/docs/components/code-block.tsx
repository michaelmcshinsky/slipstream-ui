'use client';

import { cn } from '@slipstream-ui/core';

interface CodeBlockProps {
  /** Code content as children (string). */
  children?: string;
  /** Code content as a prop (alternative to children). */
  code?: string;
  /** Language identifier for syntax highlighting. */
  language?: string;
  className?: string;
}

/** Shared syntax-styled code block used across docs pages. */
export function CodeBlock({ children, code, language, className }: CodeBlockProps) {
  const content = code ?? children ?? '';
  return (
    <pre
      className={cn(
        'bg-muted p-4 rounded text-sm overflow-x-auto',
        className
      )}
      data-language={language}
    >
      <code>{content}</code>
    </pre>
  );
}