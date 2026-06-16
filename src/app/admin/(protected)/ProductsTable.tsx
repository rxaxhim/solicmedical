"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { revalidateCatalogue } from "@/app/admin/actions";

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  modelCode: string | null;
  brand: string | null;
  featured: boolean;
  categoryName: string | null;
}

export default function ProductsTable({
  products,
}: {
  products: AdminProductRow[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.modelCode ?? "").toLowerCase().includes(q) ||
      (p.brand ?? "").toLowerCase().includes(q) ||
      (p.categoryName ?? "").toLowerCase().includes(q)
    );
  });

  async function handleDelete(p: AdminProductRow) {
    if (
      !window.confirm(
        `Delete "${p.name}"? This also removes its images, documents, and other content. This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleting(p.id);
    setError(null);
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    setDeleting(null);
    if (error) {
      setError(`Failed to delete "${p.name}": ${error.message}`);
      return;
    }
    await revalidateCatalogue(p.slug);
    router.refresh();
  }

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, model code, brand…"
          className="w-full rounded-md border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-navy-400 focus:outline-none focus:ring-1 focus:ring-navy-400"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-accent-50 px-4 py-3 text-sm text-accent-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-navy-500">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Model code</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Brand</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${p.slug}`}
                      className="font-medium text-navy-900 hover:text-accent-600"
                    >
                      {p.name}
                    </Link>
                    <span className="block text-xs text-navy-400">{p.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-navy-600">
                    {p.modelCode ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-navy-600">
                    {p.categoryName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-navy-600">{p.brand ?? "—"}</td>
                  <td className="px-4 py-3">
                    {p.featured ? (
                      <span className="inline-flex items-center gap-1 text-accent-600">
                        <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-navy-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${p.slug}`}
                        className="inline-flex items-center gap-1.5 text-navy-600 hover:text-navy-900"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
                        className="inline-flex items-center gap-1.5 text-accent-600 hover:text-accent-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting === p.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
