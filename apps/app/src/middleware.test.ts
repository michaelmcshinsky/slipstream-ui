import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

async function loadMiddleware() {
  vi.resetModules();
  return import('./middleware');
}

function apiRequest(origin?: string) {
  return new NextRequest('http://localhost/api/probe', {
    headers: origin ? { origin } : {},
  });
}

describe('api CORS headers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('emits no Access-Control-Allow-Origin by default', async () => {
    const previous = process.env.API_ALLOWED_ORIGINS;
    delete process.env.API_ALLOWED_ORIGINS;
    try {
      const { middleware } = await loadMiddleware();
      const response = middleware(apiRequest('https://untrusted.example'));
      expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
      expect(response.headers.get('Vary')).toBe('Origin');
    } finally {
      if (previous !== undefined) process.env.API_ALLOWED_ORIGINS = previous;
    }
  });

  it('echoes only allowlisted origins', async () => {
    vi.stubEnv('API_ALLOWED_ORIGINS', 'https://app.example.com, https://admin.example.com');
    const { middleware } = await loadMiddleware();

    const allowed = middleware(apiRequest('https://app.example.com'));
    expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe('https://app.example.com');

    const denied = middleware(apiRequest('https://evil.example'));
    expect(denied.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
});
