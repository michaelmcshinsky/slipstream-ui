'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const pages = [
  ['Introduction', '/docs'], ['Installation', '/docs/installation'], ['Theming', '/docs/theming'],
  ['COMPONENT_MANIFEST', '/docs/ai-manifests'], ['MCP Server', '/docs/mcp'],
  ['Button', '/docs/components/button'], ['Input', '/docs/components/input'], ['Badge', '/docs/components/badge'],
  ['Avatar', '/docs/components/avatar'], ['Message', '/docs/components/message'], ['Conversation', '/docs/components/conversation'],
  ['PromptInput', '/docs/components/prompt-input'], ['Reasoning', '/docs/components/reasoning'], ['ToolCall', '/docs/components/tool-call'],
  ['Sources', '/docs/components/sources'], ['Suggestions', '/docs/components/suggestions'],
];

export function Search() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => pages.filter(([title]) => title.toLowerCase().includes(query.toLowerCase())).slice(0, 6), [query]);
  return <div className="relative"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search docs…" className="w-44 rounded-md border border-border bg-background px-3 py-1.5 text-sm" aria-label="Search documentation" />{query && <div className="absolute right-0 top-10 z-10 w-64 rounded-md border border-border bg-background p-2 shadow-lg">{results.length ? results.map(([title, href]) => <Link key={href} href={href} onClick={() => setQuery('')} className="block rounded px-2 py-1.5 text-sm hover:bg-muted">{title}</Link>) : <span className="px-2 text-sm text-muted-foreground">No results</span>}</div>}</div>;
}
