import { describe, expect, it, vi, afterEach } from 'vitest';
import { apiFetch, extractData, extractErrorMessage } from './envelope';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

afterEach(() => vi.restoreAllMocks());

describe('extractData / extractErrorMessage', () => {
  it('unwraps data and error envelopes', () => {
    expect(extractData({ data: { a: 1 } })).toEqual({ a: 1 });
    expect(extractData({ a: 1 })).toBeUndefined();
    expect(extractErrorMessage({ error: { code: 'x', message: 'nope' } })).toBe('nope');
    expect(extractErrorMessage({ error: 'plain' })).toBe('plain');
    expect(extractErrorMessage(null)).toBe('Something went wrong.');
  });
});

describe('apiFetch', () => {
  it('returns unwrapped data on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(200, { data: { ok: true } }));
    await expect(apiFetch<{ ok: boolean }>('/api/x')).resolves.toEqual({ ok: true });
  });

  it('throws the envelope error message on non-2xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse(400, { error: { code: 'bad', message: 'Invalid input.' } }),
    );
    await expect(apiFetch('/api/x')).rejects.toThrow('Invalid input.');
  });

  it('throws a fallback on non-JSON error bodies', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('oops', { status: 502 }));
    await expect(apiFetch('/api/x')).rejects.toThrow('Request failed (502).');
  });

  it('throws on malformed success bodies', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(200, { nope: true }));
    await expect(apiFetch('/api/x')).rejects.toThrow('Malformed API response.');
  });

  it('throws on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('fetch failed'));
    await expect(apiFetch('/api/x')).rejects.toThrow('Network error');
  });
});
