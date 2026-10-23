/**
 * Helpers for reading the standard API envelope produced by handle():
 * success `{ data, meta }`, errors `{ error: { code, message, details }, meta }`.
 * UI consumers must unwrap these instead of reading top-level properties
 * (KC-006 / KC-017–020).
 */

export function extractData<T>(body: unknown): T | undefined {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: T }).data;
  }
  return undefined;
}

export function extractErrorMessage(body: unknown, fallback = 'Something went wrong.'): string {
  if (!body || typeof body !== 'object' || !('error' in body)) return fallback;
  const error = (body as { error: unknown }).error;
  if (typeof error === 'string' && error) return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}
