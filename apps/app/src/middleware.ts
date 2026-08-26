import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge guard: only checks cookie presence (DB session validation happens in
 * each server route/page via getSessionUser). Admin routes additionally
 * require the ADMIN role there; this keeps the edge bundle free of Prisma.
 */
export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get('slipstream_session')?.value);
  if (!hasSession) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
