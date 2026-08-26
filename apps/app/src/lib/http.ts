import { NextResponse } from 'next/server';
import { HttpError } from './session';
import { TeamError } from './teams';

/** Wrap a route handler: maps typed errors to status codes, unexpected to 500. */
export async function handle<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const result = await fn();
    return NextResponse.json(result ?? { ok: true });
  } catch (error) {
    if (error instanceof HttpError || error instanceof TeamError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[api] unhandled', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export function badRequest(message: string): never {
  throw new HttpError(400, message);
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    return badRequest('Invalid JSON body.');
  }
}
