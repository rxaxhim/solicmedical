"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { Accessory } from "@/lib/products";
import ProductModal from "./ProductModal";
import RichText from "./RichText";

const NONE = "__none";

export default function AccessoryGrid({
  accessories,
}: {
  accessories: Accessory[];
}) {
  // Distinct categories present, in first-appearance order.
  const categories = useMemo(() => {
    const seen = new Map<string, { name: string; count: number }>();
    for (const a of accessories) {
      const slug = a.category_slug ?? NONE;
      const entry = seen.get(slug);
      if (entry) entry.count += 1;
      else seen.set(slug, { name: a.category_name ?? "Other", count: 1 });
    }
    return Array.from(seen, ([slug, { name, count }]) => ({
      slug,
      name,
      count,
    }));
  }, [accessories]);

  // Require a category to be selected; auto-select if there's only one.
  const [selectedCat, setSelectedCat] = useState<string | null>(
    categories.length === 1 ? categories[0].slug : null,
  );
  const [selected, setSelected] = useState<Accessory | null>(null);

  if (accessories.length === 0) {
    return (
      <p className="text-navy-600">
        No accessories are currently listed for this product.
      </p>
    );
  }

  const visible = accessories.filter(
    (a) => (a.category_slug ?? NONE) === selectedCat,
  );

  return (
    <>
      {/* Category selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = c.slug === selectedCat;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSelectedCat(c.slug)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-bold transition-all duration-200 ${
                active
                  ? "-translate-y-px bg-accent-500 text-navy-900 shadow-[0_6px_16px_-6px_rgba(238,136,38,0.85)]"
                  : "bg-navy-50 text-navy-700 hover:bg-navy-100 hover:text-navy-900"
              }`}
            >
              {c.name}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none tabular-nums ${
                  active
                    ? "bg-navy-900/15 text-navy-900"
                    : "bg-white text-navy-500"
                }`}
              >
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      {selectedCat === null ? (
        <p className="rounded-lg border border-dashed border-border bg-muted py-12 text-center text-base font-medium text-navy-800">
          Select a category above to view its parts &amp; accessories.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
          {visible.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a)}
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-white text-left transition-colors hover:border-navy-400"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {a.image_url ? (
                  <Image
                    src={a.image_url}
                    alt={a.name}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1280px) 20vw, 16vw"
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-navy-200">
                    <ImageOff className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                {a.product_code ? (
                  <>
                    <p className="text-xs font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                      {a.product_code}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-navy-400">
                      {a.name}
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-2 text-xs font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                    {a.name}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <ProductModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        labelledBy="accessory-modal-title"
      >
        {selected && (
          <div>
            <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-lg bg-muted">
              {selected.image_url ? (
                <Image
                  src={selected.image_url}
                  alt={selected.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 600px"
                  className="object-contain p-8"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-navy-200">
                  <ImageOff className="h-12 w-12" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <h3
              id="accessory-modal-title"
              className="text-xl font-semibold text-navy-900"
            >
              {selected.name}
            </h3>
            {selected.product_code && (
              <p className="mt-1 text-sm text-navy-500">
                Product code: {selected.product_code}
              </p>
            )}
            {selected.description && (
              <div className="mt-3">
                <RichText>{selected.description}</RichText>
              </div>
            )}
          </div>
        )}
      </ProductModal>
    </>
  );
}
