'use client';

import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

/**
 * Ligne d'article dans le panier
 * Image | Nom + Prix | Contrôles quantité | Supprimer
 */
export default function CartItem({ item, onUpdateQty, onRemove }: CartItemProps) {
  return (
    <div>
      {/* Image produit */}
      {/* Nom + prix unitaire */}
      {/* Contrôles : btn − | quantité | btn + */}
      {/* Bouton supprimer ✕ */}
    </div>
  );
}
