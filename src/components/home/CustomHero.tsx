import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HomepageHero } from "@/lib/site";

/**
 * Splits the heading so the chosen phrase renders in the accent colour,
 * mirroring the default hero's "Trusted *medical equipment* for…" treatment.
 */
function renderHeading(heading: string, highlight: string | null) {
  const needle = highlight?.trim();
  if (!needle) return heading;
  const at = heading.toLowerCase().indexOf(needle.toLowerCase());
  if (at === -1) return heading;
  return (
    <>
      {heading.slice(0, at)}
      <span className="text-accent-500">
        {heading.slice(at, at + needle.length)}
      </span>
      {heading.slice(at + needle.length)}
    </>
  );
}

export default function CustomHero({ hero }: { hero: HomepageHero }) {
  const heading = hero.heading ?? "";

  return (
    <section className="relative bg-navy-900 text-white">
      <div className="absolute inset-0">
        {hero.image_url && (
          <Image
            src={hero.image_url}
            alt=""
            fill
            priority
            className="object-cover opacity-65"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-navy-900/20" />
      </div>

      <div className="container-x relative py-10 lg:py-12">
        <div className="max-w-3xl">
          {hero.eyebrow?.trim() && (
            <p className="eyebrow-light">{hero.eyebrow}</p>
          )}

          <h1 className="mt-6 text-display-xl text-white lg:text-display-2xl">
            {renderHeading(heading, hero.heading_highlight)}
          </h1>

          {hero.subheading?.trim() && (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-navy-100 lg:text-xl">
              {hero.subheading}
            </p>
          )}

          {(hero.primary_label?.trim() || hero.secondary_label?.trim()) && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {hero.primary_label?.trim() && (
                <Link href={hero.primary_href || "/products"} className="btn-light">
                  {hero.primary_label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {hero.secondary_label?.trim() && (
                <Link
                  href={hero.secondary_href || "/contact"}
                  className="btn-ghost-light"
                >
                  {hero.secondary_label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
