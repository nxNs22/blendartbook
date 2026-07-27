import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function addSecurityHeaders(response: NextResponse) {
  // 🛡️ SECURITY HEADERS
  
  // 1. Prevent Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // 2. Prevent MIME Sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // 3. Control Referrer Information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 4. Cross-Site Scripting Protection (Modern browsers use CSP, but this helps older ones)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // 5. Permissions Policy (Restrict browser features)
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // 6. Content Security Policy (Basic Setup)
  // Note: For a real production app, you'd want to refine this with specific domains (Supabase, Stripe, etc.)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://static.iyzipay.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://js.stripe.com https://*.iyzipay.com;
    connect-src 'self' https://*.supabase.co https://api.stripe.com https://*.iyzipay.com;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const appSurface = process.env.NEXT_PUBLIC_APP_SURFACE;
  const isPublicFile = /\.[^/]+$/.test(pathname);

  if (!isPublicFile && appSurface === "admin") {
    const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
    const isAuthPath = pathname === "/auth" || pathname.startsWith("/auth/");

    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return addSecurityHeaders(NextResponse.redirect(url));
    }

    if (!isAdminPath && !isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return addSecurityHeaders(NextResponse.redirect(url));
    }
  }

  if (!isPublicFile && appSurface === "store" && (pathname === "/admin" || pathname.startsWith("/admin/"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return addSecurityHeaders(NextResponse.redirect(url));
  }

  return addSecurityHeaders(NextResponse.next());
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
