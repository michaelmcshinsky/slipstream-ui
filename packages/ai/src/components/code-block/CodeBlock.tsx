'use client';

import * as React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { cn } from '@slipstream-ui/core';

export interface CodeBlockProps {
  /** Raw code to display (no trailing newline needed). */
  code: string;
  /** Language identifier used for Prism highlighting. */
  language?: string;
  /** Show a copy-to-clipboard button (default true). */
  showCopyButton?: boolean;
  className?: string;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ code, language = 'tsx', showCopyButton = true, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const trimmedCode = code.replace(/\n$/, '');

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(trimmedCode);
      } catch {
        // Clipboard unavailable (insecure context); still show feedback so
        // consumers can hook onCopy-style behavior via DOM if needed.
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative group rounded-md border border-border bg-muted/50 overflow-hidden',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/60">
          <span className="text-xs font-mono text-muted-foreground uppercase">{language}</span>
          {showCopyButton && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy code'}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <Highlight theme={themes.vsDark} code={trimmedCode} language={language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className="overflow-x-auto p-4 text-xs leading-relaxed m-0"
              style={{ ...style, background: 'transparent' }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    );
  }
);
CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
