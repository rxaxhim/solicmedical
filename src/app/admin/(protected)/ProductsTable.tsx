"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star, Search, Layers } from "lucide-react";
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
  /** Category display_order; null for uncategorised products. */
  categoryOrder: number | null;
}

const UNCATEGORISED = "Uncategorised";

export default function ProductsTable({
  products,
}: {
  products: AdminProductRow[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Categories present, in the order the products arrive (already sorted by
  // category display_order server-side), with a count for each.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      const name = p.categoryName ?? UNCATEGORISED;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [products]);

  const filtered = products.filter((p) => {
    if (category && (p.categoryName ?? UNCATEGORISED) !== category) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.modelCode ?? "").toLowerCase().includes(q) ||
      (p.brand ?? "").toLowerCase().includes(q) ||
      (p.categoryName ?? "").toLowerCase().includes(q)
    );
  });

  // Per-group totals for the heading rows, reflecting the current filters.
  const groupCounts = new Map<string, number>();
  for (const p of filtered) {
    const name = p.categoryName ?? UNCATEGORISED;
    groupCounts.set(name, (groupCounts.get(name) ?? 0) + 1);
  }

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
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[16rem] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, model code, brand…"
            className="w-full rounded-md border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-navy-400 focus:outline-none focus:ring-1 focus:ring-navy-400"
          />
        </div>

        <div className="relative">
          <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="View by category"
            className="w-full appearance-none rounded-md border border-border bg-white py-2.5 pl-9 pr-8 text-sm focus:border-navy-400 focus:outline-none focus:ring-1 focus:ring-navy-400"
          >
            <option value="">All categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400">
            ▾
          </span>
        </div>

        {(category || query) && (
          <button
            type="button"
            onClick={() => {
              setCategory("");
              setQuery("");
            }}
            className="text-sm font-medium text-navy-500 hover:text-navy-900"
          >
            Clear
          </button>
        )}

        <p className="ml-auto text-sm text-navy-500">
          Showing {filtered.length} of {products.length}
        </p>
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
              filtered.map((p, i) => {
                const catName = p.categoryName ?? UNCATEGORISED;
                const prev = filtered[i - 1];
                // Group heading whenever the category changes — the list is
                // always category-sorted, so this splits it cleanly.
                const startsGroup =
                  !category &&
                  (i === 0 || (prev.categoryName ?? UNCATEGORISED) !== catName);

                return (
                  <Fragment key={p.id}>
                    {startsGroup && (
                      <tr className="border-b border-border bg-muted">
                        <th
                          colSpan={6}
                          scope="colgroup"
                          className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide text-navy-700"
                        >
                          {catName}
                          <span className="ml-2 font-medium normal-case tracking-normal text-navy-400">
                            {groupCounts.get(catName)}
                          </span>
                        </th>
                      </tr>
                    )}
                    <tr className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/products/${p.slug}`}
                          className="font-medium text-navy-900 hover:text-accent-600"
                        >
                          {p.name}
                        </Link>
                        <span className="block text-xs text-navy-400">
                          {p.slug}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-navy-600">
                        {p.modelCode ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-navy-600">
                        {p.categoryName ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-navy-600">
                        {p.brand ?? "—"}
                      </td>
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
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
