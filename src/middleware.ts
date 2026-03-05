import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old WordPress URLs with /index.php
  // e.g. /index.php/berita/berita-terkini/slug -> /berita/slug
  if (pathname.startsWith('/index.php')) {
    const strippedPath = pathname.replace('/index.php', '') || '/';

    // Map old WordPress category paths to new Next.js routes
    // /berita/berita-terkini/slug -> /berita/slug
    // /berita/anything/slug -> /berita/slug
    const beritaMatch = strippedPath.match(/^\/berita\/[^/]+\/(.+)$/);
    const url = request.nextUrl.clone();

    if (beritaMatch) {
      url.pathname = `/berita/${beritaMatch[1]}`;
    } else {
      url.pathname = strippedPath;
    }

    return NextResponse.redirect(url, 301);
  }

  // Get session cookie
  const sessionCookie = request.cookies.get('admin_session');
  const hasSession = !!sessionCookie?.value;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!hasSession) {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect to admin if already logged in and trying to access login
  if (pathname === '/login') {
    if (hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
