-- ============================================================================
-- Editable homepage hero (single-row settings table).
--
-- When `enabled` is false the site falls back to the built-in default hero,
-- so turning the toggle off is always safe.
-- Run in the Supabase SQL Editor.
-- ============================================================================

create table if not exists public.homepage_hero (
  -- singleton: only one row (id = 1) may ever exist
  id                  int primary key default 1 check (id = 1),
  enabled             boolean not null default false,
  eyebrow             text,
  heading             text,
  heading_highlight   text,
  subheading          text,
  image_url           text,
  primary_label       text,
  primary_href        text,
  secondary_label     text,
  secondary_href      text,
  featured_product_id uuid references public.products(id) on delete set null,
  updated_at          timestamptz not null default now()
);

-- Seed the single row so the admin always has something to edit.
insert into public.homepage_hero (id) values (1) on conflict (id) do nothing;

drop trigger if exists trg_homepage_hero_updated_at on public.homepage_hero;
create trigger trg_homepage_hero_updated_at
  before update on public.homepage_hero
  for each row execute function public.set_updated_at();

alter table public.homepage_hero enable row level security;
drop policy if exists "homepage_hero_public_read" on public.homepage_hero;
drop policy if exists "homepage_hero_auth_insert" on public.homepage_hero;
drop policy if exists "homepage_hero_auth_update" on public.homepage_hero;
create policy "homepage_hero_public_read" on public.homepage_hero for select using (true);
create policy "homepage_hero_auth_insert" on public.homepage_hero for insert to authenticated with check (true);
create policy "homepage_hero_auth_update" on public.homepage_hero for update to authenticated using (true) with check (true);
