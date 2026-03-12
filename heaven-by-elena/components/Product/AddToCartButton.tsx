'use client';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import type { Product } from '@/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  function handle() {
    addItem({ id: String(product.id), name: product.name, price: product.price, image_url: product.image_url || '' });
    showToast(`${product.name} ajouté au panier ✦`);
    openCart();
  }

  return (
    <button onClick={handle} className="btn-primary" style={{ padding: '16px 40px', fontSize: '0.8rem' }}>
      Ajouter au panier
    </button>
  );
}
