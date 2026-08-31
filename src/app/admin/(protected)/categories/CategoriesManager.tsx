"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/products";
import { revalidateCategories } from "@/app/admin/actions";

export interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  productCount: number;
  subcategoryCount: number;
}

interface Draft {
  name: string;
  slug: string;
  display_order: number;
}

export default function CategoriesManager({
  initial,
}: {
  initial: AdminCategoryRow[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<AdminCategoryRow[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({ name: "", slug: "", display_order: 0 });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // add form
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newSlugTouched, setNewSlugTouched] = useState(false);
  const [adding, setAdding] = useState(false);

  function startEdit(c: AdminCategoryRow) {
    setError(null);
    setEditingId(c.id);
    setDraft({ name: c.name, slug: c.slug, display_order: c.display_order });
  }

  async function saveEdit(id: string) {
    const name = draft.name.trim();
    const slug = (draft.slug.trim() || slugify(name)).toLowerCase();
    if (!name) {
      setError("Category name cannot be empty.");
      return;
    }
    setBusyId(id);
    setError(null);
    const { error } = await supabase
      .from("categories")
      .update({ name, slug, display_order: Number(draft.display_order) || 0 })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      setError(
        error.code === "23505"
          ? `The URL name "${slug}" is already used by another category.`
          : error.message,
      );
      return;
    }
    setRows((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, name, slug, display_order: Number(draft.display_order) || 0 }
          : r,
      ),
    );
    setEditingId(null);
    await revalidateCategories();
    router.refresh();
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    const slug = (newSlug.trim() || slugify(name)).toLowerCase();
    if (!name) {
      setError("Enter a category name.");
      return;
    }
    setAdding(true);
    setError(null);
    const nextOrder = rows.length
      ? Math.max(...rows.map((r) => r.display_order)) + 1
      : 1;
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, slug, display_order: nextOrder })
      .select("id, name, slug, display_order")
      .single();
    setAdding(false);
    if (error) {
      setError(
        error.code === "23505"
          ? `The URL name "${slug}" is already in use. Try a different one.`
          : error.message,
      );
      return;
    }
    setRows((rs) => [
      ...rs,
      { ...data, productCount: 0, subcategoryCount: 0 } as AdminCategoryRow,
    ]);
    setNewName("");
    setNewSlug("");
    setNewSlugTouched(false);
    await revalidateCategories();
    router.refresh();
  }

  async function remove(c: AdminCategoryRow) {
    if (c.productCount > 0) return;
    const warning =
      c.subcategoryCount > 0
        ? `\n\nIts ${c.subcategoryCount} subcategor${c.subcategoryCount === 1 ? "y" : "ies"} will be deleted too.`
        : "";
    if (!window.confirm(`Delete the category "${c.name}"?${warning}\n\nThis cannot be undone.`))
      return;

    setBusyId(c.id);
    setError(null);
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    setBusyId(null);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((rs) => rs.filter((r) => r.id !== c.id));
    await revalidateCategories();
    router.refresh();
  }

  return (
    <div>
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
              <th className="px-4 py-3 font-semibold">URL name</th>
              <th className="w-24 px-4 py-3 font-semibold">Order</th>
              <th className="w-28 px-4 py-3 font-semibold">Subcategories</th>
              <th className="w-24 px-4 py-3 font-semibold">Products</th>
              <th className="w-44 px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy-500">
                  No categories yet.
                </td>
              </tr>
            ) : (
              rows.map((c) => {
                const editing = editingId === c.id;
                const locked = c.productCount > 0;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      {editing ? (
                        <input
                          value={draft.name}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, name: e.target.value }))
                          }
                          className="input py-1.5"
                        />
                      ) : (
                        <span className="font-medium text-navy-900">{c.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editing ? (
                        <input
                          value={draft.slug}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, slug: e.target.value }))
                          }
                          className="input py-1.5 font-mono text-xs"
                        />
                      ) : (
                        <span className="text-xs text-navy-400">{c.slug}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editing ? (
                        <input
                          type="number"
                          value={draft.display_order}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              display_order: Number(e.target.value),
                            }))
                          }
                          className="input py-1.5"
                        />
                      ) : (
                        <span className="text-navy-600">{c.display_order}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-navy-600">
                      {c.subcategoryCount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          locked
                            ? "font-semibold text-navy-900"
                            : "text-navy-400"
                        }
                      >
                        {c.productCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        {editing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(c.id)}
                              disabled={busyId === c.id}
                              className="inline-flex items-center gap-1.5 font-medium text-navy-700 hover:text-navy-900 disabled:opacity-50"
                            >
                              <Check className="h-4 w-4" />
                              {busyId === c.id ? "Saving…" : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="inline-flex items-center gap-1.5 text-navy-500 hover:text-navy-800"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(c)}
                              className="inline-flex items-center gap-1.5 text-navy-600 hover:text-navy-900"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(c)}
                              disabled={locked || busyId === c.id}
                              title={
                                locked
                                  ? `Cannot delete — ${c.productCount} product${c.productCount === 1 ? "" : "s"} still use this category. Move or delete them first.`
                                  : "Delete category"
                              }
                              className="inline-flex items-center gap-1.5 text-accent-600 hover:text-accent-700 disabled:cursor-not-allowed disabled:text-navy-300 disabled:hover:text-navy-300"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add category */}
      <form
        onSubmit={add}
        className="mt-6 rounded-lg border border-dashed border-border bg-white p-5"
      >
        <p className="mb-3 text-sm font-semibold text-navy-900">
          Add a category
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy-700">
              Name
            </label>
            <input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (!newSlugTouched) setNewSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Surgical Instruments"
              className="input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy-700">
              URL name
            </label>
            <input
              value={newSlug}
              onChange={(e) => {
                setNewSlugTouched(true);
                setNewSlug(e.target.value);
              }}
              placeholder="surgical-instruments"
              className="input font-mono text-xs"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={adding}
          className="btn-ghost mt-4 inline-flex px-4 py-2 text-sm disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {adding ? "Adding…" : "Add category"}
        </button>
      </form>
    </div>
  );
}
