import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const pathname = url.pathname;

  // 1. Identify if request is targeting the Admin Subdomain (adm.qwenton.shop / admin.*)
  const isAdmSubdomain =
    hostname.startsWith('adm.') ||
    hostname.startsWith('admin.') ||
    hostname === 'adm.qwenton.shop';

  // 2. Admin Subdomain Logic
  if (isAdmSubdomain) {
    // If browsing root of adm.qwenton.shop, rewrite directly to /admin
    if (pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }

    // Allow auth, API, and admin routes
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/signup') ||
      pathname.startsWith('/admin')
    ) {
      return NextResponse.next();
    }

    // Default rewrite other paths on adm subdomain to /admin
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  // 3. User Subdomain (agents.qwenton.shop) & Default Platform Routing
  return NextResponse.next();
}
