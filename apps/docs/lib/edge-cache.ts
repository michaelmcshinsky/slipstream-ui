/**
 * Edge HTML cache for anonymous public pages.
 *
 * Cloudflare Workers Free caps each invocation at 10 ms of CPU and each account
 * at 100k Worker requests/day. Rendering a Neon-backed page can exceed the CPU
 * cap (error 1102 -> HTTP 503). Repeat anonymous views are served from the
 * Workers Cache API instead, so Next, middleware, auth and the database are
 * skipped.
 *
 * This is a mitigation, not a guarantee: a cold isolate can spend the whole
 * 10 ms budget evaluating the OpenNext bundle before this code runs. Once an
 * isolate is warm, anonymous cache hits keep it inside the cap, which is the
 * sustained-traffic case that produced the 1102s.
 *
 * Invariants:
 * - Only anonymous `GET` requests for public paths are eligible.
 * - `Authorization`, session cookies, RSC/prefetch headers and `_rsc` always
 *   bypass the cache, so personalised HTML is never shared.
 * - Only `200 text/html` responses without `content-encoding` are stored.
 * - Responses that set cookies or opt out (`no-store`, `private`, `no-cache`)
 *   are never stored. `set-cookie`/`vary` are dropped from the stored copy and
 *   the live response keeps its cookies untouched.
 * - Tracking parameters are stripped and the rest sorted so the key is stable.
 * - Bump `CACHE_VERSION` after a deploy that changes rendered markup in a way
 *   the TTL would otherwise mask.
 */

export const CACHE_VERSION = "1";

/** Marks a response served from the cache. Absent means a pass-through render. */
export const CACHE_STATUS_HEADER = "x-edge-cache";

/** Query parameters that never change the rendered page. */
const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
]);

/** Headers Next sends for client-side navigation rather than a page view. */
const ROUTER_HEADERS = [
  "rsc",
  "next-router-prefetch",
  "next-router-state-tree",
  "next-router-segment-prefetch",
];

/** Paths that are never cached regardless of the per-site allowlist. */
const ALWAYS_BYPASS = ["/api", "/_next", "/keystatic", "/auth", "/embed"];

export type EdgeCacheOptions = {
  /** Namespace for the cache key, e.g. `slipstream-ui-docs`. */
  site: string;
  /** Extra path prefixes to bypass, in addition to `ALWAYS_BYPASS`. */
  bypassPrefixes: string[];
  /** Cookie names that make a render personalised, beyond session heuristics. */
  sensitiveCookies?: string[];
  /** How long a stored page stays fresh, in seconds. */
  ttlSeconds: number;
};

type CacheApi = {
  match(key: Request): Promise<Response | undefined>;
  put(key: Request, response: Response): Promise<void>;
};

type WaitUntil = { waitUntil(promise: Promise<unknown>): void };

/**
 * `caches.default` is Workers-only. Read it off `globalThis` so this module
 * typechecks under the DOM lib the Next configs use and degrades to a
 * pass-through in Node (tests, `next build`).
 */
function workerCache(): CacheApi | null {
  const storage = (globalThis as { caches?: { default?: CacheApi } }).caches;
  return storage?.default ?? null;
}

export function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    const name = part.slice(0, separator).trim();
    if (!name) continue;
    cookies[name] = part.slice(separator + 1).trim();
  }
  return cookies;
}

/**
 * Any session cookie (better-auth, NextAuth, `__Secure-` variants) makes the
 * render personalised, so the shared cache cannot be used.
 */
export function hasSessionCookie(header: string | null): boolean {
  return Object.keys(parseCookies(header)).some((name) => {
    const lower = name.toLowerCase();
    return (
      lower.includes("session") ||
      lower.includes("better-auth") ||
      lower.includes("authjs") ||
      lower.startsWith("__secure-")
    );
  });
}

export function isCacheablePath(
  pathname: string,
  options: EdgeCacheOptions,
): boolean {
  if (!pathname.startsWith("/")) return false;
  const prefixes = [...ALWAYS_BYPASS, ...options.bypassPrefixes];
  return !prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function shouldBypassRequest(
  request: Request,
  url: URL,
  options: EdgeCacheOptions,
): boolean {
  if (request.method !== "GET") return true;
  if (request.headers.get("authorization")) return true;
  if (ROUTER_HEADERS.some((name) => request.headers.get(name))) return true;
  if (url.searchParams.has("_rsc")) return true;
  if (!isCacheablePath(url.pathname, options)) return true;

  const cacheControl = request.headers.get("cache-control");
  if (cacheControl && /no-cache|no-store/i.test(cacheControl)) return true;

  const cookieHeader = request.headers.get("cookie");
  if (hasSessionCookie(cookieHeader)) return true;

  const sensitive = options.sensitiveCookies ?? [];
  if (sensitive.length > 0) {
    const cookies = parseCookies(cookieHeader);
    if (sensitive.some((name) => cookies[name] !== undefined)) return true;
  }

  return false;
}

/** Stable key for a page: tracking parameters removed, the rest sorted. */
export function cacheKeyFor(url: URL, options: EdgeCacheOptions): string {
  const params = new URLSearchParams(url.search);
  for (const name of [...params.keys()]) {
    if (TRACKING_PARAMS.has(name)) params.delete(name);
  }
  params.sort();
  const query = params.toString();
  return `https://edge-cache.invalid/${options.site}/${CACHE_VERSION}${url.pathname}${query ? `?${query}` : ""}`;
}

export function isCacheableResponse(response: Response): boolean {
  if (response.status !== 200) return false;
  const contentType = (response.headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.startsWith("text/html")) return false;
  // Encoded bodies would be re-encoded at the edge; skip rather than guess.
  if (response.headers.get("content-encoding")) return false;
  if (response.headers.get("content-disposition")) return false;
  // A response that sets a cookie may embed a token tied to that cookie.
  if (response.headers.get("set-cookie")) return false;

  const cacheControl = (response.headers.get("cache-control") ?? "").toLowerCase();
  if (/no-store|private|no-cache/.test(cacheControl)) return false;

  return true;
}

/** Build the copy handed to `cache.put`. The live response is untouched. */
function sanitizeForCache(
  response: Response,
  ttlSeconds: number,
): Response {
  const headers = new Headers(response.headers);
  for (const name of [
    "set-cookie",
    "vary",
    "content-length",
    "transfer-encoding",
    "cache-control",
  ]) {
    headers.delete(name);
  }
  headers.set(
    "cache-control",
    `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`,
  );
  headers.set(CACHE_STATUS_HEADER, "STORED");
  return new Response(response.body, { status: 200, headers });
}

/**
 * Wrap an OpenNext fetch handler with the cache.
 *
 * The live response is returned unchanged (including multiple `set-cookie`
 * headers) on a miss; only the stored copy is sanitized.
 */
export async function edgeCacheFetch(
  request: Request,
  ctx: WaitUntil,
  render: () => Promise<Response>,
  options: EdgeCacheOptions,
): Promise<Response> {
  const cache = workerCache();
  const url = new URL(request.url);

  if (!cache || shouldBypassRequest(request, url, options)) {
    return render();
  }

  const key = new Request(cacheKeyFor(url, options), { method: "GET" });
  const hit = await cache.match(key);
  if (hit) {
    const headers = new Headers(hit.headers);
    headers.set(CACHE_STATUS_HEADER, "HIT");
    return new Response(hit.body, { status: 200, headers });
  }

  const response = await render();
  if (!isCacheableResponse(response)) return response;

  const stored = sanitizeForCache(response.clone(), options.ttlSeconds);
  ctx.waitUntil(cache.put(key, stored).catch(() => undefined));
  return response;
}
