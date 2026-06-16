-- ============================================================================
-- Subcategories: a second level under categories. Products may belong to one
-- subcategory (which belongs to a category).
-- Run in the Supabase SQL Editor (idempotent).
-- ============================================================================

create table if not exists public.subcategories (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories(id) on delete cascade,
  name          text not null,
  slug          text not null unique,
  display_order int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_subcategories_category_id
  on public.subcategories (category_id);

-- Link products to a subcategory (nullable; cleared if the subcategory is removed).
alter table public.products
  add column if not exists subcategory_id uuid
    references public.subcategories(id) on delete set null;

create index if not exists idx_products_subcategory_id
  on public.products (subcategory_id);

-- updated_at trigger (reuses set_updated_at from migration 0001)
drop trigger if exists trg_subcategories_updated_at on public.subcategories;
create trigger trg_subcategories_updated_at
  before update on public.subcategories
  for each row execute function public.set_updated_at();

-- Row Level Security: public read, authenticated write.
alter table public.subcategories enable row level security;
drop policy if exists "subcategories_public_read" on public.subcategories;
drop policy if exists "subcategories_auth_insert" on public.subcategories;
drop policy if exists "subcategories_auth_update" on public.subcategories;
drop policy if exists "subcategories_auth_delete" on public.subcategories;
create policy "subcategories_public_read" on public.subcategories for select using (true);
create policy "subcategories_auth_insert" on public.subcategories for insert to authenticated with check (true);
create policy "subcategories_auth_update" on public.subcategories for update to authenticated using (true) with check (true);
create policy "subcategories_auth_delete" on public.subcategories for delete to authenticated using (true);
