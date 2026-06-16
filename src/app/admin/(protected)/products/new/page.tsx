import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";
import {
  fetchCategories,
  fetchSubcategories,
  fetchBrands,
} from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, subcategories, brands] = await Promise.all([
    fetchCategories(supabasePublic),
    fetchSubcategories(supabasePublic),
    fetchBrands(supabasePublic),
  ]);

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <h1 className="mb-8 text-2xl font-semibold text-navy-900">Add product</h1>

      <ProductForm
        mode="create"
        categories={categories}
        subcategories={subcategories}
        brands={brands.map((b) => b.name)}
      />
    </div>
  );
}
