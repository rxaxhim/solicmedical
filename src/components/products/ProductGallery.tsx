"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { ProductImage } from "@/lib/products";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;
  const current = images[active];

  const next = useCallback(
    () => setActive((i) => (count ? (i + 1) % count : 0)),
    [count],
  );
  const prev = useCallback(
    () => setActive((i) => (count ? (i - 1 + count) % count : 0)),
    [count],
  );

  // Keyboard nav for the lightbox.
  useEffect(() => {
    if (!lightbox) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, next, prev]);

  if (count === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-navy-200">
        <ImageOff className="h-12 w-12" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-5">
      {/* Main image */}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-lg border border-border bg-muted">
        {current?.image_url ? (
          <Image
            src={current.image_url}
            alt={current.alt_text ?? productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-8"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-navy-200">
            <ImageOff className="h-12 w-12" strokeWidth={1.5} />
          </div>
        )}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="View full screen"
          className="absolute right-3 top-3 rounded-md bg-white/90 p-2 text-navy-700 shadow-card transition-colors hover:bg-white"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnails: vertical on desktop, horizontal scroll on mobile */}
      {count > 1 && (
        <div className="flex gap-2.5 overflow-x-auto lg:max-h-[520px] lg:w-20 lg:flex-col lg:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square w-16 flex-none overflow-hidden rounded-md border bg-muted lg:w-full ${
                i === active
                  ? "border-2 border-navy-800"
                  : "border border-border hover:border-navy-300"
              }`}
            >
              {img.image_url ? (
                <Image
                  src={img.image_url}
                  alt={img.alt_text ?? `${productName} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-navy-200">
                  <ImageOff className="h-5 w-5" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image viewer`}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute right-5 top-5 rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {count > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white sm:left-8"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          <div className="relative h-[80vh] w-[90vw] max-w-5xl">
            {current?.image_url && (
              <Image
                src={current.image_url}
                alt={current.alt_text ?? productName}
                fill
                sizes="90vw"
                className="object-contain"
              />
            )}
          </div>

          {count > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white sm:right-8"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {count > 1 && (
            <p className="absolute bottom-6 text-sm text-white/70">
              {active + 1} / {count}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
