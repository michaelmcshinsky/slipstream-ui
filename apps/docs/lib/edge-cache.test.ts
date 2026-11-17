import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CACHE_STATUS_HEADER,
  cacheKeyFor,
  edgeCacheFetch,
  isCacheableResponse,
  shouldBypassRequest,
  type EdgeCacheOptions,
} from './edge-cache';

const OPTIONS: EdgeCacheOptions = {
  site: 'test-docs',
  bypassPrefixes: [],
  sensitiveCookies: ['slipstream-locale'],
  allowPrivateResponses: true,
  ttlSeconds: 60,
};

const PRIVATE_HTML = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'private, no-cache, no-store, max-age=0, must-revalidate',
  vary: 'rsc, next-router-state-tree',
};

function request(path: string, init?: RequestInit): Request {
  return new Request(`https://slipstreamui.com${path}`, init);
}

function cacheOptions(options: Partial<EdgeCacheOptions> = {}): EdgeCacheOptions {
  return { ...OPTIONS, ...options };
}

/** In-memory stand-in for `caches.default`, keyed by request URL. */
function installCache() {
  const store = new Map<string, Response>();
  const cache = {
    match: vi.fn(async (key: Request) => store.get(key.url)?.clone()),
    put: vi.fn(async (key: Request, response: Response) => {
      store.set(key.url, response.clone());
    }),
  };
  (globalThis as { caches?: unknown }).caches = { default: cache };
  return { store, cache };
}

function context() {
  const pending: Promise<unknown>[] = [];
  return {
    ctx: { waitUntil: (promise: Promise<unknown>) => pending.push(promise) },
    settle: () => Promise.all(pending),
  };
}

afterEach(() => {
  delete (globalThis as { caches?: unknown }).caches;
});

describe('shouldBypassRequest', () => {
  it('allows an anonymous GET for a public page', () => {
    const url = new URL('https://slipstreamui.com/docs/components/button');
    expect(shouldBypassRequest(request(url.pathname), url, OPTIONS)).toBe(false);
  });

  it('bypasses the locale cookie, session cookies, RSC and authorised requests', () => {
    const cases: Array<[string, Request, URL]> = [
      [
        'locale cookie',
        request('/docs', { headers: { cookie: 'slipstream-locale=de' } }),
        new URL('https://slipstreamui.com/docs'),
      ],
      [
        'session cookie',
        request('/docs', { headers: { cookie: 'better-auth.session_token=abc' } }),
        new URL('https://slipstreamui.com/docs'),
      ],
      [
        'authorization',
        request('/docs', { headers: { authorization: 'Bearer abc' } }),
        new URL('https://slipstreamui.com/docs'),
      ],
      [
        'router header',
        request('/docs', { headers: { rsc: '1' } }),
        new URL('https://slipstreamui.com/docs'),
      ],
      ['_rsc parameter', request('/docs?_rsc=abc'), new URL('https://slipstreamui.com/docs?_rsc=abc')],
      ['non-GET', request('/docs', { method: 'POST' }), new URL('https://slipstreamui.com/docs')],
      ['api prefix', request('/api/search'), new URL('https://slipstreamui.com/api/search')],
    ];

    for (const [name, req, url] of cases) {
      expect(shouldBypassRequest(req, url, OPTIONS), name).toBe(true);
    }
  });
});

describe('isCacheableResponse', () => {
  it('rejects the framework opt-out by default', () => {
    const response = new Response('<html></html>', { headers: PRIVATE_HTML });
    expect(isCacheableResponse(response)).toBe(false);
  });

  it('accepts the framework opt-out when the request is already anonymous', () => {
    const response = new Response('<html></html>', { headers: PRIVATE_HTML });
    expect(isCacheableResponse(response, { allowPrivate: true })).toBe(true);
  });

  it.each([
    ['a non-200 status', new Response('bad', { status: 500, headers: PRIVATE_HTML })],
    ['a non-HTML body', new Response('{}', { headers: { ...PRIVATE_HTML, 'content-type': 'application/json' } })],
    [
      'a set-cookie header',
      new Response('<html></html>', {
        headers: { ...PRIVATE_HTML, 'set-cookie': 'slipstream-locale=de' },
      }),
    ],
    [
      'an encoded body',
      new Response('<html></html>', {
        headers: { ...PRIVATE_HTML, 'content-encoding': 'br' },
      }),
    ],
  ])('still rejects %s with allowPrivate', (_name, response) => {
    expect(isCacheableResponse(response, { allowPrivate: true })).toBe(false);
  });
});

describe('cacheKeyFor', () => {
  it('strips tracking parameters and sorts the rest', () => {
    const key = cacheKeyFor(
      new URL('https://slipstreamui.com/docs?b=2&utm_source=x&a=1&fbclid=y'),
      OPTIONS,
    );
    expect(key).toBe('https://edge-cache.invalid/test-docs/1/docs?a=1&b=2');
  });
});

describe('edgeCacheFetch', () => {
  it('stores an anonymous private response and serves the next request from the cache', async () => {
    const { store, cache } = installCache();
    const { ctx, settle } = context();
    const render = vi.fn(async () => new Response('<html>docs</html>', { headers: PRIVATE_HTML }));

    const first = await edgeCacheFetch(request('/docs'), ctx, render, OPTIONS);
    expect(await first.text()).toBe('<html>docs</html>');
    expect(first.headers.get(CACHE_STATUS_HEADER)).toBeNull();

    await settle();
    expect(cache.put).toHaveBeenCalledTimes(1);
    const stored = store.get('https://edge-cache.invalid/test-docs/1/docs');
    expect(stored?.headers.get('cache-control')).toContain('public');
    expect(stored?.headers.get('vary')).toBeNull();

    const second = await edgeCacheFetch(request('/docs'), ctx, render, OPTIONS);
    expect(second.headers.get(CACHE_STATUS_HEADER)).toBe('HIT');
    expect(await second.text()).toBe('<html>docs</html>');
    expect(render).toHaveBeenCalledTimes(1);
  });

  it('never serves a cached page to a request carrying the locale cookie', async () => {
    const { cache } = installCache();
    const { ctx, settle } = context();
    const render = vi.fn(async () => new Response('<html>docs</html>', { headers: PRIVATE_HTML }));

    await edgeCacheFetch(request('/docs'), ctx, render, OPTIONS);
    await settle();

    const localised = await edgeCacheFetch(
      request('/docs', { headers: { cookie: 'slipstream-locale=de' } }),
      ctx,
      render,
      OPTIONS,
    );

    expect(localised.headers.get(CACHE_STATUS_HEADER)).toBeNull();
    expect(render).toHaveBeenCalledTimes(2);
    expect(cache.match).toHaveBeenCalledTimes(1);
  });

  it('does not store when allowPrivateResponses is off', async () => {
    const { cache } = installCache();
    const { ctx, settle } = context();
    const render = vi.fn(async () => new Response('<html>docs</html>', { headers: PRIVATE_HTML }));

    await edgeCacheFetch(
      request('/docs'),
      ctx,
      render,
      cacheOptions({ allowPrivateResponses: false }),
    );
    await settle();

    expect(cache.put).not.toHaveBeenCalled();
  });

  it('does not store a response that sets a cookie', async () => {
    const { cache } = installCache();
    const { ctx, settle } = context();
    const render = vi.fn(
      async () =>
        new Response('<html>docs</html>', {
          headers: { ...PRIVATE_HTML, 'set-cookie': 'slipstream-locale=de' },
        }),
    );

    await edgeCacheFetch(request('/docs'), ctx, render, OPTIONS);
    await settle();

    expect(cache.put).not.toHaveBeenCalled();
  });

  it('passes through when the Cache API is unavailable', async () => {
    const { ctx } = context();
    const render = vi.fn(async () => new Response('<html>docs</html>', { headers: PRIVATE_HTML }));

    const response = await edgeCacheFetch(request('/docs'), ctx, render, OPTIONS);

    expect(await response.text()).toBe('<html>docs</html>');
    expect(render).toHaveBeenCalledTimes(1);
  });
});
