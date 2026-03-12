'use client';

import type { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
}

/**
 * Vue détail produit
 * Galerie images | Nom | Prix | Badge | Description | Bouton panier
 * Informations livraison, retours
 */
export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <section>
      {/* Colonne gauche : galerie images */}
      {/* Colonne droite : */}
      {/*   Badge */}
      {/*   Nom (Cormorant Garamond, grand) */}
      {/*   Prix */}
      {/*   Description */}
      {/*   Sélecteur variante (si applicable) */}
      {/*   Bouton "AJOUTER AU PANIER" */}
      {/*   Infos livraison + retours */}
    </section>
  );
}
