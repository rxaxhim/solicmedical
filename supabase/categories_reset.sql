-- ============================================================================
-- Replace ALL categories and subcategories with the official taxonomy.
-- Run in the Supabase SQL Editor.
--
-- Strategy (pooler-safe, no temp tables):
--   * Categories are UPSERTED by slug, so any existing category with a matching
--     slug keeps its id — and products stay linked to it automatically.
--   * Categories whose slug is NOT in the new set are deleted (their products'
--     category_id is cleared via the FK).
--   * Subcategories are fully replaced; products' subcategory_id is cleared and
--     should be reassigned in the admin panel.
-- ============================================================================
begin;

-- 1. Upsert the new main categories (existing slugs keep their id).
insert into public.categories (name, slug, display_order) values
  ('Patient Monitoring',  'patient-monitoring',  1),
  ('Cardio Diagnostics',  'cardio-diagnostics',  2),
  ('OB & GYN',            'ob-gyn',              3),
  ('Exam Room Furniture', 'exam-room-furniture', 4),
  ('Ultrasounds',         'ultrasounds',         5),
  ('ENT',             'ent',             6),
  ('Others',              'others',              7),
  ('Animal Care',         'animal-care',         8)
on conflict (slug) do update
  set name = excluded.name,
      display_order = excluded.display_order;

-- 2. Remove any categories that are not part of the new taxonomy.
delete from public.categories
where slug not in (
  'patient-monitoring', 'cardio-diagnostics', 'ob-gyn', 'exam-room-furniture',
  'ultrasounds', 'ent', 'others', 'animal-care'
);

-- 3. Replace all subcategories (slug = "<category-slug>-<name-slug>").
delete from public.subcategories;

insert into public.subcategories (category_id, name, slug, display_order)
select c.id, v.name, v.slug, v.display_order
from (values
  -- Patient Monitoring
  ('patient-monitoring', 'Spot Vital Signs Monitor',  'patient-monitoring-spot-vital-signs-monitor', 1),
  ('patient-monitoring', 'Continuous Monitoring',     'patient-monitoring-continuous-monitoring',    2),
  ('patient-monitoring', 'Pulse Oximeters',           'patient-monitoring-pulse-oximeters',          3),
  ('patient-monitoring', 'Data Management System',    'patient-monitoring-data-management-system',   4),
  ('patient-monitoring', 'Trolleys & Rolling Stands', 'patient-monitoring-trolleys-rolling-stands',  5),

  -- Cardio Diagnostics
  ('cardio-diagnostics', 'Resting ECG',               'cardio-diagnostics-resting-ecg',               1),
  ('cardio-diagnostics', 'Stress ECG',                'cardio-diagnostics-stress-ecg',                2),
  ('cardio-diagnostics', 'Vascular Doppler',          'cardio-diagnostics-vascular-doppler',          3),
  ('cardio-diagnostics', 'Holter System',             'cardio-diagnostics-holter-system',             4),
  ('cardio-diagnostics', 'ABPM',                      'cardio-diagnostics-abpm',                      5),
  ('cardio-diagnostics', 'ECG Work Stations',         'cardio-diagnostics-ecg-work-stations',         6),
  ('cardio-diagnostics', 'Central Monitoring Station','cardio-diagnostics-central-monitoring-station',7),
  ('cardio-diagnostics', 'Trolleys & Rolling Stands', 'cardio-diagnostics-trolleys-rolling-stands',   8),

  -- OB & GYN
  ('ob-gyn', 'Fetal & Maternal Monitors',  'ob-gyn-fetal-maternal-monitors',   1),
  ('ob-gyn', 'Fetal Ultrasonic Doppler',   'ob-gyn-fetal-ultrasonic-doppler',  2),
  ('ob-gyn', 'Video Colposcope',           'ob-gyn-video-colposcope',          3),
  ('ob-gyn', 'Fetal Telemetry',            'ob-gyn-fetal-telemetry',           4),
  ('ob-gyn', 'Central Monitoring Station', 'ob-gyn-central-monitoring-station',5),
  ('ob-gyn', 'Trolleys & Rolling Stands',  'ob-gyn-trolleys-rolling-stands',   6),

  -- Exam Room Furniture
  ('exam-room-furniture', 'Exam Beds & Power Tables',       'exam-room-furniture-exam-beds-power-tables',       1),
  ('exam-room-furniture', 'Crash Carts & Utility Carts',    'exam-room-furniture-crash-carts-utility-carts',    2),
  ('exam-room-furniture', 'Transport & Recovery Stretchers','exam-room-furniture-transport-recovery-stretchers',3),
  ('exam-room-furniture', 'Exam Room Accessories',          'exam-room-furniture-exam-room-accessories',        4),
  ('exam-room-furniture', 'Medical Exam Lights',            'exam-room-furniture-medical-exam-lights',          5),

  -- Ultrasounds
  ('ultrasounds', 'U Series',                  'ultrasounds-u-series',                  1),
  ('ultrasounds', 'AX Series',                 'ultrasounds-ax-series',                 2),
  ('ultrasounds', 'Trolleys & Rolling Stands', 'ultrasounds-trolleys-rolling-stands',   3),

  -- ENT
  ('ent', 'Diagnostic Stations',        'ent-diagnostic-stations',        1),
  ('ent', 'ENT',                        'ent-ent',                        2),
  ('ent', 'Blood Pressure Management',  'ent-blood-pressure-management',  3),
  ('ent', 'Stethoscopes',               'ent-stethoscopes',               4),
  ('ent', 'Thermometry',                'ent-thermometry',                5),
  ('ent', 'Medical Lights',             'ent-medical-lights',             6),

  -- Others
  ('others', 'Laryngoscope', 'others-laryngoscope', 1),
  ('others', 'Dispensers',   'others-dispensers',   2),
  ('others', 'Thermometers', 'others-thermometers', 3),

  -- Animal Care
  ('animal-care', 'Patient Monitors', 'animal-care-patient-monitors', 1),
  ('animal-care', 'Pulse Oximeter',   'animal-care-pulse-oximeter',   2),
  ('animal-care', 'ECG',              'animal-care-ecg',              3),
  ('animal-care', 'Ultrasound',       'animal-care-ultrasound',       4),
  ('animal-care', 'Diagnostic Set',   'animal-care-diagnostic-set',   5)
) as v(category_slug, name, slug, display_order)
join public.categories c on c.slug = v.category_slug;

commit;
