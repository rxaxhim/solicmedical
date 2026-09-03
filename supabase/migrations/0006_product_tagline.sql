-- ============================================================================
-- Adds a short tagline shown under the product name on the detail page,
-- above the short description (rendered slightly larger than it).
-- Run in the Supabase SQL Editor (idempotent).
-- ============================================================================
alter table public.products
  add column if not exists tagline text;
