import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight } from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";
import {
  fetchProductDetail,
  fetchAllProductSlugs,
  fetchProductMeta,
} from "@/lib/products";
import ProductGallery from "@/components/products/ProductGallery";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProducts from "@/components/products/RelatedProducts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Prebuilt for known products; new slugs render on-demand (dynamicParams).
// The admin revalidates this path after edits; ISR is a periodic fallback.
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const slugs = await fetchAllProductSlugs(supabasePublic);
    return slugs.map((slug) => ({ slug }));
  } catch (e) {
    console.error("[product] generateStaticParams failed:", e);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const meta = await fetchProductMeta(supabasePublic, slug);
    if (!meta) return { title: "Product not found — Solic Medical" };
    const description =
      meta.description ??
      "Medical and surgical equipment from Solic Medical.";
    return {
      title: `${meta.name} — Solic Medical`,
      description,
      openGraph: {
        title: `${meta.name} — Solic Medical`,
        description,
        images: meta.image_url ? [{ url: meta.image_url }] : undefined,
      },
    };
  } catch {
    return { title: "Solic Medical" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProductDetail(supabasePublic, slug);

  if (!product) notFound();

  const contactParams = (intent: "quote" | "info") => {
    const p = new URLSearchParams({ intent, product: product.name });
    if (product.model_code) p.set("code", product.model_code);
    return `/contact?${p.toString()}`;
  };
  const quoteHref = contactParams("quote");
  const infoHref = contactParams("info");

  return (
    <>
      {/* ── Breadcrumb bar ────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-border bg-white"
      >
        <div className="container-x flex flex-wrap items-center gap-1.5 py-4 text-sm text-navy-500">
          <Link href="/" className="hover:text-navy-800">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-none" />
          <Link href="/products" className="hover:text-navy-800">
            Products
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3.5 w-3.5 flex-none" />
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-navy-800"
              >
                {product.category.name}
              </Link>
            </>
          )}
          {product.subcategory && (
            <>
              <ChevronRight className="h-3.5 w-3.5 flex-none" />
              <Link
                href={`/products?subcategory=${product.subcategory.slug}`}
                className="hover:text-navy-800"
              >
                {product.subcategory.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 flex-none" />
          <span className="font-semibold text-navy-900">{product.name}</span>
        </div>
      </nav>

      {/* ── Hero: gallery + info ──────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-16">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          <div className="lg:col-span-5">
            {product.brand && (
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                {product.brand}
              </p>
            )}
            <h1 className="mt-3 text-display-md text-navy-900">
              {product.name}
            </h1>
            {product.model_code && (
              <p className="mt-2 text-sm text-navy-500">
                Model: {product.model_code}
              </p>
            )}

            {product.description && (
              <p className="mt-6 text-lg leading-relaxed text-navy-600">
                {product.description}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:max-w-sm">
              <Link href={quoteHref} className="btn-primary">
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={infoHref} className="btn-ghost">
                Request More Information
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabbed content ────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <ProductTabs
          overview={product.overview}
          configurations={product.configurations}
          documents={product.documents}
          videos={product.videos}
          accessories={product.accessories}
        />
      </Suspense>

      {/* ── Related products ──────────────────────────────────────── */}
      <RelatedProducts products={product.related} />

      {/* ── CTA band ──────────────────────────────────────────────── */}
      <section className="bg-navy-900 py-20 lg:py-24">
        <div className="container-x text-center">
          <h2 className="text-display-md text-white">
            Have questions about this product?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-navy-200">
            Our team can walk you through specs, configurations, and pricing.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href={quoteHref} className="btn-light">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
