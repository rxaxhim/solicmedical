"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageOff, Plus, RefreshCw, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile, BUCKETS } from "@/lib/admin/storage";
import { revalidateCatalogue } from "@/app/admin/actions";
import type { Accessory } from "@/lib/products";
import AdminSection from "./AdminSection";
import MarkdownField from "./MarkdownField";

export default function AccessoriesManager({
  productId,
  productSlug,
  initial,
}: {
  productId: string;
  productSlug: string;
  initial: Accessory[];
}) {
  const [items, setItems] = useState<Accessory[]>(initial);
  const [name, setName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter an accessory name.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      let imageUrl: string | null = null;
      const file = fileRef.current?.files?.[0];
      if (file) {
        imageUrl = await uploadFile(BUCKETS.productImages, productId, file);
      }
      const { data, error } = await supabase
        .from("accessories")
        .insert({
          product_id: productId,
          name: name.trim(),
          product_code: productCode.trim() || null,
          description: description.trim() || null,
          image_url: imageUrl,
          display_order: items.length,
        })
        .select("id, name, product_code, description, image_url, display_order")
        .single();
      if (error) throw error;
      setItems((it) => [...it, data as Accessory]);
      setName("");
      setProductCode("");
      setDescription("");
      if (fileRef.current) fileRef.current.value = "";
      await revalidateCatalogue(productSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add accessory.");
    } finally {
      setBusy(false);
    }
  }

  function edit(id: string, fields: Partial<Accessory>) {
    setItems((it) => it.map((i) => (i.id === id ? { ...i, ...fields } : i)));
  }

  async function save(item: Accessory) {
    setSavingId(item.id);
    setError(null);
    const { error } = await supabase
      .from("accessories")
      .update({
        name: item.name,
        product_code: item.product_code,
        description: item.description,
      })
      .eq("id", item.id);
    setSavingId(null);
    if (error) setError(error.message);
    else await revalidateCatalogue(productSlug);
  }

  async function replaceImage(item: Accessory, file: File) {
    setReplacingId(item.id);
    setError(null);
    try {
      const url = await uploadFile(BUCKETS.productImages, productId, file);
      const { error } = await supabase
        .from("accessories")
        .update({ image_url: url })
        .eq("id", item.id);
      if (error) throw error;
      edit(item.id, { image_url: url });
      await revalidateCatalogue(productSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to replace image.");
    } finally {
      setReplacingId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this accessory?")) return;
    const { error } = await supabase.from("accessories").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((it) => it.filter((i) => i.id !== id));
    await revalidateCatalogue(productSlug);
  }

  return (
    <AdminSection title="Parts & Accessories">
      {error && (
        <p className="mb-4 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {error}
        </p>
      )}

      <div className="mb-5 space-y-4">
        {items.map((a) => (
          <div key={a.id} className="flex gap-4 rounded-md border border-border p-4">
            <div className="flex-none">
              <div className="relative h-24 w-24 overflow-hidden rounded-md bg-muted">
                {a.image_url ? (
                  <Image
                    src={a.image_url}
                    alt={a.name}
                    fill
                    sizes="96px"
                    className="object-contain p-1.5"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-navy-200">
                    <ImageOff className="h-6 w-6" />
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => replaceRefs.current[a.id]?.click()}
                disabled={replacingId === a.id}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-900 disabled:opacity-60"
              >
                <RefreshCw className="h-3 w-3" />
                {replacingId === a.id ? "Uploading…" : "Replace"}
              </button>
              <input
                ref={(el) => {
                  replaceRefs.current[a.id] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) replaceImage(a, f);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={a.name}
                  onChange={(e) => edit(a.id, { name: e.target.value })}
                  placeholder="Name"
                  className="input font-medium"
                />
                <input
                  value={a.product_code ?? ""}
                  onChange={(e) => edit(a.id, { product_code: e.target.value })}
                  placeholder="Product code"
                  className="input"
                />
              </div>
              <MarkdownField
                rows={2}
                value={a.description ?? ""}
                onChange={(v) => edit(a.id, { description: v })}
                placeholder="Description"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => save(a)}
                  disabled={savingId === a.id}
                  className="btn-ghost px-4 py-2 text-sm disabled:opacity-60"
                >
                  {savingId === a.id ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="inline-flex items-center gap-1.5 text-sm text-accent-600 hover:text-accent-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={add}
        className="space-y-3 rounded-md border border-dashed border-border p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Accessory name"
            className="input"
          />
          <input
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="Product code (optional)"
            className="input"
          />
        </div>
        <MarkdownField
          rows={2}
          value={description}
          onChange={setDescription}
          placeholder="Description (optional)"
        />
        <input ref={fileRef} type="file" accept="image/*" className="text-sm" />
        <button
          type="submit"
          disabled={busy}
          className="btn-ghost inline-flex px-4 py-2 text-sm disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {busy ? "Adding…" : "Add accessory"}
        </button>
      </form>
    </AdminSection>
  );
}
