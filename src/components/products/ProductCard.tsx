import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { ProductCardData } from "@/lib/products";

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-colors hover:border-navy-400"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.alt_text ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-200">
            <ImageOff className="h-10 w-10" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {product.brand && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
          {product.name}
        </h3>
        {product.model_code && (
          <p className="mt-1 text-sm text-navy-500">{product.model_code}</p>
        )}
      </div>
    </Link>
  );
}
