import { supabasePublic } from "@/lib/supabase-public";
import { fetchHomepageHero, EMPTY_HERO } from "@/lib/site";
import HeroEditor, { type HeroProductOption } from "./HeroEditor";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const [hero, productsRes] = await Promise.all([
    fetchHomepageHero(supabasePublic),
    supabasePublic
      .from("products")
      .select("id, name, slug, model_code, product_images(image_url, is_primary)")
      .order("name", { ascending: true }),
  ]);

  type Row = {
    id: string;
    name: string;
    slug: string;
    model_code: string | null;
    product_images: { image_url: string; is_primary: boolean }[] | null;
  };

  const products: HeroProductOption[] = ((productsRes.data ?? []) as Row[]).map(
    (p) => {
      const imgs = p.product_images ?? [];
      const primary = imgs.find((i) => i.is_primary) ?? imgs[0];
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        model_code: p.model_code,
        image_url: primary?.image_url ?? null,
      };
    },
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy-900">Homepage banner</h1>
        <p className="mt-1 text-sm text-navy-500">
          Replace the top banner on the homepage — useful for featuring a
          product. Turn it off any time to restore the standard banner.
        </p>
      </div>

      <HeroEditor initial={hero ?? EMPTY_HERO} products={products} />
    </div>
  );
}
