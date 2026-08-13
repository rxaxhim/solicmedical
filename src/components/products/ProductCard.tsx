import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { ProductCardData } from "@/lib/products";

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-card-hover transition-all duration-300 hover:-translate-y-1 hover:border-navy-300 hover:shadow-[0_8px_16px_rgba(10,37,64,0.10),0_22px_44px_rgba(10,37,64,0.16)]"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.alt_text ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 18vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-200">
            <ImageOff className="h-10 w-10" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-600">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 text-sm font-semibold leading-snug text-navy-900 transition-colors group-hover:text-accent-600">
          {product.name}
        </h3>
        {product.model_code && (
          <div className="mt-auto pt-3">
            <span className="inline-flex rounded bg-accent-50 px-2 py-1 text-xs font-semibold text-accent-700 ring-1 ring-accent-100 transition-colors group-hover:bg-accent-100">
              {product.model_code}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
