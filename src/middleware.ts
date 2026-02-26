import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session cookie
  const sessionCookie = request.cookies.get('admin_session');
  const hasSession = !!sessionCookie?.value;

  let response = NextResponse.next();

  // Add no-cache headers for /berita routes
  if (pathname.startsWith('/berita')) {
    response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

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

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
