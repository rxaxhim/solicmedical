import Link from "next/link";
import { Plus } from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";
import ProductsTable, { type AdminProductRow } from "./ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { data, error } = await supabasePublic
    .from("products")
    .select(
      "id, name, slug, model_code, brand, featured, categories(name, display_order)",
    )
    .order("name", { ascending: true });

  const products: AdminProductRow[] = (data ?? [])
    .map((p) => {
      const cat = p.categories as {
        name: string;
        display_order: number;
      } | null;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        modelCode: p.model_code,
        brand: p.brand,
        featured: p.featured,
        categoryName: cat?.name ?? null,
        categoryOrder: cat?.display_order ?? null,
      };
    })
    // Always grouped by category (same order the public site uses), then by
    // product name. Uncategorised products sink to the bottom.
    .sort((a, b) => {
      const ao = a.categoryOrder ?? Number.MAX_SAFE_INTEGER;
      const bo = b.categoryOrder ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      const an = a.categoryName ?? "";
      const bn = b.categoryName ?? "";
      if (an !== bn) return an.localeCompare(bn);
      return a.name.localeCompare(b.name);
    });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">Products</h1>
          <p className="mt-1 text-sm text-navy-500">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {error ? (
        <p className="rounded-md bg-accent-50 px-4 py-3 text-sm text-accent-700">
          Failed to load products: {error.message}
        </p>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  );
}
