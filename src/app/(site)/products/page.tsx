import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";
import {
  fetchCategories,
  fetchSubcategories,
  fetchBrands,
  fetchProducts,
  fetchFacetCounts,
  EMPTY_FILTERS,
  DEFAULT_SORT,
  type BrandOption,
  type CategoryOption,
  type SubcategoryOption,
  type Facets,
  type ProductCardData,
} from "@/lib/products";
import ProductsClient from "./ProductsClient";
import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";

// Prerendered for speed; the admin triggers on-demand revalidation after edits
// (revalidatePath), with ISR as a periodic fallback. Client-side refetching
// takes over once the user filters/searches/sorts.
export const revalidate = 300;

interface InitialData {
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  brands: BrandOption[];
  products: ProductCardData[];
  total: number;
  facets: Facets;
}

async function getInitialData(): Promise<InitialData> {
  try {
    const [categories, subcategories, brands] = await Promise.all([
      fetchCategories(supabasePublic),
      fetchSubcategories(supabasePublic),
      fetchBrands(supabasePublic),
    ]);

    const [{ products, total }, facets] = await Promise.all([
      fetchProducts(supabasePublic, {
        filters: EMPTY_FILTERS,
        sort: DEFAULT_SORT,
        categories,
        brands,
        subcategories,
      }),
      fetchFacetCounts(
        supabasePublic,
        EMPTY_FILTERS,
        categories,
        brands,
        subcategories,
      ),
    ]);

    return { categories, subcategories, brands, products, total, facets };
  } catch (e) {
    // Degrade gracefully if the DB is unreachable at build time — the client
    // will retry in the browser.
    console.error("[products] initial data fetch failed:", e);
    return {
      categories: [],
      subcategories: [],
      brands: [],
      products: [],
      total: 0,
      facets: { categoryCounts: {}, subcategoryCounts: {}, brandCounts: {} },
    };
  }
}

export default async function ProductsPage() {
  const { categories, subcategories, brands, products, total, facets } =
    await getInitialData();

  return (
    <>
      {/* ── Page header (hero) ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=2000&q=80&auto=format&fit=crop"
            alt="Clinician using patient monitoring equipment"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/40" />
        </div>

        <div className="container-x relative py-16 lg:py-24">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-navy-200"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-white">Products</span>
          </nav>

          <h1 className="mt-6 text-display-xl text-white">Browse our <span className="text-accent-500">Products</span></h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100">
            Browse our full catalogue of medical and surgical equipment across
            patient monitoring, diagnostics, exam room furniture, and more.
          </p>
        </div>
      </section>

      {/* ── Filters + grid (client) ───────────────────────────────── */}
      <section className="bg-white py-12 lg:py-16">
        <Suspense
          fallback={
            <div className="container-x">
              <ProductGridSkeleton count={9} />
            </div>
          }
        >
          <ProductsClient
            categories={categories}
            subcategories={subcategories}
            brands={brands}
            initialProducts={products}
            initialTotal={total}
            initialFacets={facets}
          />
        </Suspense>
      </section>

      {/* ── CTA band ──────────────────────────────────────────────── */}
      <section className="bg-navy-900 py-20 lg:py-24">
        <div className="container-x text-center">
          <h2 className="text-display-md text-white">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-navy-200">
            Tell us what you need and we&apos;ll source it for you.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact" className="btn-light">
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
