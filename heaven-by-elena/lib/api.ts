import type { Product, Order, Review, PaginatedResponse, ApiResponse } from '@/types';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? '';

// ============================================================
// PRODUITS
// ============================================================

export async function getProducts(params?: {
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${BASE}/api/products?${query}`, {
    next: { revalidate: 60 }, // cache ISR 60s
  });

  if (!res.ok) throw new Error('Erreur chargement produits');
  return res.json();
}

export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Erreur chargement produit');
  const data = await res.json();
  return data.product ?? null;
}

// ============================================================
// COMMANDES
// ============================================================

export async function createOrder(orderData: unknown): Promise<ApiResponse<{ order: Order; payment_url: string }>> {
  const res = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  return res.json();
}

// ============================================================
// AVIS
// ============================================================

export async function getReviews(params?: {
  product_id?: string;
  limit?: number;
}): Promise<{ reviews: Review[]; average: number; total: number }> {
  const query = new URLSearchParams();
  if (params?.product_id) query.set('product_id', params.product_id);
  if (params?.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${BASE}/api/reviews?${query}`, {
    next: { revalidate: 120 },
  });

  if (!res.ok) throw new Error('Erreur chargement avis');
  return res.json();
}

export async function submitReview(reviewData: {
  rating: number;
  comment: string;
  author_name?: string;
  product_id?: string;
}): Promise<ApiResponse<Review>> {
  const res = await fetch(`${BASE}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });

  return res.json();
}
