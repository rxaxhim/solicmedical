"use client";

import { useState } from "react";
import { Plus, Trash2, Youtube } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { revalidateCatalogue } from "@/app/admin/actions";
import { youtubeId, type ProductVideo } from "@/lib/products";
import AdminSection from "./AdminSection";

export default function VideosManager({
  productId,
  productSlug,
  initial,
}: {
  productId: string;
  productSlug: string;
  initial: ProductVideo[];
}) {
  const [items, setItems] = useState<ProductVideo[]>(initial);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError("Enter both a title and a YouTube URL.");
      return;
    }
    if (!youtubeId(url.trim())) {
      setError("That doesn't look like a valid YouTube URL.");
      return;
    }
    setBusy(true);
    setError(null);
    const { data, error } = await supabase
      .from("product_videos")
      .insert({
        product_id: productId,
        title: title.trim(),
        youtube_url: url.trim(),
        display_order: items.length,
      })
      .select("id, title, youtube_url, display_order")
      .single();
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((it) => [...it, data as ProductVideo]);
    setTitle("");
    setUrl("");
    await revalidateCatalogue(productSlug);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this video?")) return;
    const { error } = await supabase
      .from("product_videos")
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
    <AdminSection title="Videos" description="YouTube links shown under Education & Documentation.">
      {error && (
        <p className="mb-4 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {error}
        </p>
      )}

      {items.length > 0 && (
        <ul className="mb-5 divide-y divide-border rounded-md border border-border">
          {items.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-4 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <Youtube className="h-5 w-5 flex-none text-navy-400" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy-900">{v.title}</p>
                  <a
                    href={v.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-xs text-navy-400 hover:text-accent-600"
                  >
                    {v.youtube_url}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(v.id)}
                aria-label="Delete video"
                className="flex-none text-accent-600 hover:text-accent-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="space-y-3 rounded-md border border-dashed border-border p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video title"
          className="input"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          className="input"
        />
        <button
          type="submit"
          disabled={busy}
          className="btn-ghost inline-flex px-4 py-2 text-sm disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {busy ? "Adding…" : "Add video"}
        </button>
      </form>
    </AdminSection>
  );
}
