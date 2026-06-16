"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { Accessory } from "@/lib/products";
import ProductModal from "./ProductModal";
import Markdown from "./Markdown";

const INITIAL_VISIBLE = 12;

export default function AccessoryGrid({
  accessories,
}: {
  accessories: Accessory[];
}) {
  const [selected, setSelected] = useState<Accessory | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (accessories.length === 0) {
    return (
      <p className="text-navy-600">
        No accessories are currently listed for this product.
      </p>
    );
  }

  const visible = showAll ? accessories : accessories.slice(0, INITIAL_VISIBLE);
  const hiddenCount = accessories.length - visible.length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {visible.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelected(a)}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white text-left transition-colors hover:border-navy-400"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              {a.image_url ? (
                <Image
                  src={a.image_url}
                  alt={a.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-navy-200">
                  <ImageOff className="h-7 w-7" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                {a.name}
              </p>
              {a.product_code && (
                <p className="mt-0.5 text-xs text-navy-400">{a.product_code}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {accessories.length > INITIAL_VISIBLE && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="btn-ghost"
          >
            {showAll ? "Show fewer" : `Show all ${accessories.length} accessories`}
          </button>
          {hiddenCount > 0 && (
            <span className="sr-only">{hiddenCount} more hidden</span>
          )}
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
                <Markdown>{selected.description}</Markdown>
              </div>
            )}
          </div>
        )}
      </ProductModal>
    </>
  );
}
