/**
 * Rate limiting simple en mémoire pour /api/auth/*
 * Limite: 10 requêtes par IP par fenêtre de 1 minute.
 */

const windowMs = 60 * 1000; // 1 minute
const maxRequests = 10;

const store = new Map<string, { count: number; resetAt: number }>();

function getClientId(request: Request): string {
  return (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')) ?? 'unknown';
}

/** Retourne true si la requête est autorisée, false si rate limit dépassé */
export function checkAuthRateLimit(request: Request): boolean {
  const id = getClientId(request);
  const now = Date.now();
  const entry = store.get(id);

  if (!entry) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (now > entry.resetAt) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;
  entry.count += 1;
  return true;
}
