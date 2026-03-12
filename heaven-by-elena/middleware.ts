/**
 * Middleware Next.js — Protection /admin et routes compte via cookie JWT.
 * Logs de debug pour vérifier lecture et décodage du cookie heaven_session.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ——— 1) Log de tous les cookies reçus ———
  const allCookies = request.cookies.getAll();
  console.log('[middleware] pathname:', pathname);
  console.log('[middleware] Tous les cookies reçus:', allCookies.map(c => ({ name: c.name, valueLength: c.value?.length ?? 0 })));

  // ——— 2) Extraction du cookie heaven_session ———
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  const token = sessionCookie?.value ?? null;
  console.log('[middleware] Cookie "heaven_session" présent:', !!sessionCookie, '| value length:', token?.length ?? 0);
  if (token) {
    console.log('[middleware] heaven_session (début):', token.slice(0, 30) + '...');
  }

  // ——— 3) Décodage / vérification du JWT ———
  let payload: Awaited<ReturnType<typeof verifySessionToken>> = null;
  if (token) {
    try {
      payload = await verifySessionToken(token);
      console.log('[middleware] JWT décodé avec succès:', payload ? { sub: payload.sub, email: payload.email, role: payload.role } : 'null');
    } catch (e) {
      console.log('[middleware] JWT verifySessionToken erreur:', e);
    }
  } else {
    console.log('[middleware] Pas de token, skip jwtVerify');
  }

  // Routes à protéger (admin + pages compte protégées)
  const isAdminRoute = pathname.startsWith('/admin');
  const isProtectedAccount = pathname === '/account/dashboard' || pathname === '/account/profile';

  if (!isAdminRoute && !isProtectedAccount) {
    return NextResponse.next();
  }

  // ——— 4) Ordre des vérifications : cookie présent → JWT valide → rôle si /admin ———
  if (!token) {
    console.log('[middleware] Redirection: pas de cookie');
    if (isAdminRoute) {
      return NextResponse.redirect(new URL(`/api/auth/sync-session?then=${encodeURIComponent(pathname)}`, request.url));
    }
    return NextResponse.redirect(new URL('/account/login', request.url));
  }

  if (!payload) {
    console.log('[middleware] Redirection: JWT invalide ou expiré');
    if (isAdminRoute) {
      return NextResponse.redirect(new URL(`/api/auth/sync-session?then=${encodeURIComponent(pathname)}`, request.url));
    }
    return NextResponse.redirect(new URL('/account/login', request.url));
  }

  if (isAdminRoute && payload.role !== 'admin') {
    console.log('[middleware] Redirection: rôle non admin');
    return NextResponse.redirect(new URL('/shop?admin_required=1', request.url));
  }

  console.log('[middleware] Accès autorisé, next()');
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/dashboard', '/account/profile'],
};
