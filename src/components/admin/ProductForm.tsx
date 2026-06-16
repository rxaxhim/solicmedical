"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  slugify,
  createSubcategory,
  type CategoryOption,
  type SubcategoryOption,
} from "@/lib/products";
import { revalidateCatalogue } from "@/app/admin/actions";

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  model_code: string;
  description: string;
  category_id: string | null;
  subcategory_id: string | null;
  brand: string;
  featured: boolean;
  display_order: number;
}

interface ProductFormProps {
  mode: "create" | "edit";
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  brands: string[];
  initial?: ProductFormValues;
}

const EMPTY: ProductFormValues = {
  name: "",
  slug: "",
  model_code: "",
  description: "",
  category_id: null,
  subcategory_id: null,
  brand: "",
  featured: false,
  display_order: 0,
};

export default function ProductForm({
  mode,
  categories,
  subcategories: initialSubcategories,
  brands,
  initial,
}: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial ?? EMPTY);
  const [subcategories, setSubcategories] =
    useState<SubcategoryOption[]>(initialSubcategories);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inline "create subcategory" UI
  const [creatingSub, setCreatingSub] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [subBusy, setSubBusy] = useState(false);

  const subOptions = values.category_id
    ? subcategories.filter((s) => s.category_id === values.category_id)
    : [];

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function onCategoryChange(categoryId: string | null) {
    setValues((v) => {
      // Drop the subcategory if it no longer belongs to the chosen category.
      const stillValid =
        v.subcategory_id &&
        subcategories.some(
          (s) => s.id === v.subcategory_id && s.category_id === categoryId,
        );
      return {
        ...v,
        category_id: categoryId,
        subcategory_id: stillValid ? v.subcategory_id : null,
      };
    });
    setCreatingSub(false);
    setNewSubName("");
  }

  async function addSubcategory() {
    if (!values.category_id || !newSubName.trim()) return;
    setSubBusy(true);
    setError(null);
    try {
      const created = await createSubcategory(
        supabase,
        values.category_id,
        newSubName.trim(),
      );
      setSubcategories((list) => [...list, created]);
      set("subcategory_id", created.id);
      setNewSubName("");
      setCreatingSub(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create subcategory.",
      );
    } finally {
      setSubBusy(false);
    }
  }

  function onNameChange(name: string) {
    setValues((v) => ({
      ...v,
      name,
      slug: slugTouched ? v.slug : slugify(name),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: values.name.trim(),
      slug: values.slug.trim() || slugify(values.name),
      model_code: values.model_code.trim() || null,
      description: values.description.trim() || null,
      category_id: values.category_id || null,
      subcategory_id: values.subcategory_id || null,
      brand: values.brand.trim() || null,
      featured: values.featured,
      display_order: Number(values.display_order) || 0,
    };

    if (mode === "create") {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select("slug")
        .single();
      setSaving(false);
      if (error) {
        setError(error.message);
        return;
      }
      await revalidateCatalogue(data.slug);
      router.push(`/admin/products/${data.slug}`);
      router.refresh();
    } else {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", initial!.id!);
      setSaving(false);
      if (error) {
        setError(error.message);
        return;
      }
      await revalidateCatalogue(payload.slug);
      if (payload.slug !== initial!.slug) {
        router.replace(`/admin/products/${payload.slug}`);
      }
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <p className="rounded-md bg-accent-50 px-4 py-3 text-sm text-accent-700">
          {error}
        </p>
      )}

      <Field label="Name" htmlFor="name" required>
        <input
          id="name"
          required
          value={values.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Slug" htmlFor="slug" required hint="URL identifier — must be unique.">
        <input
          id="slug"
          required
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            set("slug", e.target.value);
          }}
          className="input font-mono"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Model code" htmlFor="model_code">
          <input
            id="model_code"
            value={values.model_code}
            onChange={(e) => set("model_code", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Brand" htmlFor="brand">
          <input
            id="brand"
            list="brand-options"
            value={values.brand}
            onChange={(e) => set("brand", e.target.value)}
            className="input"
          />
          <datalist id="brand-options">
            {brands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" htmlFor="category">
          <select
            id="category"
            value={values.category_id ?? ""}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="input"
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Subcategory"
          htmlFor="subcategory"
          hint={
            values.category_id
              ? undefined
              : "Choose a category first to pick or add a subcategory."
          }
        >
          <select
            id="subcategory"
            value={values.subcategory_id ?? ""}
            onChange={(e) => set("subcategory_id", e.target.value || null)}
            disabled={!values.category_id}
            className="input disabled:bg-muted disabled:text-navy-400"
          >
            <option value="">— None —</option>
            {subOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {values.category_id &&
            (creatingSub ? (
              <div className="mt-2 flex gap-2">
                <input
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="New subcategory name"
                  className="input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubcategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSubcategory}
                  disabled={subBusy || !newSubName.trim()}
                  className="btn-ghost flex-none px-3 py-2 text-sm disabled:opacity-60"
                >
                  {subBusy ? "Adding…" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatingSub(false);
                    setNewSubName("");
                  }}
                  className="flex-none px-2 text-sm text-navy-500 hover:text-navy-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCreatingSub(true)}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:text-navy-900"
              >
                <Plus className="h-3.5 w-3.5" />
                New subcategory
              </button>
            ))}
        </Field>
      </div>

      <Field label="Display order" htmlFor="display_order" hint="Lower shows first.">
        <input
          id="display_order"
          type="number"
          value={values.display_order}
          onChange={(e) => set("display_order", Number(e.target.value))}
          className="input max-w-[160px]"
        />
      </Field>

      <Field
        label="Short description"
        htmlFor="description"
        hint="Shown on product cards and at the top of the detail page."
      >
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="input"
        />
      </Field>

      <label className="flex items-center gap-2.5 text-sm text-navy-800">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="h-4 w-4 rounded border-navy-300 text-navy-800 focus:ring-navy-400"
        />
        Featured product
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving
            ? "Saving…"
            : mode === "create"
              ? "Create product"
              : "Save changes"}
        </button>
        {mode === "create" && (
          <span className="text-sm text-navy-500">
            You can add images and other content after creating.
          </span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy-800">
        {label}
        {required && <span className="text-accent-600"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
    </div>
  );
}
