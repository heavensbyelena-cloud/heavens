/**
 * Point d'entrée client uniquement (pour ne pas importer next/headers).
 * - Client Components : import { createClient } from '@/lib/supabase-client'
 * - Server Components / API : import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
 *
 * Re-export du client navigateur pour compatibilité avec les anciens imports.
 */
export { createClient, getProducts, getProduct, getReviews } from './supabase-client';
