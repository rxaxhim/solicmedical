// ============================================================================
// Product catalogue queries — shared by the server (build-time initial fetch)
// and the client (filter / sort / search refetch). All functions take a typed
// Supabase client so the same logic runs in both contexts.
// ============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type DB = SupabaseClient<Database>;

export const PAGE_SIZE = 9;

export type SortOption = "featured" | "name-asc" | "name-desc" | "newest";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "newest", label: "Newest" },
];

export const DEFAULT_SORT: SortOption = "featured";

export interface ProductFilters {
  search: string;
  categorySlugs: string[];
  subcategorySlugs: string[];
  brandSlugs: string[];
  featuredOnly: boolean;
}

export const EMPTY_FILTERS: ProductFilters = {
  search: "",
  categorySlugs: [],
  subcategorySlugs: [],
  brandSlugs: [],
  featuredOnly: false,
};

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export interface SubcategoryOption {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  display_order: number;
}

export interface BrandOption {
  name: string;
  slug: string;
}

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  model_code: string | null;
  brand: string | null;
  featured: boolean;
  category_id: string | null;
  image_url: string | null;
  alt_text: string | null;
}

export interface ProductsResult {
  products: ProductCardData[];
  total: number;
}

export type FacetCounts = Record<string, number>;

// ----------------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------------

/** URL-friendly slug: lowercase, non-alphanumerics → single hyphen. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Sanitize a search term so it cannot break PostgREST's `or()` filter grammar
 * (commas, parentheses, and `*`/`%` are stripped to spaces).
 */
function sanitizeSearch(term: string): string {
  return term.replace(/[(),*%]/g, " ").trim();
}

// ----------------------------------------------------------------------------
// Reference data
// ----------------------------------------------------------------------------

export async function fetchCategories(db: DB): Promise<CategoryOption[]> {
  const { data, error } = await db
    .from("categories")
    .select("id, name, slug, display_order")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchSubcategories(
  db: DB,
): Promise<SubcategoryOption[]> {
  const { data, error } = await db
    .from("subcategories")
    .select("id, name, slug, category_id, display_order")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Creates a subcategory under a category. Slug is derived from the name; on a
 * uniqueness clash a short suffix is appended. Returns the created row.
 */
export async function createSubcategory(
  db: DB,
  categoryId: string,
  name: string,
): Promise<SubcategoryOption> {
  const base = slugify(name) || "subcategory";
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await db
      .from("subcategories")
      .insert({ category_id: categoryId, name: name.trim(), slug })
      .select("id, name, slug, category_id, display_order")
      .single();
    if (!error) return data as SubcategoryOption;
    // 23505 = unique_violation; retry with a new suffix. Otherwise bail.
    if (error.code !== "23505") throw error;
  }
  throw new Error("Could not generate a unique slug for the subcategory.");
}

/**
 * Lightweight product search by name or model code, for the navbar search.
 * Returns the top matches (featured first) with their primary image.
 */
export async function searchProducts(
  db: DB,
  query: string,
  limit = 8,
): Promise<ProductCardData[]> {
  const q = sanitizeSearch(query);
  if (!q) return [];
  const like = `%${q}%`;

  const { data, error } = (await db
    .from("products")
    .select(
      "id, name, slug, model_code, brand, featured, category_id, product_images(image_url, alt_text)",
    )
    .or(`name.ilike.${like},model_code.ilike.${like}`)
    .eq("product_images.is_primary", true)
    .order("featured", { ascending: false })
    .order("name", { ascending: true })
    .limit(limit)) as {
    data:
      | {
          id: string;
          name: string;
          slug: string;
          model_code: string | null;
          brand: string | null;
          featured: boolean;
          category_id: string | null;
          product_images: { image_url: string; alt_text: string | null }[] | null;
        }[]
      | null;
    error: unknown;
  };

  if (error) throw error;

  return (data ?? []).map((row): ProductCardData => {
    const primary = (row.product_images ?? [])[0];
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      model_code: row.model_code,
      brand: row.brand,
      featured: row.featured,
      category_id: row.category_id,
      image_url: primary?.image_url ?? null,
      alt_text: primary?.alt_text ?? null,
    };
  });
}

/** Distinct, non-null brands derived from the products table. */
export async function fetchBrands(db: DB): Promise<BrandOption[]> {
  const { data, error } = await db
    .from("products")
    .select("brand")
    .not("brand", "is", null);

  if (error) throw error;

  const names = Array.from(
    new Set((data ?? []).map((r) => r.brand).filter((b): b is string => !!b)),
  ).sort((a, b) => a.localeCompare(b));

  return names.map((name) => ({ name, slug: slugify(name) }));
}

// ----------------------------------------------------------------------------
// Filtering
// ----------------------------------------------------------------------------

type ProductsQuery = ReturnType<ReturnType<DB["from"]>["select"]>;

interface ApplyOpts {
  skipCategory?: boolean;
  skipSubcategory?: boolean;
  skipBrand?: boolean;
}

function applyFilters(
  query: ProductsQuery,
  filters: ProductFilters,
  categories: CategoryOption[],
  brands: BrandOption[],
  subcategories: SubcategoryOption[],
  opts: ApplyOpts = {},
): ProductsQuery {
  const search = sanitizeSearch(filters.search);
  if (search) {
    const like = `%${search}%`;
    query = query.or(`name.ilike.${like},model_code.ilike.${like}`);
  }

  if (!opts.skipCategory && filters.categorySlugs.length) {
    const ids = categories
      .filter((c) => filters.categorySlugs.includes(c.slug))
      .map((c) => c.id);
    if (ids.length) query = query.in("category_id", ids);
  }

  if (!opts.skipSubcategory && filters.subcategorySlugs.length) {
    const ids = subcategories
      .filter((s) => filters.subcategorySlugs.includes(s.slug))
      .map((s) => s.id);
    if (ids.length) query = query.in("subcategory_id", ids);
  }

  if (!opts.skipBrand && filters.brandSlugs.length) {
    const names = brands
      .filter((b) => filters.brandSlugs.includes(b.slug))
      .map((b) => b.name);
    if (names.length) query = query.in("brand", names);
  }

  if (filters.featuredOnly) {
    query = query.eq("featured", true);
  }

  return query;
}

// ----------------------------------------------------------------------------
// Products
// ----------------------------------------------------------------------------

interface FetchProductsArgs {
  filters: ProductFilters;
  sort: SortOption;
  categories: CategoryOption[];
  brands: BrandOption[];
  subcategories: SubcategoryOption[];
  /** zero-based row offset */
  from?: number;
  /** inclusive row offset; defaults to from + PAGE_SIZE - 1 */
  to?: number;
}

export async function fetchProducts(
  db: DB,
  args: FetchProductsArgs,
): Promise<ProductsResult> {
  const { filters, sort, categories, brands, subcategories } = args;
  const from = args.from ?? 0;
  const to = args.to ?? from + PAGE_SIZE - 1;

  let query = db
    .from("products")
    .select(
      "id, name, slug, model_code, brand, featured, category_id, product_images(image_url, alt_text)",
      { count: "exact" },
    )
    // Left-join the primary image only (parents without one are still returned).
    .eq("product_images.is_primary", true) as ProductsQuery;

  query = applyFilters(query, filters, categories, brands, subcategories);

  switch (sort) {
    case "name-asc":
      query = query.order("name", { ascending: true });
      break;
    case "name-desc":
      query = query.order("name", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "featured":
    default:
      query = query
        .order("featured", { ascending: false })
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
      break;
  }

  // Stable, unique tiebreaker so pagination never repeats or drops a row when
  // the primary sort columns tie (many products share the same name).
  query = query.order("id", { ascending: true });

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  type ProductRow = {
    id: string;
    name: string;
    slug: string;
    model_code: string | null;
    brand: string | null;
    featured: boolean;
    category_id: string | null;
    product_images: { image_url: string; alt_text: string | null }[] | null;
  };

  const products: ProductCardData[] = ((data ?? []) as ProductRow[]).map(
    (row): ProductCardData => {
    const images = row.product_images ?? [];
    const primary = images[0];
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      model_code: row.model_code,
      brand: row.brand,
      featured: row.featured,
      category_id: row.category_id,
      image_url: primary?.image_url ?? null,
      alt_text: primary?.alt_text ?? null,
    };
    },
  );

  return { products, total: count ?? 0 };
}

// ----------------------------------------------------------------------------
// Faceted counts — each facet ignores its own selection but honours the others.
// ----------------------------------------------------------------------------

export interface Facets {
  categoryCounts: FacetCounts; // keyed by category slug
  subcategoryCounts: FacetCounts; // keyed by subcategory slug
  brandCounts: FacetCounts; // keyed by brand slug
}

export async function fetchFacetCounts(
  db: DB,
  filters: ProductFilters,
  categories: CategoryOption[],
  brands: BrandOption[],
  subcategories: SubcategoryOption[],
): Promise<Facets> {
  const idToSlug = new Map(categories.map((c) => [c.id, c.slug]));

  // Category facet: apply every filter EXCEPT category.
  let catQuery = db.from("products").select("category_id") as ProductsQuery;
  catQuery = applyFilters(catQuery, filters, categories, brands, subcategories, {
    skipCategory: true,
  });
  const { data: catRows, error: catErr } = await catQuery;
  if (catErr) throw catErr;

  const categoryCounts: FacetCounts = {};
  for (const c of categories) categoryCounts[c.slug] = 0;
  for (const row of catRows ?? []) {
    const slug = row.category_id ? idToSlug.get(row.category_id) : undefined;
    if (slug) categoryCounts[slug] = (categoryCounts[slug] ?? 0) + 1;
  }

  // Subcategory facet: apply every filter EXCEPT subcategory.
  const subIdToSlug = new Map(subcategories.map((s) => [s.id, s.slug]));
  let subQuery = db.from("products").select("subcategory_id") as ProductsQuery;
  subQuery = applyFilters(subQuery, filters, categories, brands, subcategories, {
    skipSubcategory: true,
  });
  const { data: subRows, error: subErr } = await subQuery;
  if (subErr) throw subErr;

  const subcategoryCounts: FacetCounts = {};
  for (const s of subcategories) subcategoryCounts[s.slug] = 0;
  for (const row of subRows ?? []) {
    const slug = row.subcategory_id
      ? subIdToSlug.get(row.subcategory_id)
      : undefined;
    if (slug) subcategoryCounts[slug] = (subcategoryCounts[slug] ?? 0) + 1;
  }

  // Brand facet: apply every filter EXCEPT brand.
  let brandQuery = db.from("products").select("brand") as ProductsQuery;
  brandQuery = applyFilters(brandQuery, filters, categories, brands, subcategories, {
    skipBrand: true,
  });
  const { data: brandRows, error: brandErr } = await brandQuery;
  if (brandErr) throw brandErr;

  const nameToSlug = new Map(brands.map((b) => [b.name, b.slug]));
  const brandCounts: FacetCounts = {};
  for (const b of brands) brandCounts[b.slug] = 0;
  for (const row of brandRows ?? []) {
    const slug = row.brand ? nameToSlug.get(row.brand) : undefined;
    if (slug) brandCounts[slug] = (brandCounts[slug] ?? 0) + 1;
  }

  return { categoryCounts, subcategoryCounts, brandCounts };
}

// ----------------------------------------------------------------------------
// Product detail (single product + all related content)
// ----------------------------------------------------------------------------

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

export interface ProductConfiguration {
  id: string;
  config_name: string;
  config_details: string | null;
  display_order: number;
}

export interface ProductDocument {
  id: string;
  title: string;
  pdf_url: string;
  document_type: string;
  display_order: number;
}

export interface ProductVideo {
  id: string;
  title: string;
  youtube_url: string;
  display_order: number;
}

export interface Accessory {
  id: string;
  name: string;
  product_code: string | null;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  model_code: string | null;
  description: string | null;
  brand: string | null;
  featured: boolean;
  display_order: number;
  category: { id: string; name: string; slug: string } | null;
  subcategory: { id: string; name: string; slug: string } | null;
  images: ProductImage[];
  overview: string | null;
  configurations: ProductConfiguration[];
  documents: ProductDocument[];
  videos: ProductVideo[];
  accessories: Accessory[];
  related: ProductCardData[];
}

/** All product slugs — used by generateStaticParams for the static export. */
export async function fetchAllProductSlugs(db: DB): Promise<string[]> {
  const { data, error } = await db.from("products").select("slug");
  if (error) throw error;
  return (data ?? []).map((r) => r.slug);
}

/** Lightweight fetch for metadata (avoids pulling all related content). */
export async function fetchProductMeta(
  db: DB,
  slug: string,
): Promise<{ name: string; description: string | null; image_url: string | null } | null> {
  const { data, error } = await db
    .from("products")
    .select("name, description, product_images(image_url, is_primary)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const images = (data.product_images ?? []) as {
    image_url: string;
    is_primary: boolean;
  }[];
  const primary = images.find((i) => i.is_primary) ?? images[0];
  return {
    name: data.name,
    description: data.description,
    image_url: primary?.image_url ?? null,
  };
}

export async function fetchProductDetail(
  db: DB,
  slug: string,
): Promise<ProductDetail | null> {
  return fetchProductDetailBy(db, "slug", slug);
}

export async function fetchProductDetailById(
  db: DB,
  id: string,
): Promise<ProductDetail | null> {
  return fetchProductDetailBy(db, "id", id);
}

async function fetchProductDetailBy(
  db: DB,
  column: "slug" | "id",
  value: string,
): Promise<ProductDetail | null> {
  const { data: product, error } = await db
    .from("products")
    .select("*, categories(id, name, slug), subcategories(id, name, slug)")
    .eq(column, value)
    .maybeSingle();

  if (error) throw error;
  if (!product) return null;

  const productId = product.id;

  const [
    imagesRes,
    overviewRes,
    configsRes,
    docsRes,
    videosRes,
    accessoriesRes,
    relatedRowsRes,
  ] = await Promise.all([
    db
      .from("product_images")
      .select("id, image_url, alt_text, is_primary, display_order")
      .eq("product_id", productId)
      .order("is_primary", { ascending: false })
      .order("display_order", { ascending: true }),
    db
      .from("product_overview")
      .select("content")
      .eq("product_id", productId)
      .maybeSingle(),
    db
      .from("product_configurations")
      .select("id, config_name, config_details, display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: true }),
    db
      .from("product_documents")
      .select("id, title, pdf_url, document_type, display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: true }),
    db
      .from("product_videos")
      .select("id, title, youtube_url, display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: true }),
    db
      .from("accessories")
      .select("id, name, product_code, description, image_url, display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: true }),
    db
      .from("related_products")
      .select("related_product_id, display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: true }),
  ]);

  for (const res of [
    imagesRes,
    overviewRes,
    configsRes,
    docsRes,
    videosRes,
    accessoriesRes,
    relatedRowsRes,
  ]) {
    if (res.error) throw res.error;
  }

  // Resolve related products (preserve the related_products display order).
  const relatedIds = (relatedRowsRes.data ?? []).map(
    (r) => r.related_product_id,
  );
  let related: ProductCardData[] = [];
  if (relatedIds.length) {
    const { data: relRows, error: relErr } = await db
      .from("products")
      .select(
        "id, name, slug, model_code, brand, featured, category_id, product_images(image_url, alt_text)",
      )
      .in("id", relatedIds)
      .eq("product_images.is_primary", true);
    if (relErr) throw relErr;

    type RelRow = {
      id: string;
      name: string;
      slug: string;
      model_code: string | null;
      brand: string | null;
      featured: boolean;
      category_id: string | null;
      product_images: { image_url: string; alt_text: string | null }[] | null;
    };
    const byId = new Map<string, ProductCardData>();
    for (const row of (relRows ?? []) as RelRow[]) {
      const primary = (row.product_images ?? [])[0];
      byId.set(row.id, {
        id: row.id,
        name: row.name,
        slug: row.slug,
        model_code: row.model_code,
        brand: row.brand,
        featured: row.featured,
        category_id: row.category_id,
        image_url: primary?.image_url ?? null,
        alt_text: primary?.alt_text ?? null,
      });
    }
    related = relatedIds
      .map((id) => byId.get(id))
      .filter((p): p is ProductCardData => !!p);
  }

  const category = (product.categories ?? null) as {
    id: string;
    name: string;
    slug: string;
  } | null;
  const subcategory = (product.subcategories ?? null) as {
    id: string;
    name: string;
    slug: string;
  } | null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    model_code: product.model_code,
    description: product.description,
    brand: product.brand,
    featured: product.featured,
    display_order: product.display_order,
    category,
    subcategory,
    images: (imagesRes.data ?? []) as ProductImage[],
    overview: overviewRes.data?.content ?? null,
    configurations: (configsRes.data ?? []) as ProductConfiguration[],
    documents: (docsRes.data ?? []) as ProductDocument[],
    videos: (videosRes.data ?? []) as ProductVideo[],
    accessories: (accessoriesRes.data ?? []) as Accessory[],
    related,
  };
}

/** Extract a YouTube video id from common URL formats. */
export function youtubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
