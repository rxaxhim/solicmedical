/*
 * One-time bulk upload of local product images + PDFs to Supabase Storage.
 * Reads credentials from .env.local (NEXT_PUBLIC_SUPABASE_URL +
 * SUPABASE_SERVICE_ROLE_KEY). Writes scripts/upload_map.json mapping each
 * source local_path -> public Storage URL, consumed by gen_seed.js.
 *
 * Run from the project root:  node scripts/upload_assets.js
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const DATA_ROOT = "C:/Users/ghori/Downloads/solic-product-data";
const PRODUCTS = require(path.join(DATA_ROOT, "solic_data", "products_full.json"));

// --- env ---
const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false },
});

const CONTENT_TYPE = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

function absOf(localPath) {
  return path.join(DATA_ROOT, localPath.replace(/\\/g, "/"));
}

async function uploadOne(bucket, slug, entry) {
  const localPath = entry.local_path;
  if (!localPath) return null;
  const abs = absOf(localPath);
  if (!fs.existsSync(abs)) {
    console.warn("  ! missing file:", abs);
    return null;
  }
  const ext = path.extname(entry.filename || abs).toLowerCase();
  const dest = `${slug}/${entry.filename}`;
  const body = fs.readFileSync(abs);
  const { error } = await supabase.storage.from(bucket).upload(dest, body, {
    contentType: CONTENT_TYPE[ext] || "application/octet-stream",
    upsert: true,
  });
  if (error) {
    console.warn(`  ! upload failed (${dest}):`, error.message);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(dest);
  return data.publicUrl;
}

(async () => {
  const map = { images: {}, docs: {} };
  let imgN = 0,
    docN = 0;

  for (const p of PRODUCTS) {
    process.stdout.write(`\n${p.slug}: `);

    for (const img of p.local_images || []) {
      const url = await uploadOne("product-images", p.slug, img);
      if (url) {
        map.images[img.local_path] = url;
        imgN++;
        process.stdout.write("i");
      }
    }
    for (const d of [...(p.brochures || []), ...(p.manuals || [])]) {
      const url = await uploadOne("product-docs", p.slug, d);
      if (url) {
        map.docs[d.local_path] = url;
        docN++;
        process.stdout.write("d");
      }
    }
  }

  const outPath = path.join("scripts", "upload_map.json");
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2));
  console.log(`\n\nDone. Uploaded ${imgN} images, ${docN} docs.`);
  console.log("Map written to", outPath);
})();
