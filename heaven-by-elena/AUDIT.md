# Audit complet – Heaven by Elena

**Date :** 6 mars 2025  
**Projet :** Next.js 14 + Supabase (e‑commerce)

---

## 1. Inventaire de ce qu’on a

### 1.1 Structure

| Dossier / Fichier | Rôle |
|-------------------|------|
| **app/** | App Router Next.js : pages (accueil, shop, product, cart, checkout), compte (login, register, dashboard, profile), admin (orders, products, reviews), API (auth, orders, products, reviews), pages légales (mentions, privacy, terms) |
| **components/** | Account, Admin, Cart, Common (Button, Modal, Skeleton, Toast), Footer, Header, Navigation, Product (cards, grid, détail, add-to-cart), Reviews |
| **lib/** | API client, auth (getCurrentUser, requireAuth, requireAdmin), auth-api (session JWT, requireAdminApi), JWT (cookie `heaven_session`), rate-limit (en mémoire), Supabase client/serveur/admin, types DB, utils |
| **types/** | Types métier (Product, Order, Review, UserRole, etc.) |
| **styles/** | globals.css (Tailwind) |
| **supabase/migrations/** | Migration `add_role_to_profiles` (champ `role` user/admin) |

### 1.2 Dépendances (package.json)

- **Runtime :** Next 14.2, React 18.3, @supabase/ssr, @supabase/supabase-js, jose (JWT), clsx, tailwind-merge  
- **Dev :** TypeScript 5.4, ESLint, Tailwind, PostCSS, @types/node, @types/react, @types/react-dom  

### 1.3 Variables d’environnement (utilisées dans le code)

| Variable | Usage | Secret ? |
|----------|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase (client) | Non |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Non |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS (admin) | **Oui** |
| `AUTH_SECRET` ou `JWT_SECRET` | Signature JWT session | **Oui** |
| `NEXT_PUBLIC_SITE_URL` | URL du site | Non |
| `RESEND_API_KEY`, `RESEND_FROM` | Emails (inscription) | **Oui** |

- `.env*` est dans `.gitignore` ✅  
- Pas de `.env.example` pour documenter les variables.

### 1.4 Sécurité déjà en place

- Headers de sécurité dans `next.config.js` : X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy  
- Cookie de session : httpOnly, secure en prod, sameSite: lax  
- Admin protégé : layout admin (JWT + rôle) + `requireAdminApi` sur les routes API sensibles  
- Liste des commandes filtrée par `user_id` pour les non-admins  
- Rate limiting sur login et register (10 req/min par IP, en mémoire)  
- Service role Supabase utilisé uniquement côté serveur  

---

## 2. Risques et problèmes identifiés

### 2.1 Critiques (à corriger en priorité)

| # | Risque | Détail | Fichier(s) |
|---|--------|--------|------------|
| 1 | **Secret JWT par défaut** | Si `AUTH_SECRET` et `JWT_SECRET` sont absents, le code utilise `'change-me-in-production'`. En production, n’importe qui pourrait forger des sessions. | `lib/jwt.ts` |
| 2 | **Redirection ouverte (Open Redirect)** | `GET /api/auth/sync-session?then=...` redirige vers `new URL(then, request.url)` sans contrôle. Un attaquant peut faire rediriger vers un site malveillant (ex. `?then=https://evil.com`). | `app/api/auth/sync-session/route.ts` |

### 2.2 Importants

| # | Risque | Détail |
|---|--------|--------|
| 3 | **Rate limit partiel** | Uniquement sur login/register. Pas sur sync-session ni refresh-session → risque de abus / énumération. |
| 4 | **Rate limit en mémoire** | En multi-instances ou serverless, chaque instance a son propre compteur → peu efficace. Idéal : Redis ou équivalent. |
| 5 | **POST /api/orders sans auth** | Création de commande possible sans être connecté (guest checkout). À documenter ; renforcer la validation (montants, structure des items) et éventuellement limiter par IP. |
| 6 | **Validation des commandes** | `items`, `shipping_address`, `subtotal`/`total`/`shipping_cost` non validés en structure ni en cohérence (total = subtotal + shipping, etc.). |
| 7 | **PATCH orders [id] – statut** | L’API accepte n’importe quelle chaîne pour `status` et l’écrit en base. Le front admin envoie une liste fixe, mais l’API ne valide pas. |
| 8 | **Logs sensibles** | `console.log('[login] Profil:', ...)` dans la route login → fuite d’infos en production. |

### 2.3 Modérés

| # | Risque | Détail |
|---|--------|--------|
| 9 | **Avis (reviews) sans auth** | POST /api/reviews ouvert à tous → spam possible. Ajouter rate limit par IP et éventuellement CAPTCHA ou auth. |
| 10 | **Validation des entrées** | Peu de validation stricte (Zod/Yup) sur les body des API. Risque d’incohérence et de données invalides. |
| 11 | **Middleware vide** | Aucune logique ; pas de redirection précoce pour `/admin` si pas de cookie → un aller-retour inutile. |
| 12 | **Pas de .env.example** | Variables d’environnement non documentées pour les nouveaux devs ou le déploiement. |

### 2.4 Vulnérabilités npm (npm audit)

- **6 vulnérabilités** (2 low, 4 high) :  
  - `cookie` (dépendance de @supabase/ssr) : caractères hors bornes  
  - `glob` (ESLint/Next) : injection de commande en CLI  
  - **Next.js** : DoS via Image Optimizer (remotePatterns) et désérialisation RSC  

- Un `npm audit fix --force` proposerait des versions majeures (breaking). À traiter par mise à jour progressive (Next 16, @supabase/ssr plus récent, etc.) et tests.

### 2.5 CORS / déploiement

- Pas de CORS explicite (comportement same-origin par défaut). Si vous exposez les API à un autre domaine (SPA externe, app mobile), il faudra configurer CORS.  
- Vérifier que `SUPABASE_SERVICE_ROLE_KEY`, `AUTH_SECRET`/`JWT_SECRET` et `RESEND_API_KEY` ne sont **jamais** préfixées par `NEXT_PUBLIC_` et ne sont pas exposées au client.

---

## 3. Synthèse des actions recommandées

| Priorité | Action |
|----------|--------|
| **P0** | Supprimer le fallback `'change-me-in-production'` et refuser de signer les JWT (ou de démarrer) si aucun secret n’est défini en production. |
| **P0** | Valider le paramètre `then` dans sync-session : n’accepter que des chemins relatifs (ex. commençant par `/`, pas de `//` ni d’URL absolue). |
| **P1** | Étendre le rate limiting à sync-session et refresh-session (ou à toute la branche `/api/auth/*`). |
| **P1** | Retirer ou conditionner les `console.log` contenant des infos de profil en production. |
| **P1** | Valider le `status` en PATCH orders (liste blanche : pending, paid, processing, shipped, delivered, cancelled). |
| **P2** | Ajouter une validation de schéma (Zod) pour les body des routes orders et products. |
| **P2** | Créer un `.env.example` listant toutes les variables attendues (sans valeurs sensibles). |
| **P2** | Planifier une mise à jour des dépendances (Next, @supabase/ssr, eslint-config-next) et relancer `npm audit` après tests. |

---

## 4. Ce qui a été corrigé dans le code (cette session)

- **sync-session** : le paramètre `then` est validé (chemins relatifs uniquement, pas d’URL externes).  
- **JWT** : en production, le serveur refuse d’utiliser un secret par défaut (pas de `'change-me-in-production'` si `NODE_ENV === 'production'`).

Voir les fichiers modifiés pour le détail des changements.
