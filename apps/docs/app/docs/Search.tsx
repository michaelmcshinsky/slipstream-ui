'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Document as FlexsearchDocument } from 'flexsearch';

interface DocEntry {
  title: string;
  href: string;
  /** Keywords/content used for full-text matching. */
  content: string;
}

const DOCS: DocEntry[] = [
  { title: 'Introduction', href: '/docs', content: 'what makes slipstream different component manifest AI-first agents' },
  { title: 'Installation', href: '/docs/installation', content: 'install setup npx init pnpm add core ai quick start' },
  { title: 'Theming', href: '/docs/theming', content: 'css variables createTheme presets dark mode violet zinc colors radius' },
  { title: 'COMPONENT_MANIFEST', href: '/docs/ai-manifests', content: 'manifest schema props anti-patterns accessibility composition rules json spec' },
  { title: 'CLI', href: '/docs/cli', content: 'slipstream-ui init add list command terminal' },
  { title: 'Patterns', href: '/docs/patterns', content: 'recipes chat interface agent activity composed examples' },
  { title: 'Templates', href: '/docs/templates', content: 'examples streaming chat agent dashboard rag citations copy-paste' },
  { title: 'MCP Server', href: '/docs/mcp', content: 'model context protocol claude cursor tools list_components get_manifest' },
  { title: 'Button', href: '/docs/components/button', content: 'variants destructive outline ghost link sizes asChild click' },
  { title: 'Input', href: '/docs/components/input', content: 'text field form email password disabled' },
  { title: 'Badge', href: '/docs/components/badge', content: 'status pill tag count secondary outline' },
  { title: 'Avatar', href: '/docs/components/avatar', content: 'profile image fallback user picture' },
  { title: 'Spinner', href: '/docs/components/spinner', content: 'loading indicator role status accessible sizes' },
  { title: 'Message', href: '/docs/components/message', content: 'chat bubble role user assistant system avatar timestamp streaming renderContent labels' },
  { title: 'Response', href: '/docs/components/response', content: 'markdown renderer streaming gfm incomplete repair code blocks' },
  { title: 'CodeBlock', href: '/docs/components/code-block', content: 'syntax highlighting prism copy button language label' },
  { title: 'Conversation', href: '/docs/components/conversation', content: 'message list auto-scroll scroll to bottom download transcript loading state streamingMessageId' },
  { title: 'PromptInput', href: '/docs/components/prompt-input', content: 'textarea enter send shift newline stop generation attachments tray auto-resize maxLength' },
  { title: 'Reasoning', href: '/docs/components/reasoning', content: 'thinking steps chain of thought collapsible expand aria-controls' },
  { title: 'ToolCall', href: '/docs/components/tool-call', content: 'function call arguments result status pending running completed failed error' },
  { title: 'Confirmation', href: '/docs/components/confirmation', content: 'approval gate human in the loop approve reject alertdialog destructive tool' },
  { title: 'Sources', href: '/docs/components/sources', content: 'citations references footer numbered links snippets grounding' },
  { title: 'InlineCitation', href: '/docs/components/inline-citation', content: 'perplexity style hover chip tooltip superscript inline source claim' },
  { title: 'Suggestions', href: '/docs/components/suggestions', content: 'follow-up prompts clickable quick actions onSelect' },
  { title: 'ChainThought', href: '/docs/components/chain-thought', content: 'task timeline status dots pending completed failed agent progress' },
  { title: 'StreamingIndicator', href: '/docs/components/streaming-indicator', content: 'generating dots pulse animation isStreaming text' },
  { title: 'Attachment', href: '/docs/components/attachment', content: 'file chips upload remove preview thumbnail size type AttachmentList prompt' },
  { title: 'Branch', href: '/docs/components/branch', content: 'variants navigation previous next regenerate alternatives position' },
];

const DOCS_BY_HREF = new Map(DOCS.map((doc) => [doc.href, doc]));

export function Search() {
  const [query, setQuery] = useState('');
  const [indexReady, setIndexReady] = useState(false);
  const indexRef = useRef<FlexsearchDocument | null>(null);

  // Flexsearch is client-only; build the index lazily on first mount.
  useEffect(() => {
    if (indexRef.current) return;
    import('flexsearch').then((mod) => { const { Document } = mod as { Document: typeof FlexsearchDocument };
      const index = new Document({
        document: {
          id: 'href',
          index: ['title', 'content'],
        },
        tokenize: 'forward',
      });
      for (const doc of DOCS) index.add(doc as never);
      indexRef.current = index;
      setIndexReady(true);
    });
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const trimmed = query.trim();
    const lower = trimmed.toLowerCase();

    // Instant fallback while flexsearch loads or for exact substring hits.
    const localMatches = DOCS.filter(
      (doc) =>
        doc.title.toLowerCase().includes(lower) ||
        doc.content.toLowerCase().includes(lower)
    );

    const index = indexRef.current;
    if (!index || !indexReady) return localMatches.slice(0, 6);

    try {
      // Non-enriched search returns document ids (our href strings).
      const ids = index.search(trimmed, 6) as unknown as string[];
      if (!Array.isArray(ids) || ids.length === 0) {
        return localMatches.slice(0, 6);
      }
      return ids
        .map((href) => DOCS_BY_HREF.get(String(href)))
        .filter((doc): doc is DocEntry => Boolean(doc));
    } catch {
      return localMatches.slice(0, 6);
    }
  }, [query, indexReady]);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search docs…"
        className="w-44 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        aria-label="Search documentation"
        role="combobox"
        aria-expanded={query.length > 0}
        aria-controls="search-results"
      />
      {query && (
        <div
          id="search-results"
          className="absolute right-0 top-10 z-10 w-72 rounded-md border border-border bg-background p-2 shadow-lg"
        >
          {results.length ? (
            results.map((result) => (
              <Link
                key={result.href}
                href={result.href}
                onClick={() => setQuery('')}
                className="block rounded px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span className="font-medium">{result.title}</span>
                <span className="ml-2 text-xs text-muted-foreground line-clamp-1">
                  {result.content}
                </span>
              </Link>
            ))
          ) : (
            <span className="px-2 text-sm text-muted-foreground">No results</span>
          )}
        </div>
      )}
    </div>
  );
}
