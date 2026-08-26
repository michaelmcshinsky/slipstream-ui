import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_API_ORIGINS = (process.env.API_ALLOWED_ORIGINS ?? '*').split(',');

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-API-Key,X-Request-Id',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  // '*' allowed for public read-style endpoints; echo specific origin otherwise.
  if (ALLOWED_API_ORIGINS.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (origin && ALLOWED_API_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

/**
 * Edge middleware:
 * - Session-presence guard for dashboard/admin redirects (DB role checks stay
 *   in route handlers — the edge bundle never imports Prisma).
 * - Security headers on every response.
 * - CORS preflight + origin allow-listing for /api/*.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const hasSession = Boolean(request.cookies.get('slipstream_session')?.value);
    if (!hasSession) {
      const url = new URL('/login', request.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
    }
    const response = NextResponse.next();
    for (const [key, value] of Object.entries(corsHeaders(request.headers.get('origin')))) {
      response.headers.set(key, value);
    }
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*'],
};
