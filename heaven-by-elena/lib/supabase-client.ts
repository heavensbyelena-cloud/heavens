/**
 * Client Supabase pour le navigateur (Client Components uniquement).
 * N'utilise PAS next/headers — à importer uniquement dans les Client Components.
 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';
import type { Product } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// --------------------------------------------------------
// Client navigateur (Client Components)
// --------------------------------------------------------
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// --------------------------------------------------------
// Helpers optionnels (utilisent createClient — côté client uniquement)
// --------------------------------------------------------
export async function getProducts(category?: string): Promise<Product[]> {
  const client = createClient();
  let query = client
    .from('products')
    .select('id, name, price, badge, category, image_url, stock, is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(100);
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Product[]) ?? [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const client = createClient();
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
  if (error || !data) return null;
  return data as Product;
}

export async function getReviews(productId?: string, limit = 20) {
  const client = createClient();
  let query = client
    .from('reviews')
    .select('id, product_id, rating, comment, author_name, status, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (productId) query = query.eq('product_id', productId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
