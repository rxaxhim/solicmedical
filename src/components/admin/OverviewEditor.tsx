"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { revalidateCatalogue } from "@/app/admin/actions";
import AdminSection from "./AdminSection";
import RichTextEditor from "./RichTextEditor";

export default function OverviewEditor({
  productId,
  productSlug,
  initial,
}: {
  productId: string;
  productSlug: string;
  initial: string | null;
}) {
  const [content, setContent] = useState(initial ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);
    const { error } = await supabase
      .from("product_overview")
      .upsert(
        { product_id: productId, content },
        { onConflict: "product_id" },
      );
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSaved(true);
    await revalidateCatalogue(productSlug);
  }

  return (
    <AdminSection
      title="Overview"
      description="Markdown supported (headings, lists, tables, links)."
    >
      {error && (
        <p className="mb-4 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {error}
        </p>
      )}
      <RichTextEditor
        minHeight="400px"
        value={content}
        onChange={(v) => {
          setContent(v);
          setSaved(false);
        }}
        placeholder="Describe the product…"
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save overview"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved.</span>}
      </div>
    </AdminSection>
  );
}
