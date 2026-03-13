# Problème de déploiement Cloudflare — 404 et bouton Admin

## Diagnostic

### Structure du projet ✅
- `heaven-by-elena/` contient tout le code Next.js
- `app/admin-login/page.tsx` existe et est commité
- Le middleware ne bloque pas `/admin-login`

### Problème principal : Cloudflare Pages ≠ Full Next.js

**Cloudflare Pages** (Connect to Git) est conçu pour des **sites statiques** :
- Attend `output: 'export'` dans next.config
- Build output : dossier `out/` avec des fichiers HTML statiques
- **Ne supporte pas** : API routes, middleware, SSR à l'exécution

**Ton projet** est une app Next.js complète :
- API routes (`/api/auth/*`, `/api/cart/*`, etc.)
- Middleware (protection des routes)
- Server Components
- Pas de `output: 'export'`

**Résultat** : Cloudflare Pages sert des fichiers statiques. Sans export statique, il n’y a pas de `out/index.html`, `out/admin-login.html`, etc. → **404** sur presque toutes les routes.

---

## Solutions possibles

### Option 1 : Passer à Cloudflare Workers (recommandé pour rester sur Cloudflare)

Utiliser **@opennextjs/cloudflare** pour déployer une vraie app Next.js.

**Étapes :**
1. Dans `heaven-by-elena/` :
   ```bash
   npm i @opennextjs/cloudflare wrangler
   ```

2. Créer `open-next.config.ts` à la racine de heaven-by-elena :
   ```ts
   import { defineCloudflareConfig } from "@opennextjs/cloudflare";
   export default defineCloudflareConfig();
   ```

3. Créer `wrangler.toml` :
   ```toml
   name = "heavens-by-elena"
   main = ".open-next/worker.js"
   compatibility_date = "2026-03-13"
   compatibility_flags = [ "nodejs_compat" ]
   [assets]
   directory = ".open-next/assets"
   binding = "ASSETS"
   ```

4. Ajouter dans `package.json` :
   ```json
   "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
   ```

5. Déployer avec `npm run deploy` (plus de Connect to Git pour ce projet).

---

### Option 2 : Utiliser Vercel ou Netlify

Ces plateformes gèrent nativement Next.js complet (API, middleware, SSR).

- **Vercel** : connecte le repo GitHub, détecte Next.js, déploiement automatique.
- **Netlify** : idem, bon support Next.js.

---

### Option 3 : Export statique (limité)

Ajouter `output: 'export'` dans next.config. **Attention** : cela casse les API routes, le middleware et toute logique serveur. Il faudrait tout refactorer (ex. déplacer les API vers des fonctions externes).

---

## Vérifications Cloudflare actuelles

Si tu restes sur Cloudflare Pages Connect to Git :

| Paramètre | Valeur attendue |
|-----------|-----------------|
| Root directory | `heaven-by-elena` |
| Build command | `npm run build` |
| Build output | `out` (uniquement si `output: 'export'`) |

Sans `output: 'export'`, le dossier `out` n’existe pas → 404.

---

## Recommandation

Pour une app avec API, auth, panier, etc. : **Option 1 (Cloudflare Workers)** ou **Option 2 (Vercel/Netlify)**.

---

## Déploiement Workers (configuré)

```bash
cd heaven-by-elena
npm install
npx wrangler login
npm run deploy
```

Variables d'environnement : `npx wrangler secret put NOM_VARIABLE` pour chaque variable de .env.local.
