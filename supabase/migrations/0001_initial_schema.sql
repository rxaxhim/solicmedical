-- ============================================================================
-- Solic Medical — Initial schema
-- Phase 2: products backend foundation
--
-- Run this in the Supabase SQL Editor (New Query → paste → Run), or via the
-- Supabase CLI (`supabase db push`).
--
-- Contents:
--   1. Extensions
--   2. Helper: updated_at trigger function
--   3. Tables (categories, products, and product-related child tables)
--   4. Indexes
--   5. updated_at triggers
--   6. Row Level Security (public read, authenticated write) on every table
--   7. Storage buckets + storage RLS policies
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Extensions
-- ----------------------------------------------------------------------------
-- gen_random_uuid() lives in pgcrypto. (On modern Supabase it is usually already
-- enabled; this is idempotent and safe to run anyway.)
create extension if not exists "pgcrypto";


-- ----------------------------------------------------------------------------
-- 2. Helper: auto-update updated_at on row UPDATE
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ----------------------------------------------------------------------------
-- 3. Tables
-- ----------------------------------------------------------------------------

-- categories ----------------------------------------------------------------
create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  display_order int  not null default 0,
  image_url     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- products ------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  model_code    text,
  description   text,
  category_id   uuid references public.categories(id) on delete set null,
  brand         text,
  featured      boolean not null default false,
  display_order int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- product_images ------------------------------------------------------------
create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  image_url     text not null,
  alt_text      text,
  is_primary    boolean not null default false,
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

-- product_overview (one per product) ----------------------------------------
create table if not exists public.product_overview (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null unique references public.products(id) on delete cascade,
  content     text not null,
  updated_at  timestamptz not null default now()
);

-- product_configurations ----------------------------------------------------
create table if not exists public.product_configurations (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  config_name    text not null,
  config_details text,
  display_order  int  not null default 0,
  created_at     timestamptz not null default now()
);

-- product_documents ---------------------------------------------------------
create table if not exists public.product_documents (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  title         text not null,
  pdf_url       text not null,
  document_type text not null default 'manual'
                check (document_type in ('manual', 'datasheet', 'brochure', 'other')),
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

-- product_videos ------------------------------------------------------------
create table if not exists public.product_videos (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  title         text not null,
  youtube_url   text not null,
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

-- accessories ---------------------------------------------------------------
create table if not exists public.accessories (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  name          text not null,
  description   text,
  image_url     text,
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

-- related_products (self-join) ----------------------------------------------
create table if not exists public.related_products (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references public.products(id) on delete cascade,
  related_product_id uuid not null references public.products(id) on delete cascade,
  display_order      int  not null default 0,
  unique (product_id, related_product_id),
  check (product_id <> related_product_id)
);


-- ----------------------------------------------------------------------------
-- 4. Indexes
-- ----------------------------------------------------------------------------
-- (slug uniqueness already creates an index on products.slug & categories.slug)
create index if not exists idx_products_category_id        on public.products (category_id);
create index if not exists idx_products_model_code         on public.products (model_code);
create index if not exists idx_products_featured           on public.products (featured);

create index if not exists idx_product_images_product_id        on public.product_images (product_id);
create index if not exists idx_product_configs_product_id       on public.product_configurations (product_id);
create index if not exists idx_product_documents_product_id     on public.product_documents (product_id);
create index if not exists idx_product_videos_product_id        on public.product_videos (product_id);
create index if not exists idx_accessories_product_id           on public.accessories (product_id);
create index if not exists idx_related_products_product_id      on public.related_products (product_id);
create index if not exists idx_related_products_related_id      on public.related_products (related_product_id);


-- ----------------------------------------------------------------------------
-- 5. updated_at triggers (tables that have an updated_at column)
-- ----------------------------------------------------------------------------
drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_product_overview_updated_at on public.product_overview;
create trigger trg_product_overview_updated_at
  before update on public.product_overview
  for each row execute function public.set_updated_at();


-- ----------------------------------------------------------------------------
-- 6. Row Level Security
--    Policy model: anyone (anon + authenticated) can SELECT.
--                  Only authenticated users can INSERT / UPDATE / DELETE.
--    The only authenticated users will be admins; we can tighten later.
-- ----------------------------------------------------------------------------

-- Helper note: we create four policies per table. Run for every table.

-- categories ----------------------------------------------------------------
alter table public.categories enable row level security;
drop policy if exists "categories_public_read"   on public.categories;
drop policy if exists "categories_auth_insert"    on public.categories;
drop policy if exists "categories_auth_update"    on public.categories;
drop policy if exists "categories_auth_delete"    on public.categories;
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_auth_insert" on public.categories for insert to authenticated with check (true);
create policy "categories_auth_update" on public.categories for update to authenticated using (true) with check (true);
create policy "categories_auth_delete" on public.categories for delete to authenticated using (true);

-- products ------------------------------------------------------------------
alter table public.products enable row level security;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_auth_insert" on public.products;
drop policy if exists "products_auth_update" on public.products;
drop policy if exists "products_auth_delete" on public.products;
create policy "products_public_read" on public.products for select using (true);
create policy "products_auth_insert" on public.products for insert to authenticated with check (true);
create policy "products_auth_update" on public.products for update to authenticated using (true) with check (true);
create policy "products_auth_delete" on public.products for delete to authenticated using (true);

-- product_images ------------------------------------------------------------
alter table public.product_images enable row level security;
drop policy if exists "product_images_public_read" on public.product_images;
drop policy if exists "product_images_auth_insert" on public.product_images;
drop policy if exists "product_images_auth_update" on public.product_images;
drop policy if exists "product_images_auth_delete" on public.product_images;
create policy "product_images_public_read" on public.product_images for select using (true);
create policy "product_images_auth_insert" on public.product_images for insert to authenticated with check (true);
create policy "product_images_auth_update" on public.product_images for update to authenticated using (true) with check (true);
create policy "product_images_auth_delete" on public.product_images for delete to authenticated using (true);

-- product_overview ----------------------------------------------------------
alter table public.product_overview enable row level security;
drop policy if exists "product_overview_public_read" on public.product_overview;
drop policy if exists "product_overview_auth_insert" on public.product_overview;
drop policy if exists "product_overview_auth_update" on public.product_overview;
drop policy if exists "product_overview_auth_delete" on public.product_overview;
create policy "product_overview_public_read" on public.product_overview for select using (true);
create policy "product_overview_auth_insert" on public.product_overview for insert to authenticated with check (true);
create policy "product_overview_auth_update" on public.product_overview for update to authenticated using (true) with check (true);
create policy "product_overview_auth_delete" on public.product_overview for delete to authenticated using (true);

-- product_configurations ----------------------------------------------------
alter table public.product_configurations enable row level security;
drop policy if exists "product_configurations_public_read" on public.product_configurations;
drop policy if exists "product_configurations_auth_insert" on public.product_configurations;
drop policy if exists "product_configurations_auth_update" on public.product_configurations;
drop policy if exists "product_configurations_auth_delete" on public.product_configurations;
create policy "product_configurations_public_read" on public.product_configurations for select using (true);
create policy "product_configurations_auth_insert" on public.product_configurations for insert to authenticated with check (true);
create policy "product_configurations_auth_update" on public.product_configurations for update to authenticated using (true) with check (true);
create policy "product_configurations_auth_delete" on public.product_configurations for delete to authenticated using (true);

-- product_documents ---------------------------------------------------------
alter table public.product_documents enable row level security;
drop policy if exists "product_documents_public_read" on public.product_documents;
drop policy if exists "product_documents_auth_insert" on public.product_documents;
drop policy if exists "product_documents_auth_update" on public.product_documents;
drop policy if exists "product_documents_auth_delete" on public.product_documents;
create policy "product_documents_public_read" on public.product_documents for select using (true);
create policy "product_documents_auth_insert" on public.product_documents for insert to authenticated with check (true);
create policy "product_documents_auth_update" on public.product_documents for update to authenticated using (true) with check (true);
create policy "product_documents_auth_delete" on public.product_documents for delete to authenticated using (true);

-- product_videos ------------------------------------------------------------
alter table public.product_videos enable row level security;
drop policy if exists "product_videos_public_read" on public.product_videos;
drop policy if exists "product_videos_auth_insert" on public.product_videos;
drop policy if exists "product_videos_auth_update" on public.product_videos;
drop policy if exists "product_videos_auth_delete" on public.product_videos;
create policy "product_videos_public_read" on public.product_videos for select using (true);
create policy "product_videos_auth_insert" on public.product_videos for insert to authenticated with check (true);
create policy "product_videos_auth_update" on public.product_videos for update to authenticated using (true) with check (true);
create policy "product_videos_auth_delete" on public.product_videos for delete to authenticated using (true);

-- accessories ---------------------------------------------------------------
alter table public.accessories enable row level security;
drop policy if exists "accessories_public_read" on public.accessories;
drop policy if exists "accessories_auth_insert" on public.accessories;
drop policy if exists "accessories_auth_update" on public.accessories;
drop policy if exists "accessories_auth_delete" on public.accessories;
create policy "accessories_public_read" on public.accessories for select using (true);
create policy "accessories_auth_insert" on public.accessories for insert to authenticated with check (true);
create policy "accessories_auth_update" on public.accessories for update to authenticated using (true) with check (true);
create policy "accessories_auth_delete" on public.accessories for delete to authenticated using (true);

-- related_products ----------------------------------------------------------
alter table public.related_products enable row level security;
drop policy if exists "related_products_public_read" on public.related_products;
drop policy if exists "related_products_auth_insert" on public.related_products;
drop policy if exists "related_products_auth_update" on public.related_products;
drop policy if exists "related_products_auth_delete" on public.related_products;
create policy "related_products_public_read" on public.related_products for select using (true);
create policy "related_products_auth_insert" on public.related_products for insert to authenticated with check (true);
create policy "related_products_auth_update" on public.related_products for update to authenticated using (true) with check (true);
create policy "related_products_auth_delete" on public.related_products for delete to authenticated using (true);


-- ----------------------------------------------------------------------------
-- 7. Storage buckets + policies
--    Three public-read / authenticated-write buckets.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('product-images',  'product-images',  true),
  ('product-docs',    'product-docs',    true),
  ('category-images', 'category-images', true)
on conflict (id) do nothing;

-- Public read for objects in these three buckets ----------------------------
drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read"
  on storage.objects for select
  using (bucket_id in ('product-images', 'product-docs', 'category-images'));

-- Authenticated insert ------------------------------------------------------
drop policy if exists "storage_auth_insert" on storage.objects;
create policy "storage_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('product-images', 'product-docs', 'category-images'));

-- Authenticated update ------------------------------------------------------
drop policy if exists "storage_auth_update" on storage.objects;
create policy "storage_auth_update"
  on storage.objects for update to authenticated
  using      (bucket_id in ('product-images', 'product-docs', 'category-images'))
  with check (bucket_id in ('product-images', 'product-docs', 'category-images'));

-- Authenticated delete ------------------------------------------------------
drop policy if exists "storage_auth_delete" on storage.objects;
create policy "storage_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id in ('product-images', 'product-docs', 'category-images'));

-- ============================================================================
-- End of migration
-- ============================================================================
