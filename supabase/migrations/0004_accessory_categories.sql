-- ============================================================================
-- Accessory categories: a reusable, global list (SpO2, NIBP, Temperature, …)
-- that each accessory can belong to. Run in the Supabase SQL Editor.
-- ============================================================================

create table if not exists public.accessory_categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  display_order int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.accessories
  add column if not exists accessory_category_id uuid
    references public.accessory_categories(id) on delete set null;

create index if not exists idx_accessories_accessory_category_id
  on public.accessories (accessory_category_id);

drop trigger if exists trg_accessory_categories_updated_at on public.accessory_categories;
create trigger trg_accessory_categories_updated_at
  before update on public.accessory_categories
  for each row execute function public.set_updated_at();

alter table public.accessory_categories enable row level security;
drop policy if exists "accessory_categories_public_read" on public.accessory_categories;
drop policy if exists "accessory_categories_auth_insert" on public.accessory_categories;
drop policy if exists "accessory_categories_auth_update" on public.accessory_categories;
drop policy if exists "accessory_categories_auth_delete" on public.accessory_categories;
create policy "accessory_categories_public_read" on public.accessory_categories for select using (true);
create policy "accessory_categories_auth_insert" on public.accessory_categories for insert to authenticated with check (true);
create policy "accessory_categories_auth_update" on public.accessory_categories for update to authenticated using (true) with check (true);
create policy "accessory_categories_auth_delete" on public.accessory_categories for delete to authenticated using (true);
