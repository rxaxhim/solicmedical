"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ImageOff } from "lucide-react";
import type { ProductCardData } from "@/lib/products";
import ProductModal from "./ProductModal";

export default function RelatedProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  const [selected, setSelected] = useState<ProductCardData | null>(null);

  if (products.length === 0) return null;

  return (
    <section className="bg-muted py-16 lg:py-24">
      <div className="container-x">
        <h2 className="text-display-md text-navy-900">Related Products</h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white text-left transition-colors hover:border-navy-400"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.alt_text ?? p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-navy-200">
                    <ImageOff className="h-10 w-10" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                {p.brand && (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">
                    {p.brand}
                  </p>
                )}
                <h3 className="mt-1.5 text-base font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                  {p.name}
                </h3>
                {p.model_code && (
                  <p className="mt-1 text-sm text-navy-500">{p.model_code}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProductModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        labelledBy="related-modal-title"
      >
        {selected && (
          <div>
            <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-lg bg-muted">
              {selected.image_url ? (
                <Image
                  src={selected.image_url}
                  alt={selected.alt_text ?? selected.name}
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
            {selected.brand && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">
                {selected.brand}
              </p>
            )}
            <h3
              id="related-modal-title"
              className="mt-1.5 text-xl font-semibold text-navy-900"
            >
              {selected.name}
            </h3>
            {selected.model_code && (
              <p className="mt-1 text-sm text-navy-500">{selected.model_code}</p>
            )}
            <Link
              href={`/products/${selected.slug}`}
              className="btn-primary mt-6 w-full"
            >
              View full product
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </ProductModal>
    </section>
  );
}
