/**
 * Vérification JWT pour les routes API (admin).
 * Lit le cookie de session et vérifie role === 'admin'.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from './jwt';
import type { SessionPayload } from './jwt';

/**
 * Récupère la session depuis le JWT (cookie) sur la requête.
 * Retourne null si cookie absent ou JWT invalide.
 */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Vérifie que la requête est faite par un admin (JWT valide + role = 'admin').
 * Retourne la session si ok, sinon retourne une NextResponse 401/403 à renvoyer.
 */
export async function requireAdminApi(
  request: NextRequest
): Promise<{ session: SessionPayload } | NextResponse> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }
  return { session };
}
