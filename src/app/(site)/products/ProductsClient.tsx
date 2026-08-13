"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";
import {
  fetchProducts,
  fetchFacetCounts,
  PAGE_SIZE,
  DEFAULT_SORT,
  SORT_OPTIONS,
  type BrandOption,
  type CategoryOption,
  type SubcategoryOption,
  type Facets,
  type ProductCardData,
  type ProductFilters,
  type SortOption,
} from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";
import FilterSidebar from "@/components/products/FilterSidebar";
import SearchBar from "@/components/products/SearchBar";
import SortDropdown from "@/components/products/SortDropdown";

interface ProductsClientProps {
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  brands: BrandOption[];
  initialProducts: ProductCardData[];
  initialTotal: number;
  initialFacets: Facets;
}

const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((s) => s.value));

function parseFilters(sp: URLSearchParams): ProductFilters {
  return {
    search: sp.get("search") ?? "",
    categorySlugs: (sp.get("category")?.split(",").filter(Boolean)) ?? [],
    subcategorySlugs:
      sp.get("subcategory")?.split(",").filter(Boolean) ?? [],
    brandSlugs: (sp.get("brand")?.split(",").filter(Boolean)) ?? [],
    featuredOnly: sp.get("featured") === "true",
  };
}

function parseSort(sp: URLSearchParams): SortOption {
  const s = sp.get("sort");
  return s && VALID_SORTS.has(s) ? (s as SortOption) : DEFAULT_SORT;
}

function parsePage(sp: URLSearchParams): number {
  const n = parseInt(sp.get("page") ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default function ProductsClient({
  categories,
  subcategories,
  brands,
  initialProducts,
  initialTotal,
  initialFacets,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  );
  const sort = parseSort(searchParams);
  const page = parsePage(searchParams);

  const filterOnlyKey = useMemo(
    () => JSON.stringify(filters),
    [filters],
  );
  const productsKey = `${filterOnlyKey}|${sort}`;

  const isDefaultView =
    filterOnlyKey === JSON.stringify(parseFilters(new URLSearchParams())) &&
    sort === DEFAULT_SORT &&
    page === 1;

  // Seed from server data only when landing on the default view.
  const [products, setProducts] = useState<ProductCardData[]>(() =>
    isDefaultView ? initialProducts : [],
  );
  const [total, setTotal] = useState(() =>
    isDefaultView ? initialTotal : 0,
  );
  const [facets, setFacets] = useState<Facets>(() =>
    isDefaultView
      ? initialFacets
      : { categoryCounts: {}, subcategoryCounts: {}, brandCounts: {} },
  );
  const [loading, setLoading] = useState(() => !isDefaultView);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const firstProductsRun = useRef(true);
  const firstFacetsRun = useRef(true);

  // --- URL writers --------------------------------------------------------
  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setCsv = (p: URLSearchParams, key: string, values: string[]) => {
    if (values.length) p.set(key, values.join(","));
    else p.delete(key);
  };

  const setSearch = useCallback(
    (value: string) =>
      pushParams((p) => {
        if (value) p.set("search", value);
        else p.delete("search");
        p.delete("page");
      }),
    [pushParams],
  );

  const toggleCategory = useCallback(
    (slug: string) =>
      pushParams((p) => {
        const cur = parseFilters(p).categorySlugs;
        const next = cur.includes(slug)
          ? cur.filter((s) => s !== slug)
          : [...cur, slug];
        setCsv(p, "category", next);
        p.delete("page");
      }),
    [pushParams],
  );

  const toggleSubcategory = useCallback(
    (slug: string) =>
      pushParams((p) => {
        const cur = parseFilters(p).subcategorySlugs;
        const next = cur.includes(slug)
          ? cur.filter((s) => s !== slug)
          : [...cur, slug];
        setCsv(p, "subcategory", next);
        p.delete("page");
      }),
    [pushParams],
  );

  const toggleBrand = useCallback(
    (slug: string) =>
      pushParams((p) => {
        const cur = parseFilters(p).brandSlugs;
        const next = cur.includes(slug)
          ? cur.filter((s) => s !== slug)
          : [...cur, slug];
        setCsv(p, "brand", next);
        p.delete("page");
      }),
    [pushParams],
  );

  const toggleFeatured = useCallback(
    (value: boolean) =>
      pushParams((p) => {
        if (value) p.set("featured", "true");
        else p.delete("featured");
        p.delete("page");
      }),
    [pushParams],
  );

  const setSort = useCallback(
    (value: SortOption) =>
      pushParams((p) => {
        if (value !== DEFAULT_SORT) p.set("sort", value);
        else p.delete("sort");
        p.delete("page");
      }),
    [pushParams],
  );

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setLoadingMore(true);
    setError(null);
    fetchProducts(supabasePublic, {
      filters,
      sort,
      categories,
      brands,
      subcategories,
      from: page * PAGE_SIZE,
      to: nextPage * PAGE_SIZE - 1,
    })
      .then((res) => {
        setProducts((prev) => [...prev, ...res.products]);
        setTotal(res.total);
        pushParams((p) => p.set("page", String(nextPage)));
      })
      .catch((e) => setError(e.message ?? "Failed to load more products."))
      .finally(() => setLoadingMore(false));
  }, [page, filters, sort, categories, brands, subcategories, pushParams]);

  // --- Data loading -------------------------------------------------------
  // Products: refetch when filters or sort change (page resets handled via URL).
  useEffect(() => {
    if (firstProductsRun.current) {
      firstProductsRun.current = false;
      if (isDefaultView) return; // seeded from server
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProducts(supabasePublic, {
      filters,
      sort,
      categories,
      brands,
      subcategories,
      from: 0,
      to: page * PAGE_SIZE - 1,
    })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.products);
        setTotal(res.total);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message ?? "Failed to load products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // page is intentionally excluded — load-more appends without a full reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsKey]);

  // Facets: refetch when filters change (independent of sort/page).
  useEffect(() => {
    if (firstFacetsRun.current) {
      firstFacetsRun.current = false;
      if (isDefaultView) return; // seeded from server
    }
    let cancelled = false;
    fetchFacetCounts(supabasePublic, filters, categories, brands, subcategories)
      .then((f) => {
        if (!cancelled) setFacets(f);
      })
      .catch(() => {
        /* facet counts are non-critical; ignore */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOnlyKey]);

  const drawerBadge =
    filters.categorySlugs.length +
    filters.subcategorySlugs.length +
    filters.brandSlugs.length +
    (filters.featuredOnly ? 1 : 0);
  const anyActive = drawerBadge + (filters.search ? 1 : 0) > 0;
  const hasMore = products.length < total;

  return (
    <>
      {/* Search bar (sits just under the page title) */}
      <div className="container-x pb-10">
        <SearchBar defaultValue={filters.search} onSearch={setSearch} />
      </div>

      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-12">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <FilterSidebar
          categories={categories}
          subcategories={subcategories}
          brands={brands}
          categoryCounts={facets.categoryCounts}
          subcategoryCounts={facets.subcategoryCounts}
          brandCounts={facets.brandCounts}
          selectedCategories={filters.categorySlugs}
          selectedSubcategories={filters.subcategorySlugs}
          selectedBrands={filters.brandSlugs}
          featuredOnly={filters.featuredOnly}
          activeCount={anyActive ? drawerBadge + (filters.search ? 1 : 0) : 0}
          onToggleCategory={toggleCategory}
          onToggleSubcategory={toggleSubcategory}
          onToggleBrand={toggleBrand}
          onToggleFeatured={toggleFeatured}
          onClearAll={clearAll}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>

      {/* Grid column */}
      <div className="lg:col-span-3">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-navy-600">
            {loading ? (
              "Loading products…"
            ) : (
              <>
                Showing <span className="font-semibold text-navy-900">{products.length}</span>{" "}
                of <span className="font-semibold text-navy-900">{total}</span>{" "}
                {total === 1 ? "product" : "products"}
              </>
            )}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2.5 text-sm font-medium text-navy-800 hover:border-navy-400 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {drawerBadge > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-navy-800 px-1.5 text-xs font-semibold text-white">
                  {drawerBadge}
                </span>
              )}
            </button>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-accent-100 bg-accent-50 p-4 text-sm text-accent-700">
            {error}
          </div>
        )}

        {loading ? (
          <ProductGridSkeleton count={PAGE_SIZE} />
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted py-20 text-center">
            <p className="text-lg font-semibold text-navy-900">
              No products found
            </p>
            <p className="mt-2 text-sm text-navy-600">
              Try adjusting your search or clearing some filters.
            </p>
            {anyActive && (
              <button
                type="button"
                onClick={clearAll}
                className="btn-ghost mt-6"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-ghost disabled:opacity-60"
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </>
  );
}
