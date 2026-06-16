-- ============================================================================
-- Add a product/model code to accessories.
-- Run in the Supabase SQL Editor (idempotent).
-- ============================================================================
alter table public.accessories
  add column if not exists product_code text;
