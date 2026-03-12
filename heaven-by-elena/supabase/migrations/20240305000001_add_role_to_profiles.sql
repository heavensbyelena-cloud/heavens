-- ============================================================
-- Colonne "role" sur profiles (Heaven's By Elena)
-- Valeurs: 'user' | 'admin'. Défaut: 'user'.
-- Elena = admin (remplacer l'email ci-dessous par celui d'Elena).
-- ============================================================

-- Ajouter la colonne role avec défaut 'user'
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

-- Contrainte pour n'accepter que 'user' ou 'admin'
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- Optionnel: garder is_admin synchronisé avec role (pour rétrocompat)
-- UPDATE public.profiles SET is_admin = (role = 'admin');

-- Donner le rôle admin à Elena (remplacer par l'email réel d'Elena)
-- Exemple:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'elena@heavensbyelena.com';
