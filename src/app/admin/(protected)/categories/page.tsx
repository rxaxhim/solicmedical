import { supabasePublic } from "@/lib/supabase-public";
import CategoriesManager, { type AdminCategoryRow } from "./CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [catsRes, subsRes, prodsRes] = await Promise.all([
    supabasePublic
      .from("categories")
      .select("id, name, slug, display_order")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true }),
    supabasePublic.from("subcategories").select("id, category_id"),
    supabasePublic.from("products").select("id, category_id, subcategory_id"),
  ]);

  const error = catsRes.error ?? subsRes.error ?? prodsRes.error;

  // Map each subcategory to its parent so products attached only via a
  // subcategory still count toward the parent category.
  const subToCat = new Map(
    (subsRes.data ?? []).map((s) => [s.id, s.category_id]),
  );

  const productCounts = new Map<string, number>();
  for (const p of prodsRes.data ?? []) {
    const catId =
      p.category_id ??
      (p.subcategory_id ? subToCat.get(p.subcategory_id) : undefined);
    if (catId) productCounts.set(catId, (productCounts.get(catId) ?? 0) + 1);
  }

  const subCounts = new Map<string, number>();
  for (const s of subsRes.data ?? []) {
    subCounts.set(s.category_id, (subCounts.get(s.category_id) ?? 0) + 1);
  }

  const categories: AdminCategoryRow[] = (catsRes.data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    display_order: c.display_order,
    productCount: productCounts.get(c.id) ?? 0,
    subcategoryCount: subCounts.get(c.id) ?? 0,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy-900">Categories</h1>
        <p className="mt-1 text-sm text-navy-500">
          {categories.length} categories · a category can only be deleted once
          it has no products.
        </p>
      </div>

      {error ? (
        <p className="rounded-md bg-accent-50 px-4 py-3 text-sm text-accent-700">
          Failed to load categories: {error.message}
        </p>
      ) : (
        <CategoriesManager initial={categories} />
      )}
    </div>
  );
}
