import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";
import {
  fetchProductDetail,
  fetchCategories,
  fetchSubcategories,
  fetchBrands,
  fetchAccessoryCategories,
} from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";
import ImagesManager from "@/components/admin/ImagesManager";
import OverviewEditor from "@/components/admin/OverviewEditor";
import ConfigurationsManager from "@/components/admin/ConfigurationsManager";
import DocumentsManager from "@/components/admin/DocumentsManager";
import VideosManager from "@/components/admin/VideosManager";
import AccessoriesManager from "@/components/admin/AccessoriesManager";
import RelatedManager, {
  type RelatedItem,
} from "@/components/admin/RelatedManager";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { slug } = await params;

  const [
    product,
    categories,
    subcategories,
    brands,
    accessoryCategories,
    allProductsRes,
  ] = await Promise.all([
    fetchProductDetail(supabasePublic, slug),
    fetchCategories(supabasePublic),
    fetchSubcategories(supabasePublic),
    fetchBrands(supabasePublic),
    fetchAccessoryCategories(supabasePublic),
    supabasePublic.from("products").select("id, name, slug").order("name"),
  ]);

  if (!product) notFound();

  const candidates: RelatedItem[] = (allProductsRes.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  }));
  const relatedInitial: RelatedItem[] = product.related.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
  }));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-navy-900">
            {product.name}
          </h1>
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900"
          >
            View live
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-navy-900">Details</h2>
        <ProductForm
          mode="edit"
          categories={categories}
          subcategories={subcategories}
          brands={brands.map((b) => b.name)}
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            model_code: product.model_code ?? "",
            description: product.description ?? "",
            category_id: product.category?.id ?? null,
            subcategory_id: product.subcategory?.id ?? null,
            brand: product.brand ?? "",
            featured: product.featured,
            display_order: product.display_order,
          }}
        />
      </section>

      <ImagesManager
        productId={product.id}
        productSlug={product.slug}
        initial={product.images}
      />

      <OverviewEditor
        productId={product.id}
        productSlug={product.slug}
        initial={product.overview}
      />

      <ConfigurationsManager
        productId={product.id}
        productSlug={product.slug}
        initial={product.configurations}
      />

      <DocumentsManager
        productId={product.id}
        productSlug={product.slug}
        initial={product.documents}
      />

      <VideosManager
        productId={product.id}
        productSlug={product.slug}
        initial={product.videos}
      />

      <AccessoriesManager
        productId={product.id}
        productSlug={product.slug}
        initial={product.accessories}
        accessoryCategories={accessoryCategories}
      />

      <RelatedManager
        productId={product.id}
        productSlug={product.slug}
        initial={relatedInitial}
        candidates={candidates}
      />
    </div>
  );
}
