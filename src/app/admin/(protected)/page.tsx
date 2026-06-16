import Link from "next/link";
import { Plus } from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";
import ProductsTable, { type AdminProductRow } from "./ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { data, error } = await supabasePublic
    .from("products")
    .select("id, name, slug, model_code, brand, featured, categories(name)")
    .order("created_at", { ascending: false });

  const products: AdminProductRow[] = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    modelCode: p.model_code,
    brand: p.brand,
    featured: p.featured,
    categoryName:
      (p.categories as { name: string } | null)?.name ?? null,
  }));

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
