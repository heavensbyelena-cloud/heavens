'use client';

import type { Product } from '@/types';

interface ProductFormProps {
  mode: 'create' | 'edit';
  product?: Partial<Product>;
  onSuccess?: () => void;
}

/**
 * Formulaire admin — créer ou modifier un produit
 * Champs : nom, description, prix, catégorie, badge, stock
 * Upload image vers Supabase Storage
 */
export default function ProductForm({ mode, product, onSuccess }: ProductFormProps) {
  return (
    <form>
      {/* Input nom */}
      {/* Textarea description */}
      {/* Input prix */}
      {/* Select catégorie */}
      {/* Input badge */}
      {/* Input stock */}
      {/* Upload image (drag & drop ou click) */}
      {/* Bouton "Enregistrer" */}
    </form>
  );
}
