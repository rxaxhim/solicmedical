"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, ImageOff, ArrowRight, Loader2 } from "lucide-react";
import { supabasePublic } from "@/lib/supabase-public";
import { searchProducts, type ProductCardData } from "@/lib/products";

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Focus the input and lock scroll while open; reset on close.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSearched(false);
      setLoading(false);
    }
  }, [open]);

  // Debounced search.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    let cancelled = false;
    const id = setTimeout(() => {
      searchProducts(supabasePublic, q, 8)
        .then((r) => {
          if (!cancelled) {
            setResults(r);
            setSearched(true);
          }
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query, open]);

  if (!open) return null;

  const trimmed = query.trim();

  function goToAll() {
    if (!trimmed) return;
    onClose();
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-navy-900/50" onClick={onClose} aria-hidden />

      <div className="absolute inset-x-0 top-0 mx-auto w-full max-w-2xl px-4 pt-[10vh]">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          className="overflow-hidden rounded-xl border border-border bg-white shadow-card-hover"
        >
          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToAll();
            }}
            className="flex items-center gap-3 border-b border-border px-4"
          >
            <Search className="h-5 w-5 flex-none text-navy-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name or model code…"
              aria-label="Search products"
              className="flex-1 py-4 text-base text-navy-900 placeholder:text-navy-400 focus:outline-none"
            />
            {loading && (
              <Loader2 className="h-4 w-4 flex-none animate-spin text-navy-400" />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex-none rounded-md p-1.5 text-navy-500 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {trimmed.length < 2 ? (
              <p className="px-4 py-8 text-center text-sm text-navy-500">
                Type at least 2 characters to search.
              </p>
            ) : searched && results.length === 0 && !loading ? (
              <p className="px-4 py-8 text-center text-sm text-navy-500">
                No products match “{trimmed}”.
              </p>
            ) : (
              <ul className="py-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted"
                    >
                      <span className="relative h-12 w-12 flex-none overflow-hidden rounded-md border border-border bg-muted">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt={p.alt_text ?? p.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-navy-200">
                            <ImageOff className="h-5 w-5" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-navy-900">
                          {p.name}
                        </span>
                        <span className="block truncate text-xs text-navy-400">
                          {[p.brand, p.model_code].filter(Boolean).join(" · ") ||
                            "View product"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer: view all */}
          {trimmed.length >= 2 && (
            <button
              type="button"
              onClick={goToAll}
              className="flex w-full items-center justify-between border-t border-border px-4 py-3 text-sm font-semibold text-navy-800 hover:bg-muted"
            >
              See all results for “{trimmed}”
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
