/**
 * JWT pour la session utilisateur (role inclus).
 * Secret: AUTH_SECRET ou JWT_SECRET dans .env
 * Utilisé par le middleware et les routes API admin.
 */
import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '@/types';

const COOKIE_NAME = 'heaven_session';

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error(
      'En production, AUTH_SECRET ou JWT_SECRET doit être défini dans .env (ne pas utiliser de secret par défaut).'
    );
  }
  return new TextEncoder().encode(secret || 'change-me-in-production');
}

const EXPIRY = '7d'; // 7 jours

export interface SessionPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/** Créer un JWT avec l'id, email et role de l'utilisateur */
export async function createSessionToken(payload: {
  sub: string;
  email: string;
  role: UserRole;
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

/** Vérifier le JWT et retourner le payload ou null */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role as string;
    if (role !== 'user' && role !== 'admin') return null;
    return {
      sub: payload.sub as string,
      email: (payload.email as string) ?? '',
      role: role as UserRole,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
