'use client';

// TODO: useCart hook pour récupérer le nombre total d'articles

/**
 * Badge nombre d'articles sur l'icône panier
 * Visible seulement si panier non vide
 */
export default function CartBadge() {
  const count = 0; // TODO: const { count } = useCart();

  if (count === 0) return null;

  return (
    <span>
      {count}
    </span>
  );
}
