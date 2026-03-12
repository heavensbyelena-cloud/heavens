-- ============================================================
-- Table cart_items : panier par utilisateur (Supabase)
-- ============================================================

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Un seul enregistrement par (user_id, product_id)
create unique index if not exists cart_items_user_product_key
  on public.cart_items (user_id, product_id);

-- Index pour les requêtes fréquentes
create index if not exists cart_items_user_id_idx on public.cart_items (user_id);
create index if not exists cart_items_product_id_idx on public.cart_items (product_id);

-- Trigger de mise à jour automatique du champ updated_at
create or replace function public.set_cart_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_cart_items_set_updated_at
on public.cart_items;

create trigger trg_cart_items_set_updated_at
before update on public.cart_items
for each row execute procedure public.set_cart_items_updated_at();

