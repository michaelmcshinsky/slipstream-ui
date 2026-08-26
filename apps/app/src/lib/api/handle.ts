import { NextResponse } from 'next/server';
import { ApiError, errors, errorJson, getRequestId, rateLimit } from './core';
import type { TeamError } from '../teams';

export interface HandleOptions {
  /** Per-identity request budget. Defaults: 120 req / 60s. */
  rateLimit?: { limit: number; windowMs: number };
  /**
   * Route name used in the rate-limit bucket key. Defaults to the pathname.
   * Pass a stable short name for hot routes.
   */
  routeName?: string;
  /** Disable auth-based bucketing for public endpoints (falls back to IP). */
  public?: boolean;
}

function identityFrom(request: Request): string {
  // Prefer forwarded client IP (edge/proxy), then direct address.
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'local';
}

/**
 * Single entry point for every API route:
 * - request-id propagation (honors inbound X-Request-Id)
 * - per-identity sliding-window rate limiting
 * - typed error mapping to the standard envelope
 *
 * Usage: `export async function GET(request: Request) {
 *   return handle(request, async () => ({ ... }));
 * }`
 */
export async function handle(
  request: Request,
  fn: () => Promise<unknown>,
  options: HandleOptions = {}
): Promise<Response> {
  const requestId = getRequestId(request);
  const routeName = options.routeName ?? new URL(request.url).pathname;

  try {
    const identity = identityFrom(request);
    const limit = rateLimit({
      key: `${identity}:${routeName}`,
      limit: options.rateLimit?.limit ?? 120,
      windowMs: options.rateLimit?.windowMs ?? 60_000,
    });
    if (!limit.allowed) {
      return errorJson(errors.rateLimited(limit.retryAfterSeconds), request);
    }

    const result = await fn();
    if (result instanceof NextResponse || result instanceof Response) {
      result.headers.set('X-Request-Id', requestId);
      return result;
    }
    return NextResponse.json({ data: result ?? { ok: true }, meta: { requestId } }, {
      headers: { 'X-Request-Id': requestId },
    });
  } catch (error) {
    let apiError: ApiError;
    if (error instanceof ApiError) {
      apiError = error;
    } else if (error instanceof Error && 'status' in error && typeof (error as TeamError).status === 'number') {
      // Legacy typed errors from lib/teams.
      const teamError = error as TeamError;
      apiError = new ApiError(teamError.status, mapLegacyStatus(teamError.status), teamError.message);
    } else {
      console.error('[api] unhandled', requestId, routeName, error);
      apiError = new ApiError(500, 'internal_error', 'Internal server error.');
    }
    return errorJson(apiError, request);
  }
}

function mapLegacyStatus(status: number): string {
  switch (status) {
    case 400: return 'bad_request';
    case 401: return 'unauthorized';
    case 403: return 'forbidden';
    case 404: return 'not_found';
    case 409: return 'conflict';
    default: return 'error';
  }
}

// ---------------------------------------------------------------------------
// Back-compat helpers used by internal routes
// ---------------------------------------------------------------------------

import { z } from 'zod';

/** Parse JSON body without a schema (legacy helper); prefer parseBody. */
export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw errors.badRequest('Invalid JSON body.');
  }
}

/** Throw a standard 400. */
export function badRequest(message: string): never {
  throw errors.badRequest(message);
}

export { z };
