'use client';

import { cn } from '@slipstream-ui/core';

interface CodeBlockProps {
  children: string;
  className?: string;
}

/** Shared syntax-styled code block used across docs pages. */
export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        'bg-muted p-4 rounded text-sm overflow-x-auto',
        className
      )}
    >
      <code>{children}</code>
    </pre>
  );
}
