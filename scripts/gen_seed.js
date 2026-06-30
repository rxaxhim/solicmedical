/*
 * Generates supabase/seed_products.sql from products_full.json.
 * If scripts/upload_map.json exists, product images and document URLs point to
 * Supabase Storage; otherwise images are skipped and docs fall back to the
 * original solicmedical.com URLs.
 *
 * Run from the project root:  node scripts/gen_seed.js
 */
const fs = require("fs");
const path = require("path");

const DATA_ROOT = "C:/Users/ghori/Downloads/solic-product-data";
const data = require(path.join(DATA_ROOT, "solic_data", "products_full.json"));

let UPLOAD = { images: {}, docs: {} };
const mapPath = path.join("scripts", "upload_map.json");
if (fs.existsSync(mapPath)) {
  UPLOAD = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  console.log(
    `Using upload_map.json (${Object.keys(UPLOAD.images).length} images, ${Object.keys(UPLOAD.docs).length} docs).`,
  );
} else {
  console.log("No upload_map.json — images skipped, docs use original URLs.");
}

const MAP = {
  "im3s-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im3-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im50-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im50-monitor-nellcor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "x10-patient-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "x8-patient-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "x12-patient-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im60-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im60-monitor-nellcor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im70-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im70-monitor-nellcor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im80-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "im80-monitor-nellcor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "m3-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "m3-monitor-nellcor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "m3a-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "m3b-monitor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "m3b-monitor-nellcor": ["patient-monitoring", "patient-monitoring-continuous-monitoring"],
  "finger-pulse-oximeter": ["patient-monitoring", "patient-monitoring-pulse-oximeters"],
  "hand-held-pulse-oximeter": ["patient-monitoring", "patient-monitoring-pulse-oximeters"],
  "mobile-rolling-stand": ["patient-monitoring", "patient-monitoring-trolleys-rolling-stands"],
  "wall-mount": ["patient-monitoring", "patient-monitoring-trolleys-rolling-stands"],
  "bedrail-clamps": ["patient-monitoring", "patient-monitoring-trolleys-rolling-stands"],
  "sa-10-ambulatory-bp-monitor": ["cardio-diagnostics", "cardio-diagnostics-abpm"],
  "se-1202-resting-ecg": ["cardio-diagnostics", "cardio-diagnostics-resting-ecg"],
  "se-1200-resting-ecg": ["cardio-diagnostics", "cardio-diagnostics-resting-ecg"],
  "se-12-resting-stress-ecg": ["cardio-diagnostics", "cardio-diagnostics-resting-ecg"],
  "se-1515-resting-pc-ecg": ["cardio-diagnostics", "cardio-diagnostics-resting-ecg"],
  "se-301-3-channel-portable-ecg": ["cardio-diagnostics", "cardio-diagnostics-resting-ecg"],
  "se-601c-ecg": ["cardio-diagnostics", "cardio-diagnostics-resting-ecg"],
  "se-1515-stress-pc-ecg": ["cardio-diagnostics", "cardio-diagnostics-stress-ecg"],
  "se2003-7d-holter": ["cardio-diagnostics", "cardio-diagnostics-holter-system"],
  "sd3-doppler-vascular": ["cardio-diagnostics", "cardio-diagnostics-vascular-doppler"],
  "sonotrax-series-doppler-vascular": ["cardio-diagnostics", "cardio-diagnostics-vascular-doppler"],
  "f6-fetal-monitor": ["ob-gyn", "ob-gyn-fetal-maternal-monitors"],
  "f9-fetal-monitor": ["ob-gyn", "ob-gyn-fetal-maternal-monitors"],
  "sd3-doppler-fetal": ["ob-gyn", "ob-gyn-fetal-ultrasonic-doppler"],
  "sonotrax-series-doppler-fetal": ["ob-gyn", "ob-gyn-fetal-ultrasonic-doppler"],
  "colposcope": ["ob-gyn", "ob-gyn-video-colposcope"],
  "therapy-table": ["exam-room-furniture", "exam-room-furniture-exam-beds-power-tables"],
  "basic-exam-tables": ["exam-room-furniture", "exam-room-furniture-exam-beds-power-tables"],
  "power-tables": ["exam-room-furniture", "exam-room-furniture-exam-beds-power-tables"],
  "medlife-frontstep-exam-tables": ["exam-room-furniture", "exam-room-furniture-exam-beds-power-tables"],
  "medlife-sidestep-exam-tables": ["exam-room-furniture", "exam-room-furniture-exam-beds-power-tables"],
  "medlife-exam-stools": ["exam-room-furniture", "exam-room-furniture-exam-room-accessories"],
  "blood-drawing-chair": ["exam-room-furniture", "exam-room-furniture-exam-room-accessories"],
  "phlebotomy-arm-wedge": ["exam-room-furniture", "exam-room-furniture-exam-room-accessories"],
  "infanometer-baby-scale": ["exam-room-furniture", "exam-room-furniture-exam-room-accessories"],
  "stadiometer": ["exam-room-furniture", "exam-room-furniture-exam-room-accessories"],
  "iv-pole": ["exam-room-furniture", "exam-room-furniture-exam-room-accessories"],
  "mayo-stand": ["exam-room-furniture", "exam-room-furniture-exam-room-accessories"],
  "utility-carts": ["exam-room-furniture", "exam-room-furniture-crash-carts-utility-carts"],
  "stainless-steel-carts": ["exam-room-furniture", "exam-room-furniture-crash-carts-utility-carts"],
  "emscrash-carts-f-45-1": ["exam-room-furniture", "exam-room-furniture-crash-carts-utility-carts"],
  "emscrash-carts-j101": ["exam-room-furniture", "exam-room-furniture-crash-carts-utility-carts"],
  "emscrash-carts-nj801": ["exam-room-furniture", "exam-room-furniture-crash-carts-utility-carts"],
  "cpr-spinal-board": ["exam-room-furniture", "exam-room-furniture-transport-recovery-stretchers"],
  "foldable-stretcher": ["exam-room-furniture", "exam-room-furniture-transport-recovery-stretchers"],
  "stairs-stretcher-chair": ["exam-room-furniture", "exam-room-furniture-transport-recovery-stretchers"],
  "emergency-transport-stretcher": ["exam-room-furniture", "exam-room-furniture-transport-recovery-stretchers"],
  "recovery-stretcher": ["exam-room-furniture", "exam-room-furniture-transport-recovery-stretchers"],
  "led-flexbrite-ii-spotlight": ["exam-room-furniture", "exam-room-furniture-medical-exam-lights"],
  "uv-exam-light": ["exam-room-furniture", "exam-room-furniture-medical-exam-lights"],
  "u50-ultrasound-system": ["ultrasounds", "ultrasounds-u-series"],
  "u60-compact-ultrasound-system": ["ultrasounds", "ultrasounds-u-series"],
  "ax-3ax-2-acclarix-compact-ultrasound": ["ultrasounds", "ultrasounds-ax-series"],
  "ax-8-acclarix-diagnostic-ultrasound": ["ultrasounds", "ultrasounds-ax-series"],
  "fiber-optic-laryngoscope-with-4-blades": ["others", "others-laryngoscope"],
  "im60-vet-monitor": ["animal-care", "animal-care-patient-monitors"],
  "im60-vet-monitor-nellcor": ["animal-care", "animal-care-patient-monitors"],
  "im70-vet-monitor": ["animal-care", "animal-care-patient-monitors"],
  "im70-vet-monitor-nellcor": ["animal-care", "animal-care-patient-monitors"],
  "veterinary-pulse-oximeter": ["animal-care", "animal-care-pulse-oximeter"],
  "veterinary-ecg": ["animal-care", "animal-care-ecg"],
  "u50pvet-vet-prime-ultrasound": ["animal-care", "animal-care-ultrasound"],
  "u60pvet-vet-prime-ultrasound": ["animal-care", "animal-care-ultrasound"],
  "acclarix-diagnostic-ultrasound-system": ["animal-care", "animal-care-ultrasound"],
};

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const qn = (s) => (s == null || String(s).trim() === "" ? "null" : q(String(s).trim()));
const dollar = (s) => "$md$" + s + "$md$";
const clip = (s, n) => {
  s = String(s).trim();
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
};

function shortDesc(p) {
  if (p.description && p.description.trim()) return clip(p.description, 240);
  if (p.description_bullets && p.description_bullets.length) return clip(p.description_bullets[0], 240);
  return clip(p.title || p.name, 240);
}
function overview(p) {
  const parts = [];
  if (p.description && p.description.trim()) parts.push(p.description.trim());
  if (p.description_bullets && p.description_bullets.length)
    parts.push(p.description_bullets.map((b) => `- ${b}`).join("\n"));
  const specs = p.specifications || {};
  const keys = Object.keys(specs);
  if (keys.length) {
    let t = "## Specifications\n\n| Specification | Value |\n| --- | --- |\n";
    t += keys.map((k) => `| ${k} | ${String(specs[k]).replace(/\|/g, "\\|")} |`).join("\n");
    parts.push(t);
  }
  return parts.join("\n\n").trim();
}

// --- Accessory categories (normalize typos / near-duplicates) ---------------
const ACC_CAT_NORMALIZE = {
  NIPB: "NIBP",
  Transducer: "Transducers",
  "ECG Cable & Accessories": "ECG Cables",
  "ECG Cables & Accessories": "ECG Cables",
  "Data Maganement": "Data Management",
  Others: "Other Accessories",
  Accessories: "Other Accessories",
  Trolley: "Trolleys & Bags",
};
const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const normCat = (raw) => {
  const t = (raw || "Other Accessories").trim();
  return ACC_CAT_NORMALIZE[t] || t;
};

// Collect distinct accessory categories in order of first appearance.
const accCats = [];
const accCatSlugs = new Map(); // name -> slug
for (const p of data) {
  for (const g of p.accessories || []) {
    const name = normCat(g.subcategory);
    if (!accCatSlugs.has(name)) {
      const slug = slugify(name);
      accCatSlugs.set(name, slug);
      accCats.push({ name, slug });
    }
  }
}

const out = [];
out.push("-- Auto-generated from products_full.json. Seeds 77 products.");
out.push("-- Requires categories_reset.sql and migration 0004 to have run first.");
out.push("begin;");
out.push("");
out.push("-- Accessory categories (reusable global list).");
out.push(
  "insert into public.accessory_categories (name, slug, display_order) values\n" +
    accCats
      .map((c, i) => `  (${q(c.name)}, ${q(c.slug)}, ${i})`)
      .join(",\n") +
    "\non conflict (slug) do nothing;",
);
out.push("");
out.push("delete from public.products;");
out.push("");

const seen = new Set();
for (const p of data) {
  const m = MAP[p.slug];
  if (!m) continue;
  let slug = p.slug;
  if (seen.has(slug)) slug = slug + "-" + Math.random().toString(36).slice(2, 5);
  seen.add(slug);

  const [cat, sub] = m;
  const name = (p.title && p.title.trim()) || p.name;
  const modelCode = p.configurations && p.configurations[0] ? p.configurations[0].code : null;

  out.push(`-- ${name} [${cat} / ${sub}]`);
  out.push(
    `insert into public.products (name, slug, model_code, description, category_id, subcategory_id, brand, featured, display_order)\n` +
      `values (${q(name)}, ${q(slug)}, ${qn(modelCode)}, ${qn(shortDesc(p))}, ` +
      `(select id from public.categories where slug=${q(cat)}), ` +
      `(select id from public.subcategories where slug=${q(sub)}), ` +
      `null, false, 0);`,
  );

  const pid = `(select id from public.products where slug=${q(slug)})`;

  // images (from upload map only; first = primary)
  let imgOrder = 0;
  for (const img of p.local_images || []) {
    const url = UPLOAD.images[img.local_path];
    if (!url) continue;
    out.push(
      `insert into public.product_images (product_id, image_url, alt_text, is_primary, display_order) ` +
        `values (${pid}, ${q(url)}, ${q(name)}, ${imgOrder === 0}, ${imgOrder});`,
    );
    imgOrder++;
  }

  const ov = overview(p);
  if (ov) out.push(`insert into public.product_overview (product_id, content) values (${pid}, ${dollar(ov)});`);

  (p.configurations || []).forEach((c, i) => {
    const cname = (c.code && c.code.trim()) || `Configuration ${i + 1}`;
    out.push(
      `insert into public.product_configurations (product_id, config_name, config_details, display_order) ` +
        `values (${pid}, ${q(cname)}, ${qn(c.description)}, ${i});`,
    );
  });

  let docOrder = 0;
  const docRows = [
    ...(p.brochures || []).map((b) => ["brochure", b]),
    ...(p.manuals || []).map((b) => ["manual", b]),
  ];
  for (const [type, b] of docRows) {
    const title = (b.title && b.title.trim()) || b.filename || (type === "manual" ? "Manual" : "Brochure");
    const url = UPLOAD.docs[b.local_path] || encodeURI(b.url);
    if (!url) continue;
    out.push(
      `insert into public.product_documents (product_id, title, pdf_url, document_type, display_order) ` +
        `values (${pid}, ${q(title)}, ${q(url)}, '${type}', ${docOrder++});`,
    );
  }

  let accOrder = 0;
  for (const g of p.accessories || []) {
    const catName = normCat(g.subcategory);
    const catSlug = accCatSlugs.get(catName);
    const catSub = `(select id from public.accessory_categories where slug=${q(catSlug)})`;
    const note = g.note && g.note.trim() ? g.note.trim() : null;
    for (const it of g.items || []) {
      const aname = (it.description && it.description.trim()) || it.code || "Accessory";
      out.push(
        `insert into public.accessories (product_id, name, product_code, description, image_url, accessory_category_id, display_order) ` +
          `values (${pid}, ${q(clip(aname, 300))}, ${qn(it.code)}, ${qn(note)}, null, ${catSub}, ${accOrder++});`,
      );
    }
  }

  out.push("");
}
out.push("commit;");

const target = path.join("supabase", "seed_products.sql");
fs.writeFileSync(target, out.join("\n"), "utf8");
console.log("Wrote", target, "with", seen.size, "products.");
