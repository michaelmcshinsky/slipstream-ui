'use client';

import * as React from 'react';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import { cn } from '@slipstream-ui/core';

export type CodeBlockProps = {
  /** Raw code to display (no trailing newline needed). */
  code: string;
  /** Language identifier used for Prism highlighting. */
  language?: string;
  /** Show a copy-to-clipboard button (default true). */
  showCopyButton?: boolean;
  className?: string;
};

/** Tracks whether the `.dark` class is present on `<html>`, staying in sync with toggles. */
function useIsDark(): boolean {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const el = document.documentElement;
    setDark(el.classList.contains('dark'));
    const observer = new MutationObserver(() => setDark(el.classList.contains('dark')));
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

/**
 * AA-safe syntax palettes.
 *
 * prism-react-renderer's stock themes put comments (#999988) and constants
 * (#36acaa) at ~2.7-2.9:1 on the code surface. Every colour below clears
 * 4.5:1 against its background (white light / near-black dark).
 */
const LIGHT_CODE_THEME: PrismTheme = {
  plain: { color: '#1f2328', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#57606a' } },
    { types: ['punctuation', 'operator'], style: { color: '#24292f' } },
    { types: ['namespace'], style: { color: '#6f42c1' } },
    { types: ['tag', 'deleted', 'keyword', 'atrule', 'important'], style: { color: '#b31d28' } },
    { types: ['attr-name', 'variable'], style: { color: '#953800' } },
    { types: ['string', 'char', 'attr-value', 'inserted', 'regex'], style: { color: '#0a5c2f' } },
    {
      types: [
        'function',
        'class-name',
        'number',
        'boolean',
        'constant',
        'symbol',
        'property',
        'selector',
        'builtin',
        'entity',
        'url',
      ],
      style: { color: '#0550ae' },
    },
  ],
};

const DARK_CODE_THEME: PrismTheme = {
  plain: { color: '#e6edf3', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#8b949e' } },
    { types: ['punctuation', 'operator'], style: { color: '#c9d1d9' } },
    { types: ['namespace'], style: { color: '#d2a8ff' } },
    { types: ['tag', 'deleted', 'keyword', 'atrule', 'important'], style: { color: '#ff7b72' } },
    { types: ['attr-name', 'variable'], style: { color: '#ffa657' } },
    { types: ['string', 'char', 'attr-value', 'inserted', 'regex'], style: { color: '#7ee787' } },
    {
      types: [
        'function',
        'class-name',
        'number',
        'boolean',
        'constant',
        'symbol',
        'property',
        'selector',
        'builtin',
        'entity',
        'url',
      ],
      style: { color: '#79c0ff' },
    },
  ],
};

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ code, language = 'tsx', showCopyButton = true, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const isDark = useIsDark();
    const trimmedCode = code.replace(/\n$/, '');

    // Horizontally scrollable code must be reachable by keyboard (WCAG 2.1.1).
    // Only make it a tab stop when it actually overflows, so short snippets
    // do not add noise to the tab order.
    const preRef = React.useRef<HTMLPreElement>(null);
    const [scrollable, setScrollable] = React.useState(false);
    React.useEffect(() => {
      const element = preRef.current;
      if (!element) return;
      const update = () => setScrollable(element.scrollWidth > element.clientWidth + 1);
      update();
      // jsdom (tests) has no ResizeObserver; window resize is the fallback.
      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
      }
      const observer = new ResizeObserver(update);
      observer.observe(element);
      return () => observer.disconnect();
    }, [trimmedCode, language]);

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
          // bg-background (not muted): the light syntax palette is tuned for
          // a white surface; on gray the token contrast drops below AA.
          'relative group rounded-md border border-border bg-background overflow-hidden',
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
        <Highlight theme={isDark ? DARK_CODE_THEME : LIGHT_CODE_THEME} code={trimmedCode} language={language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              ref={preRef}
              tabIndex={scrollable ? 0 : undefined}
              aria-label={scrollable ? `${language} code, scrollable` : undefined}
              className="overflow-x-auto p-4 text-xs leading-relaxed m-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
