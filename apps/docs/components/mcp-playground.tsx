'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CodeBlock } from '@slipstream-ui/ai';

type Tool = 'list_components' | 'search_components' | 'get_component_manifest' | 'validate_usage';

interface RegistryIndex {
  count: number;
  components: { id: string; name: string; package: string; tier: string; description: string }[];
}

interface ManifestProp {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

interface ManifestDetail {
  id: string;
  name: string;
  tier: string;
  package: string;
  props: ManifestProp[];
}

const TOOLS: { id: Tool; label: string; blurb: string }[] = [
  { id: 'list_components', label: 'list_components', blurb: 'Browse every component with package/tier filters.' },
  { id: 'search_components', label: 'search_components', blurb: 'Capability search over name + description.' },
  { id: 'get_component_manifest', label: 'get_component_manifest', blurb: 'Prop contract for one component.' },
  { id: 'validate_usage', label: 'validate_usage', blurb: 'Check generated props against the contract.' },
];

const DEFAULT_VALIDATE_PROPS = `{
  "onSubmitChat": "handleSubmit",
  "isLoading": false,
  "stopGeneratng": "stop"
}`;

/** Tiny Levenshtein (≤ max distance) for "did you mean" suggestions. */
function closestProp(target: string, candidates: string[]): string | undefined {
  const distance = (a: string, b: string): number => {
    const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = dp[j];
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return dp[b.length];
  };
  let best: { name: string; d: number } | undefined;
  for (const candidate of candidates) {
    const d = distance(target.toLowerCase(), candidate.toLowerCase());
    if (!best || d < best.d) best = { name: candidate, d };
  }
  return best && best.d <= 3 ? best.name : undefined;
}

/**
 * In-browser demo of the four MCP tools. It queries the SAME static
 * /registry files the MCP server reads — no server, no API key — so the
 * flow agents run (list → manifest → validate) is inspectable by humans.
 */
export function McpPlayground() {
  const [registry, setRegistry] = useState<RegistryIndex | null>(null);
  const [tool, setTool] = useState<Tool>('list_components');
  const [packageFilter, setPackageFilter] = useState<'all' | 'core' | 'ai'>('all');
  const [query, setQuery] = useState('streaming');
  const [manifestId, setManifestId] = useState('prompt-input');
  const [manifest, setManifest] = useState<ManifestDetail | null>(null);
  const [validateId, setValidateId] = useState('prompt-input');
  const [propsJson, setPropsJson] = useState(DEFAULT_VALIDATE_PROPS);
  const [error, setError] = useState<string | null>(null);
  const manifestCache = useRef(new Map<string, ManifestDetail>());

  useEffect(() => {
    fetch('/registry/all.json')
      .then((r) => r.json())
      .then((data: RegistryIndex) => {
        setRegistry(data);
        if (data.components.length > 0) {
          setManifestId(data.components.some((c) => c.id === 'prompt-input') ? 'prompt-input' : data.components[0].id);
          setValidateId(data.components.some((c) => c.id === 'prompt-input') ? 'prompt-input' : data.components[0].id);
        }
      })
      .catch(() => setError('Could not load /registry/all.json'));
  }, []);

  const loadManifest = async (id: string): Promise<ManifestDetail | null> => {
    const cached = manifestCache.current.get(id);
    if (cached) return cached;
    try {
      const res = await fetch(`/registry/${id}.json`);
      if (!res.ok) throw new Error(String(res.status));
      const raw = (await res.json()) as Record<string, unknown>;
      // Registry payload carries the manifest fields at the top level.
      const detail: ManifestDetail = {
        id: String(raw.id),
        name: String(raw.name),
        tier: String(raw.tier),
        package: String(raw.package),
        props: Array.isArray(raw.props) ? (raw.props as ManifestProp[]) : [],
      };
      manifestCache.current.set(id, detail);
      return detail;
    } catch {
      setError(`Could not load manifest for "${id}"`);
      return null;
    }
  };

  // Tool: get_component_manifest
  useEffect(() => {
    if (tool !== 'get_component_manifest') return;
    let cancelled = false;
    loadManifest(manifestId).then((m) => {
      if (!cancelled) setManifest(m);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, manifestId]);

  const listOutput = useMemo(() => {
    if (!registry) return '// loading registry…';
    const rows = registry.components.filter(
      (c) => packageFilter === 'all' || (packageFilter === 'core' ? c.package.endsWith('/core') : c.package.endsWith('/ai'))
    );
    return JSON.stringify(
      {
        count: rows.length,
        components: rows.map((c) => ({ id: c.id, name: c.name, tier: c.tier })),
      },
      null,
      2
    );
  }, [registry, packageFilter]);

  const searchOutput = useMemo(() => {
    if (!registry) return '// loading registry…';
    const q = query.trim().toLowerCase();
    const rows = q
      ? registry.components.filter(
          (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        )
      : [];
    return JSON.stringify(
      {
        query: query || '(empty — type a capability)',
        count: rows.length,
        matches: rows.map((c) => ({
          id: c.id,
          name: c.name,
          why: c.name.toLowerCase().includes(q) ? 'name' : 'description',
        })),
      },
      null,
      2
    );
  }, [registry, query]);

  const manifestOutput = useMemo(() => {
    if (!manifest) return '// loading manifest…';
    return JSON.stringify(
      {
        id: manifest.id,
        name: manifest.name,
        tier: manifest.tier,
        package: manifest.package,
        props: manifest.props.map((p) => ({
          name: p.name,
          type: p.type,
          required: p.required === true,
        })),
      },
      null,
      2
    );
  }, [manifest]);

  const [validateResult, setValidateResult] = useState<string>('// pick a component and press Validate');

  const runValidate = async () => {
    setError(null);
    const detail = await loadManifest(validateId);
    if (!detail) return;
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(propsJson) as Record<string, unknown>;
    } catch {
      setValidateResult(JSON.stringify({ ok: false, issues: [{ prop: '(payload)', problem: 'props must be valid JSON' }] }, null, 2));
      return;
    }
    const known = new Set(detail.props.map((p) => p.name));
    const knownList = detail.props.map((p) => p.name);
    const issues: { prop: string; problem: string; suggestion?: string }[] = [];

    for (const key of Object.keys(parsed)) {
      if (!known.has(key)) {
        const suggestion = closestProp(key, knownList);
        issues.push({
          prop: key,
          problem: 'unknown prop (would be hallucinated)',
          ...(suggestion ? { suggestion: `did you mean "${suggestion}"?` } : {}),
        });
      }
    }
    for (const p of detail.props) {
      if (p.required === true && !(p.name in parsed)) {
        issues.push({ prop: p.name, problem: 'missing required prop' });
      }
    }

    setValidateResult(
      JSON.stringify(
        {
          componentId: detail.id,
          ok: issues.length === 0,
          ...(issues.length ? { issues } : { note: 'props match the manifest' }),
        },
        null,
        2
      )
    );
  };

  const activeTool = TOOLS.find((t) => t.id === tool)!;
  const output =
    tool === 'list_components'
      ? listOutput
      : tool === 'search_components'
        ? searchOutput
        : tool === 'get_component_manifest'
          ? manifestOutput
          : validateResult;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Try the MCP tools — live, in your browser</p>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            same /registry manifests the server reads · {registry ? `${registry.count} components` : 'loading…'}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{activeTool.blurb}</p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border px-2 py-2" role="tablist" aria-label="MCP tools">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tool === t.id}
            onClick={() => setTool(t.id)}
            className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
              tool === t.id ? 'bg-background font-medium text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="space-y-3">
          {tool === 'list_components' && (
            <div>
              <label htmlFor="mcp-package" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                package filter
              </label>
              <select
                id="mcp-package"
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value as typeof packageFilter)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="all">all</option>
                <option value="core">@slipstream-ui/core</option>
                <option value="ai">@slipstream-ui/ai</option>
              </select>
            </div>
          )}

          {tool === 'search_components' && (
            <div>
              <label htmlFor="mcp-query" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                capability query
              </label>
              <input
                id="mcp-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="streaming, citation, approval…"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          )}

          {tool === 'get_component_manifest' && (
            <div>
              <label htmlFor="mcp-manifest-id" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                componentId
              </label>
              <select
                id="mcp-manifest-id"
                value={manifestId}
                onChange={(e) => setManifestId(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {(registry?.components ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tool === 'validate_usage' && (
            <>
              <div>
                <label htmlFor="mcp-validate-id" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  componentId
                </label>
                <select
                  id="mcp-validate-id"
                  value={validateId}
                  onChange={(e) => setValidateId(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {(registry?.components ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="mcp-props" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  generated props (JSON)
                </label>
                <textarea
                  id="mcp-props"
                  value={propsJson}
                  onChange={(e) => setPropsJson(e.target.value)}
                  rows={7}
                  spellCheck={false}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed"
                />
              </div>
              <button
                type="button"
                onClick={runValidate}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Validate props
              </button>
              <p className="text-xs text-muted-foreground">
                The default payload has two hallucinated props — watch validate_usage catch them.
              </p>
            </>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="min-w-0">
          <p className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>tool result</span>
            <span className="font-mono">GET {tool === 'validate_usage' ? 'validate_usage()' : `/registry — ${activeTool.label}`}</span>
          </p>
          <div className="max-h-80 overflow-auto rounded-lg border border-border bg-muted/40">
            <CodeBlock code={output} language="json" showCopyButton={false} className="border-0 bg-transparent shadow-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
