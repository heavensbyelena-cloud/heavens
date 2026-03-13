/**
 * Middleware — Protection du site complet (Coming Soon).
 * Seuls les admins connectés peuvent accéder à /shop, /admin, /account, etc.
 * Si non connecté ou non admin → redirection vers / (Coming Soon).
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/jwt';

/** Routes protégées : accès réservé aux admins */
const PROTECTED_PREFIXES = [
  '/shop',
  '/home',
  '/admin',
  '/account',
  '/cart',
  '/checkout',
  '/product',
  '/orders',
  '/legal',
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME);
  const token = sessionCookie?.value ?? null;

  let payload: Awaited<ReturnType<typeof verifySessionToken>> = null;
  if (token) {
    try {
      payload = await verifySessionToken(token);
    } catch {
      // JWT invalide ou expiré
    }
  }

  if (!token || !payload) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/shop/:path*',
    '/home/:path*',
    '/admin/:path*',
    '/account/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/product/:path*',
    '/orders/:path*',
    '/legal/:path*',
  ],
};
