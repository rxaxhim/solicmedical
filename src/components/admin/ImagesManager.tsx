"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Star, Trash2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile, BUCKETS } from "@/lib/admin/storage";
import { revalidateCatalogue } from "@/app/admin/actions";
import type { ProductImage } from "@/lib/products";
import AdminSection from "./AdminSection";

export default function ImagesManager({
  productId,
  productSlug,
  initial,
}: {
  productId: string;
  productSlug: string;
  initial: ProductImage[];
}) {
  const [items, setItems] = useState<ProductImage[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      const added: ProductImage[] = [];
      for (const file of files) {
        const url = await uploadFile(BUCKETS.productImages, productId, file);
        const isPrimary = items.length === 0 && added.length === 0;
        const { data, error } = await supabase
          .from("product_images")
          .insert({
            product_id: productId,
            image_url: url,
            alt_text: "",
            is_primary: isPrimary,
            display_order: items.length + added.length,
          })
          .select("id, image_url, alt_text, is_primary, display_order")
          .single();
        if (error) throw error;
        added.push(data as ProductImage);
      }
      setItems((prev) => [...prev, ...added]);
      await revalidateCatalogue(productSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function makePrimary(id: string) {
    setError(null);
    const prev = items;
    setItems((it) => it.map((i) => ({ ...i, is_primary: i.id === id })));
    const { error: e1 } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
    const { error: e2 } = await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", id);
    if (e1 || e2) {
      setItems(prev);
      setError((e1 ?? e2)!.message);
      return;
    }
    await revalidateCatalogue(productSlug);
  }

  async function patch(id: string, fields: Partial<ProductImage>) {
    setItems((it) => it.map((i) => (i.id === id ? { ...i, ...fields } : i)));
    const { error } = await supabase
      .from("product_images")
      .update(fields)
      .eq("id", id);
    if (error) setError(error.message);
    else await revalidateCatalogue(productSlug);
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this image?")) return;
    setError(null);
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((it) => it.filter((i) => i.id !== id));
    await revalidateCatalogue(productSlug);
  }

  return (
    <AdminSection
      title="Images"
      description="The image marked primary is used on cards and as the main gallery image."
    >
      {error && (
        <p className="mb-4 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {error}
        </p>
      )}

      {items.length > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-lg border border-border"
            >
              <div className="relative aspect-square bg-muted">
                <Image
                  src={img.image_url}
                  alt={img.alt_text || "Product image"}
                  fill
                  sizes="200px"
                  className="object-contain p-3"
                />
                {img.is_primary && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-navy-800 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    <Star className="h-3 w-3 fill-white" />
                    Primary
                  </span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <input
                  defaultValue={img.alt_text ?? ""}
                  placeholder="Alt text"
                  onBlur={(e) => {
                    if (e.target.value !== (img.alt_text ?? ""))
                      patch(img.id, { alt_text: e.target.value });
                  }}
                  className="input py-1.5 text-xs"
                />
                <div className="flex items-center justify-between">
                  {!img.is_primary ? (
                    <button
                      type="button"
                      onClick={() => makePrimary(img.id)}
                      className="text-xs font-medium text-navy-600 hover:text-navy-900"
                    >
                      Set primary
                    </button>
                  ) : (
                    <span className="text-xs text-navy-300">Primary</span>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(img.id)}
                    aria-label="Delete image"
                    className="text-accent-600 hover:text-accent-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-navy-300 px-4 py-2.5 text-sm font-medium text-navy-700 hover:border-navy-500 hover:bg-muted">
        <Upload className="h-4 w-4" />
        {busy ? "Uploading…" : "Upload image(s)"}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onAdd}
          disabled={busy}
          className="hidden"
        />
      </label>
    </AdminSection>
  );
}
