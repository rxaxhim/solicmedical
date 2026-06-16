-- ============================================================================
-- Seed data for local testing of the products listing page.
-- 3 categories · 2 brands · 8 products (each with a primary image).
--
-- Safe to re-run: categories/products upsert on their unique slug, and product
-- images are cleared for these products before re-inserting.
--
-- Run in the Supabase SQL Editor (New query → paste → Run).
-- ============================================================================

-- 1. Categories --------------------------------------------------------------
insert into public.categories (name, slug, description, display_order)
values
  ('Patient Monitoring',  'patient-monitoring',
   'Vital signs monitors, dopplers, and continuous monitoring solutions.', 1),
  ('Cardio Diagnostics',  'cardio-diagnostics',
   'ECG machines, stethoscopes, and cardiac diagnostic equipment.', 2),
  ('Exam Room Furniture', 'exam-room-furniture',
   'Examination tables, stools, mayo stands, and clinic furniture.', 3)
on conflict (slug) do update
  set name = excluded.name,
      description = excluded.description,
      display_order = excluded.display_order;

-- 2. Products ----------------------------------------------------------------
insert into public.products
  (name, slug, model_code, description, category_id, brand, featured, display_order)
select
  v.name, v.slug, v.model_code, v.description,
  c.id, v.brand, v.featured, v.display_order
from (
  values
    ('Connex Spot Monitor',        'connex-spot-monitor',     'CSM-7100',
     'Spot-check vital signs monitor with connectivity.',
     'patient-monitoring',  'Welch Allyn', true,  1),
    ('Vital Signs Monitor 6000',   'vital-signs-monitor-6000','VSM-6000',
     'Compact monitor for NIBP, SpO2, and temperature.',
     'patient-monitoring',  'Welch Allyn', false, 2),
    ('RVS-100 Vitals Monitor',     'rvs-100-vitals-monitor',  'RVS-100',
     'Modular vital signs monitor for clinics.',
     'patient-monitoring',  'Riester',     false, 3),
    ('CardioPerfect ECG',          'cardioperfect-ecg',       'CP-200',
     'Resting ECG system with PC-based reporting.',
     'cardio-diagnostics',  'Welch Allyn', true,  1),
    ('ri-cardio ECG',              'ri-cardio-ecg',           'RC-1010',
     '12-channel ECG with interpretation.',
     'cardio-diagnostics',  'Riester',     false, 2),
    ('Duplex 2.0 Stethoscope',     'duplex-2-stethoscope',    'DPX-200',
     'Dual-head stethoscope in stainless steel.',
     'cardio-diagnostics',  'Riester',     false, 3),
    ('Exam Table 2000',            'exam-table-2000',         'ET-2000',
     'Power examination table with adjustable height.',
     'exam-room-furniture', 'Welch Allyn', false, 1),
    ('ri-exam Procedure Stool',    'ri-exam-procedure-stool', 'RX-50',
     'Pneumatic procedure stool with backrest.',
     'exam-room-furniture', 'Riester',     true,  2)
) as v(name, slug, model_code, description, category_slug, brand, featured, display_order)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do update
  set name = excluded.name,
      model_code = excluded.model_code,
      description = excluded.description,
      category_id = excluded.category_id,
      brand = excluded.brand,
      featured = excluded.featured,
      display_order = excluded.display_order;

-- 3. Primary images ----------------------------------------------------------
-- Clear any existing images for these products so re-running stays clean.
delete from public.product_images
where product_id in (
  select id from public.products where slug in (
    'connex-spot-monitor','vital-signs-monitor-6000','rvs-100-vitals-monitor',
    'cardioperfect-ecg','ri-cardio-ecg','duplex-2-stethoscope',
    'exam-table-2000','ri-exam-procedure-stool'
  )
);

insert into public.product_images (product_id, image_url, alt_text, is_primary, display_order)
select p.id, v.image_url, v.alt_text, true, 0
from (
  values
    ('connex-spot-monitor',
     'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80&auto=format&fit=crop',
     'Connex Spot Monitor'),
    ('vital-signs-monitor-6000',
     'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop',
     'Vital Signs Monitor 6000'),
    ('rvs-100-vitals-monitor',
     'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&q=80&auto=format&fit=crop',
     'RVS-100 Vitals Monitor'),
    ('cardioperfect-ecg',
     'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80&auto=format&fit=crop',
     'CardioPerfect ECG'),
    ('ri-cardio-ecg',
     'https://images.unsplash.com/photo-1559757175-08fda9d44a08?w=800&q=80&auto=format&fit=crop',
     'ri-cardio ECG'),
    ('duplex-2-stethoscope',
     'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80&auto=format&fit=crop',
     'Duplex 2.0 Stethoscope'),
    ('exam-table-2000',
     'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=800&q=80&auto=format&fit=crop',
     'Exam Table 2000'),
    ('ri-exam-procedure-stool',
     'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=800&q=80&auto=format&fit=crop',
     'ri-exam Procedure Stool')
) as v(slug, image_url, alt_text)
join public.products p on p.slug = v.slug;

-- ============================================================================
-- DETAIL SEED — rich content for two products so every tab can be verified:
--   connex-spot-monitor  and  cardioperfect-ecg
-- Idempotent: child rows are cleared for these two products before re-insert.
-- ============================================================================

-- Convenience: ids of the two detailed products.
-- (Used via subselects below.)

-- 4a. Extra gallery images (in addition to the primary inserted above) -------
delete from public.product_images
where is_primary = false
  and product_id in (
    select id from public.products
    where slug in ('connex-spot-monitor', 'cardioperfect-ecg')
  );

insert into public.product_images (product_id, image_url, alt_text, is_primary, display_order)
select p.id, v.image_url, v.alt_text, false, v.display_order
from (
  values
    ('connex-spot-monitor',
     'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=800&q=80&auto=format&fit=crop',
     'Connex Spot Monitor – side view', 1),
    ('connex-spot-monitor',
     'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
     'Connex Spot Monitor – in use', 2),
    ('connex-spot-monitor',
     'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
     'Connex Spot Monitor – display detail', 3),
    ('connex-spot-monitor',
     'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=800&q=80&auto=format&fit=crop',
     'Connex Spot Monitor – cart mounted', 4),
    ('cardioperfect-ecg',
     'https://images.unsplash.com/photo-1559757175-08fda9d44a08?w=800&q=80&auto=format&fit=crop',
     'CardioPerfect ECG – leads', 1),
    ('cardioperfect-ecg',
     'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop',
     'CardioPerfect ECG – workstation', 2),
    ('cardioperfect-ecg',
     'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=800&q=80&auto=format&fit=crop',
     'CardioPerfect ECG – reporting screen', 3)
) as v(slug, image_url, alt_text, display_order)
join public.products p on p.slug = v.slug;

-- 4b. Overview (markdown) ----------------------------------------------------
insert into public.product_overview (product_id, content)
select p.id, v.content
from (
  values
    ('connex-spot-monitor', $md$
The **Connex Spot Monitor** captures a complete set of vital signs in seconds and
connects directly to your EMR, reducing manual transcription errors.

## Key benefits

- Fast, accurate **SureBP** non-invasive blood pressure in ~15 seconds
- Nellcor or Masimo **SpO2** options
- Wireless connectivity to your EMR
- Bright, configurable touchscreen

## Why clinicians choose it

Designed for high-throughput environments, the Connex Spot Monitor standardises
vitals capture across your practice and supports early detection of patient
deterioration.
$md$),
    ('cardioperfect-ecg', $md$
The **CardioPerfect ECG** is a PC-based resting ECG system that streamlines
acquisition, interpretation, and reporting.

## Highlights

- Full 12-lead acquisition
- Automatic measurements and interpretation
- Side-by-side comparison with prior ECGs
- Exports to PDF and integrates with your EMR

| Spec | Value |
| --- | --- |
| Leads | 12 |
| Sample rate | 1000 Hz |
| Connectivity | USB / Network |
$md$)
) as v(slug, content)
join public.products p on p.slug = v.slug
on conflict (product_id) do update set content = excluded.content;

-- 4c. Configurations ---------------------------------------------------------
delete from public.product_configurations
where product_id in (
  select id from public.products
  where slug in ('connex-spot-monitor', 'cardioperfect-ecg')
);

insert into public.product_configurations (product_id, config_name, config_details, display_order)
select p.id, v.config_name, v.config_details, v.display_order
from (
  values
    ('connex-spot-monitor', 'Standard',
     'Includes **SureBP** NIBP, temperature, and Nellcor SpO2. Ideal for general practice.', 1),
    ('connex-spot-monitor', 'Advanced',
     'Adds Masimo SpO2, wireless connectivity, and a mobile cart mount.', 2),
    ('connex-spot-monitor', 'Cart-mounted',
     'Standard configuration pre-mounted on a height-adjustable mobile cart.', 3),
    ('cardioperfect-ecg', 'Workstation',
     'PC-based acquisition module with CardioPerfect Workstation software.', 1),
    ('cardioperfect-ecg', 'Connected',
     'Adds EMR integration and networked PDF reporting.', 2)
) as v(slug, config_name, config_details, display_order)
join public.products p on p.slug = v.slug;

-- 4d. Documents --------------------------------------------------------------
delete from public.product_documents
where product_id in (
  select id from public.products
  where slug in ('connex-spot-monitor', 'cardioperfect-ecg')
);

insert into public.product_documents (product_id, title, pdf_url, document_type, display_order)
select p.id, v.title, v.pdf_url, v.document_type, v.display_order
from (
  values
    ('connex-spot-monitor', 'Connex Spot Monitor – User Manual',
     'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'manual', 1),
    ('connex-spot-monitor', 'Connex Spot Monitor – Datasheet',
     'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'datasheet', 2),
    ('cardioperfect-ecg', 'CardioPerfect – Quick Start Guide',
     'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'manual', 1),
    ('cardioperfect-ecg', 'CardioPerfect – Brochure',
     'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'brochure', 2)
) as v(slug, title, pdf_url, document_type, display_order)
join public.products p on p.slug = v.slug;

-- 4e. Videos -----------------------------------------------------------------
delete from public.product_videos
where product_id in (
  select id from public.products
  where slug in ('connex-spot-monitor', 'cardioperfect-ecg')
);

insert into public.product_videos (product_id, title, youtube_url, display_order)
select p.id, v.title, v.youtube_url, v.display_order
from (
  values
    ('connex-spot-monitor', 'Product Overview',
     'https://www.youtube.com/watch?v=aqz-KE-bpKQ', 1),
    ('connex-spot-monitor', 'Setup & Calibration',
     'https://youtu.be/dQw4w9WgXcQ', 2),
    ('cardioperfect-ecg', 'CardioPerfect Walkthrough',
     'https://www.youtube.com/watch?v=aqz-KE-bpKQ', 1)
) as v(slug, title, youtube_url, display_order)
join public.products p on p.slug = v.slug;

-- 4f. Accessories ------------------------------------------------------------
delete from public.accessories
where product_id in (
  select id from public.products
  where slug in ('connex-spot-monitor', 'cardioperfect-ecg')
);

insert into public.accessories (product_id, name, product_code, description, image_url, display_order)
select p.id, v.name, v.product_code, v.description, v.image_url, v.display_order
from (
  values
    ('connex-spot-monitor', 'Reusable BP Cuff (Adult)', 'CUFF-ADT-01',
     'Durable adult-size blood pressure cuff compatible with **SureBP**.',
     'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&q=80&auto=format&fit=crop', 1),
    ('connex-spot-monitor', 'SpO2 Finger Sensor', 'SPO2-FIN-02',
     'Reusable finger clip sensor for continuous SpO2 capture.',
     'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80&auto=format&fit=crop', 2),
    ('connex-spot-monitor', 'Mobile Cart', 'CART-MOB-03',
     'Height-adjustable mobile cart with basket and cord management.',
     'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=600&q=80&auto=format&fit=crop', 3),
    ('connex-spot-monitor', 'Thermometer Probe Covers', 'PROBE-COV-100',
     'Box of 100 disposable probe covers.',
     'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop', 4),
    ('cardioperfect-ecg', 'Patient Cable (10-lead)', 'CBL-10L-01',
     'Replacement 10-lead patient cable.',
     'https://images.unsplash.com/photo-1559757175-08fda9d44a08?w=600&q=80&auto=format&fit=crop', 1),
    ('cardioperfect-ecg', 'Tab Electrodes (pack of 500)', 'ELEC-TAB-500',
     'Disposable tab electrodes for resting ECG.',
     'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=80&auto=format&fit=crop', 2),
    ('cardioperfect-ecg', 'ECG Paper Roll', 'PPR-ECG-10',
     'Thermal recording paper, pack of 10 rolls.',
     'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop', 3)
) as v(slug, name, product_code, description, image_url, display_order)
join public.products p on p.slug = v.slug;

-- 4g. Related products -------------------------------------------------------
delete from public.related_products
where product_id in (
  select id from public.products
  where slug in ('connex-spot-monitor', 'cardioperfect-ecg')
);

insert into public.related_products (product_id, related_product_id, display_order)
select p.id, r.id, v.display_order
from (
  values
    ('connex-spot-monitor', 'vital-signs-monitor-6000', 1),
    ('connex-spot-monitor', 'rvs-100-vitals-monitor',  2),
    ('connex-spot-monitor', 'cardioperfect-ecg',       3),
    ('cardioperfect-ecg',   'ri-cardio-ecg',           1),
    ('cardioperfect-ecg',   'duplex-2-stethoscope',    2),
    ('cardioperfect-ecg',   'connex-spot-monitor',     3)
) as v(slug, related_slug, display_order)
join public.products p on p.slug = v.slug
join public.products r on r.slug = v.related_slug
on conflict (product_id, related_product_id) do nothing;

-- ============================================================================
-- 5. Subcategories (requires migration 0003) + assignment to products.
-- ============================================================================
insert into public.subcategories (category_id, name, slug, display_order)
select c.id, v.name, v.slug, v.display_order
from (
  values
    ('patient-monitoring', 'Vital Signs Monitors', 'vital-signs-monitors', 1),
    ('patient-monitoring', 'Spot-Check Monitors',  'spot-check-monitors',  2),
    ('cardio-diagnostics', 'ECG Systems',          'ecg-systems',          1),
    ('cardio-diagnostics', 'Stethoscopes',         'stethoscopes',         2)
) as v(category_slug, name, slug, display_order)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do update
  set name = excluded.name,
      category_id = excluded.category_id,
      display_order = excluded.display_order;

-- Assign products to subcategories (by slug).
update public.products p
set subcategory_id = s.id
from public.subcategories s
where s.slug = case p.slug
    when 'connex-spot-monitor'      then 'spot-check-monitors'
    when 'vital-signs-monitor-6000' then 'vital-signs-monitors'
    when 'rvs-100-vitals-monitor'   then 'vital-signs-monitors'
    when 'cardioperfect-ecg'        then 'ecg-systems'
    when 'ri-cardio-ecg'            then 'ecg-systems'
    when 'duplex-2-stethoscope'     then 'stethoscopes'
    else null
  end;
