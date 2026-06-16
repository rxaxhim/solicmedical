// ============================================================================
// Storage upload helpers (admin, client-side).
// Uploads go to the public buckets created in migration 0001 and rely on the
// "authenticated write" storage policies, so the admin must be signed in.
// ============================================================================
import { supabase } from "@/lib/supabase";

export const BUCKETS = {
  productImages: "product-images",
  productDocs: "product-docs",
  categoryImages: "category-images",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

function safeExt(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]{1,5}$/.test(ext) ? `.${ext}` : "";
}

/**
 * Uploads a file to `bucket` under `prefix/<uuid><ext>` and returns its public
 * URL. Throws on failure.
 */
export async function uploadFile(
  bucket: BucketName,
  prefix: string,
  file: File,
): Promise<string> {
  const path = `${prefix}/${crypto.randomUUID()}${safeExt(file.name)}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
