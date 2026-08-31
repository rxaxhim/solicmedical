// ============================================================================
// Site-wide editable settings (currently just the homepage hero).
// ============================================================================
import type { DB } from "./products";

export interface HomepageHero {
  enabled: boolean;
  eyebrow: string | null;
  heading: string | null;
  heading_highlight: string | null;
  subheading: string | null;
  image_url: string | null;
  primary_label: string | null;
  primary_href: string | null;
  secondary_label: string | null;
  secondary_href: string | null;
  featured_product_id: string | null;
}

export const EMPTY_HERO: HomepageHero = {
  enabled: false,
  eyebrow: "",
  heading: "",
  heading_highlight: "",
  subheading: "",
  image_url: "",
  primary_label: "",
  primary_href: "",
  secondary_label: "",
  secondary_href: "",
  featured_product_id: null,
};

/**
 * Reads the singleton hero row. Returns null when unreachable or when the
 * table hasn't been migrated yet, so callers fall back to the default hero.
 */
export async function fetchHomepageHero(
  db: DB,
): Promise<HomepageHero | null> {
  try {
    const { data, error } = await db
      .from("homepage_hero")
      .select(
        "enabled, eyebrow, heading, heading_highlight, subheading, image_url, primary_label, primary_href, secondary_label, secondary_href, featured_product_id",
      )
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return (data as HomepageHero) ?? null;
  } catch (e) {
    console.error("[hero] fetch failed:", e);
    return null;
  }
}

/** A custom hero only renders when it's switched on AND has a heading. */
export function heroIsUsable(hero: HomepageHero | null): hero is HomepageHero {
  return !!hero && hero.enabled && !!hero.heading?.trim();
}
