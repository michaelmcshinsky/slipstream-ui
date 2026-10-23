import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const errors = {
  badRequest: (message = 'Invalid request.', details?: unknown) => new ApiError(400, 'bad_request', message, details),
  unauthorized: (message = 'Authentication required.') => new ApiError(401, 'unauthorized', message),
  forbidden: (message = 'Insufficient permissions.') => new ApiError(403, 'forbidden', message),
  notFound: (message = 'Not found.') => new ApiError(404, 'not_found', message),
  conflict: (message = 'Conflict.') => new ApiError(409, 'conflict', message),
  rateLimited: (retryAfterSeconds: number) =>
    new ApiError(429, 'rate_limited', 'Too many requests.', { retryAfterSeconds }),
};

// ---------------------------------------------------------------------------
// Envelope
// ---------------------------------------------------------------------------

export interface RequestMeta {
  requestId: string;
  [key: string]: unknown;
}

function baseHeaders(requestId?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  };
  if (requestId) headers['X-Request-Id'] = requestId;
  return headers;
}

/** Success envelope: { data, meta? }. */
export function json<T>(data: T, options: { request: Request; meta?: Record<string, unknown> | object; status?: number; cacheSeconds?: number }) {
  const requestId = getRequestId(options.request);
  const headers = baseHeaders(requestId);
  if (options.cacheSeconds) {
    headers['Cache-Control'] = `private, max-age=${options.cacheSeconds}`;
  }

  const body: Record<string, unknown> = { data };
  const meta: Record<string, unknown> = { requestId, ...options.meta };
  body.meta = meta;

  return NextResponse.json(body, { status: options.status ?? 200, headers });
}

/** Error envelope: { error: { code, message, details? }, meta }. */
export function errorJson(error: ApiError, request: Request) {
  const requestId = getRequestId(request);
  const headers = baseHeaders(requestId);
  if (error.status === 429 && typeof (error.details as { retryAfterSeconds?: number })?.retryAfterSeconds === 'number') {
    headers['Retry-After'] = String((error.details as { retryAfterSeconds: number }).retryAfterSeconds);
  }
  return NextResponse.json(
    {
      error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) },
      meta: { requestId },
    },
    { status: error.status, headers }
  );
}

/**
 * Weak ETag revalidation: returns a 304 response when the client is current.
 * Hashes the serialized body text — not the response object/stream, which
 * would hash identically for every payload (KC-016).
 */
export async function withEtag(request: Request, response: NextResponse): Promise<NextResponse> {
  const bodyText = await response.clone().text();
  const etag = `W/"${createHash('sha1').update(bodyText).digest('base64url')}"`;
  response.headers.set('ETag', etag);
  if (request.headers.get('if-none-match') === etag) {
    const notModified = new NextResponse(null, { status: 304 });
    notModified.headers.set('ETag', etag);
    return notModified;
  }
  return response;
}

/** Re-exported so v1 routes can import everything from one module. */
export { handle } from './handle';
export { getPrincipal, requirePrincipal, requireAdminPrincipal } from './auth';

const REQUEST_ID_HEADER = 'x-request-id';

export function getRequestId(request: Request): string {
  const incoming = request.headers.get(REQUEST_ID_HEADER);
  if (incoming) return incoming;
  const generated = crypto.randomUUID();
  // Not settable on the immutable Request; handlers echo it via responses.
  void generated;
  return generated;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Parse and validate a JSON body against a zod schema. */
export async function parseBody<T>(request: Request, schema: z.ZodType<T, z.ZodTypeDef, unknown>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw errors.badRequest('Request body must be valid JSON.');
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw errors.badRequest(
      'Validation failed.',
      parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
    );
  }
  return parsed.data;
}

/** Parse and validate query params against a zod schema of strings/numbers. */
export function parseQuery<T>(request: Request, schema: z.ZodType<T, z.ZodTypeDef, unknown>): T {
  const raw = Object.fromEntries(new URL(request.url).searchParams.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw errors.badRequest(
      'Invalid query parameters.',
      parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
    );
  }
  return parsed.data;
}

/** Shared cursor-pagination query schema + prisma mapping. */
export function paginationSchema(defaultLimit = 25, maxLimit = 100) {
  return z.object({
    limit: z.coerce.number().int().min(1).max(maxLimit).default(defaultLimit),
    cursor: z.string().optional(),
  });
}

export interface PaginatedMeta {
  limit: number;
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Applies cursor pagination to any prisma findMany argument list and builds
 * the response meta. Cursors are opaque (base64 of the sort field value).
 *
 * `cursorOf` overrides which field the cursor encodes — needed when the
 * public item id differs from the query's sort key (KC-015 teams: display
 * ids are team ids, but the query paginates membership rows).
 */
export function paginate<T extends { id: string }>(
  rows: T[],
  limit: number,
  options: { cursorOf?: (row: T) => string } = {}
): { items: T[]; meta: PaginatedMeta } {
  const cursorOf = options.cursorOf ?? ((row: T) => row.id);
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items.at(-1);
  return {
    items,
    meta: {
      limit,
      hasMore,
      ...(hasMore && last ? { nextCursor: Buffer.from(cursorOf(last)).toString('base64url') } : {}),
    },
  };
}

export function decodeCursor(cursor?: string): string | undefined {
  if (!cursor) return undefined;
  const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
  // Strict round-trip: base64url decoding is lenient, so verify fidelity.
  if (Buffer.from(decoded).toString('base64url') !== cursor) {
    throw errors.badRequest('Invalid cursor.');
  }
  return decoded;
}

// ---------------------------------------------------------------------------
// Rate limiting (per-identity sliding window)
// ---------------------------------------------------------------------------

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

/** Prune expired buckets periodically to bound memory in long-lived processes. */
let lastPrune = Date.now();
function prune(now: number, windowMs: number) {
  if (now - lastPrune < windowMs) return;
  lastPrune = now;
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((ts) => ts > now - windowMs);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

export interface RateLimitOptions {
  /** Unique bucket key, usually `${identity}:${routeName}` or an IP. */
  key: string;
  /** Max requests inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * In-memory sliding-window limiter — zero-dependency and correct for a single
 * process. For multi-instance deployments swap the map for Redis; the call
 * signature stays identical.
 */
export function rateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  prune(now, options.windowMs);

  const bucket = buckets.get(options.key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > now - options.windowMs);

  if (bucket.timestamps.length >= options.limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000));
    buckets.set(options.key, bucket);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  buckets.set(options.key, bucket);
  return {
    allowed: true,
    remaining: options.limit - bucket.timestamps.length,
    retryAfterSeconds: 0,
  };
}
