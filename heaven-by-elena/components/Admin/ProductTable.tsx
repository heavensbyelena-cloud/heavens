import type { Product } from '@/types';

interface ProductTableProps {
  products: Product[];
}

/**
 * Tableau admin des produits
 * Colonnes : Image | Nom | Catégorie | Prix | Stock | Actions
 * Actions : Modifier (→ /admin/products/[id]) | Supprimer
 */
export default function ProductTable({ products }: ProductTableProps) {
  return (
    <table>
      <thead>
        {/* En-têtes */}
      </thead>
      <tbody>
        {/* Lignes produits */}
      </tbody>
    </table>
  );
}
