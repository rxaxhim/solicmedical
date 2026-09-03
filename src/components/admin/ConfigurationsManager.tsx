"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { revalidateCatalogue } from "@/app/admin/actions";
import type { ProductConfiguration } from "@/lib/products";
import AdminSection from "./AdminSection";
import RichTextEditor from "./RichTextEditor";

export default function ConfigurationsManager({
  productId,
  productSlug,
  initial,
}: {
  productId: string;
  productSlug: string;
  initial: ProductConfiguration[];
}) {
  const [items, setItems] = useState<ProductConfiguration[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function add() {
    setError(null);
    const { data, error } = await supabase
      .from("product_configurations")
      .insert({
        product_id: productId,
        config_name: "New configuration",
        config_details: "",
        display_order: items.length,
      })
      .select("id, config_name, config_details, display_order")
      .single();
    if (error) {
      setError(error.message);
      return;
    }
    setItems((it) => [...it, data as ProductConfiguration]);
  }

  function edit(id: string, fields: Partial<ProductConfiguration>) {
    setItems((it) => it.map((i) => (i.id === id ? { ...i, ...fields } : i)));
  }

  async function save(item: ProductConfiguration) {
    setSavingId(item.id);
    setError(null);
    const { error } = await supabase
      .from("product_configurations")
      .update({
        config_name: item.config_name,
        config_details: item.config_details,
        display_order: item.display_order,
      })
      .eq("id", item.id);
    setSavingId(null);
    if (error) setError(error.message);
    else await revalidateCatalogue(productSlug);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this configuration?")) return;
    const { error } = await supabase
      .from("product_configurations")
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
      title="Configurations"
      description="Each configuration has a name and optional markdown details."
    >
      {error && (
        <p className="mb-4 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-md border border-border p-4">
            <input
              value={item.config_name}
              onChange={(e) => edit(item.id, { config_name: e.target.value })}
              placeholder="Configuration name"
              className="input mb-2 font-medium"
            />
            <RichTextEditor
              minHeight="162px"
              value={item.config_details ?? ""}
              onChange={(v) => edit(item.id, { config_details: v })}
              placeholder="Details"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => save(item)}
                disabled={savingId === item.id}
                className="btn-ghost px-4 py-2 text-sm disabled:opacity-60"
              >
                {savingId === item.id ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="inline-flex items-center gap-1.5 text-sm text-accent-600 hover:text-accent-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-dashed border-navy-300 px-4 py-2.5 text-sm font-medium text-navy-700 hover:border-navy-500 hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
        Add configuration
      </button>
    </AdminSection>
  );
}
