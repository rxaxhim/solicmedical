"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { revalidateCatalogue } from "@/app/admin/actions";
import AdminSection from "./AdminSection";

export interface RelatedItem {
  id: string;
  name: string;
  slug: string;
}

export default function RelatedManager({
  productId,
  productSlug,
  initial,
  candidates,
}: {
  productId: string;
  productSlug: string;
  initial: RelatedItem[];
  candidates: RelatedItem[];
}) {
  const [items, setItems] = useState<RelatedItem[]>(initial);
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = useMemo(
    () =>
      candidates.filter(
        (c) => c.id !== productId && !items.some((i) => i.id === c.id),
      ),
    [candidates, items, productId],
  );

  async function add() {
    if (!selected) return;
    const candidate = candidates.find((c) => c.id === selected);
    if (!candidate) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("related_products").insert({
      product_id: productId,
      related_product_id: selected,
      display_order: items.length,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((it) => [...it, candidate]);
    setSelected("");
    await revalidateCatalogue(productSlug);
  }

  async function remove(relatedId: string) {
    setError(null);
    const { error } = await supabase
      .from("related_products")
      .delete()
      .eq("product_id", productId)
      .eq("related_product_id", relatedId);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((it) => it.filter((i) => i.id !== relatedId));
    await revalidateCatalogue(productSlug);
  }

  return (
    <AdminSection
      title="Related Products"
      description="Shown at the bottom of the product page."
    >
      {error && (
        <p className="mb-4 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {error}
        </p>
      )}

      {items.length > 0 && (
        <ul className="mb-5 divide-y divide-border rounded-md border border-border">
          {items.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-4 p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-navy-900">{r.name}</p>
                <span className="text-xs text-navy-400">{r.slug}</span>
              </div>
              <button
                type="button"
                onClick={() => remove(r.id)}
                aria-label="Remove related product"
                className="flex-none text-accent-600 hover:text-accent-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3 rounded-md border border-dashed border-border p-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="input flex-1"
        >
          <option value="">— Select a product —</option>
          {available.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          disabled={busy || !selected}
          className="btn-ghost inline-flex flex-none px-4 py-2 text-sm disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </AdminSection>
  );
}
