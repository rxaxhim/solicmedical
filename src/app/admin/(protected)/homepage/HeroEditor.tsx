"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink, ImageOff, Upload, Wand2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile, BUCKETS } from "@/lib/admin/storage";
import { revalidateHome } from "@/app/admin/actions";
import type { HomepageHero } from "@/lib/site";

export interface HeroProductOption {
  id: string;
  name: string;
  slug: string;
  model_code: string | null;
  image_url: string | null;
}

export default function HeroEditor({
  initial,
  products,
}: {
  initial: HomepageHero;
  products: HeroProductOption[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<HomepageHero>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof HomepageHero>(key: K, value: HomepageHero[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  const selectedProduct = products.find((p) => p.id === form.featured_product_id);

  /** Prefill the banner fields from the chosen product. */
  function fillFromProduct() {
    if (!selectedProduct) return;
    setForm((f) => ({
      ...f,
      eyebrow: "Featured Product",
      heading: selectedProduct.name,
      heading_highlight: "",
      subheading: selectedProduct.model_code
        ? `Model ${selectedProduct.model_code}`
        : f.subheading,
      image_url: selectedProduct.image_url ?? f.image_url,
      primary_label: "View Product",
      primary_href: `/products/${selectedProduct.slug}`,
      secondary_label: "Contact Us",
      secondary_href: "/contact",
    }));
    setSaved(false);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(BUCKETS.categoryImages, "homepage-hero", file);
      set("image_url", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    const payload = {
      id: 1,
      enabled: form.enabled,
      eyebrow: form.eyebrow?.trim() || null,
      heading: form.heading?.trim() || null,
      heading_highlight: form.heading_highlight?.trim() || null,
      subheading: form.subheading?.trim() || null,
      image_url: form.image_url?.trim() || null,
      primary_label: form.primary_label?.trim() || null,
      primary_href: form.primary_href?.trim() || null,
      secondary_label: form.secondary_label?.trim() || null,
      secondary_href: form.secondary_href?.trim() || null,
      featured_product_id: form.featured_product_id || null,
    };
    const { error } = await supabase
      .from("homepage_hero")
      .upsert(payload, { onConflict: "id" });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSaved(true);
    await revalidateHome();
    router.refresh();
  }

  const missingHeading = form.enabled && !form.heading?.trim();

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-md bg-accent-50 px-4 py-3 text-sm text-accent-700">
          {error}
        </p>
      )}

      {/* Enable toggle */}
      <section className="rounded-lg border border-border bg-white p-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => set("enabled", e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-navy-300 text-navy-800 focus:ring-navy-400"
          />
          <span>
            <span className="block font-semibold text-navy-900">
              Use this custom banner on the homepage
            </span>
            <span className="mt-0.5 block text-sm text-navy-500">
              When switched off, the homepage shows the standard Solic banner.
              Nothing below is lost — it&apos;s just hidden.
            </span>
          </span>
        </label>

        {missingHeading && (
          <p className="mt-4 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
            Add a heading below — the custom banner won&apos;t show without one.
          </p>
        )}
      </section>

      {/* Feature a product */}
      <section className="rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">
          Feature a product
        </h2>
        <p className="mt-1 text-sm text-navy-500">
          Optional. Pick a product, then use &ldquo;Fill from product&rdquo; to
          populate the fields below. You can edit everything afterwards.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select
            value={form.featured_product_id ?? ""}
            onChange={(e) => set("featured_product_id", e.target.value || null)}
            className="input flex-1"
          >
            <option value="">— No featured product —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.model_code ? ` (${p.model_code})` : ""}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={fillFromProduct}
            disabled={!selectedProduct}
            className="btn-ghost flex-none px-4 py-2 text-sm disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" />
            Fill from product
          </button>
        </div>
      </section>

      {/* Banner content */}
      <section className="space-y-5 rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Banner content</h2>

        <Field label="Small label above the heading" hint="e.g. Featured Product">
          <input
            value={form.eyebrow ?? ""}
            onChange={(e) => set("eyebrow", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Heading" required>
          <input
            value={form.heading ?? ""}
            onChange={(e) => set("heading", e.target.value)}
            placeholder="e.g. Introducing the iM60 Patient Monitor"
            className="input"
          />
        </Field>

        <Field
          label="Words to highlight in orange"
          hint="Optional. Must match part of the heading exactly, e.g. “iM60”."
        >
          <input
            value={form.heading_highlight ?? ""}
            onChange={(e) => set("heading_highlight", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Paragraph below the heading">
          <textarea
            rows={3}
            value={form.subheading ?? ""}
            onChange={(e) => set("subheading", e.target.value)}
            className="input"
          />
        </Field>
      </section>

      {/* Background image */}
      <section className="rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">
          Background image
        </h2>
        <p className="mt-1 text-sm text-navy-500">
          Sits behind the text, darkened. Wide landscape photos work best
          (about 2560 × 1440).
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative h-28 w-48 flex-none overflow-hidden rounded-md border border-border bg-muted">
            {form.image_url ? (
              <Image
                src={form.image_url}
                alt=""
                fill
                sizes="192px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-navy-200">
                <ImageOff className="h-7 w-7" />
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input
              value={form.image_url ?? ""}
              onChange={(e) => set("image_url", e.target.value)}
              placeholder="Image address, or upload below"
              className="input text-xs"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-navy-300 px-4 py-2 text-sm font-medium text-navy-700 hover:border-navy-500 hover:bg-muted">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload image"}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-5 rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Buttons</h2>
        <p className="-mt-1 text-sm text-navy-500">
          Leave a button&apos;s text empty to hide that button.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Main button text">
            <input
              value={form.primary_label ?? ""}
              onChange={(e) => set("primary_label", e.target.value)}
              placeholder="Browse Products"
              className="input"
            />
          </Field>
          <Field label="Main button link" hint="e.g. /products/im60-monitor">
            <input
              value={form.primary_href ?? ""}
              onChange={(e) => set("primary_href", e.target.value)}
              placeholder="/products"
              className="input font-mono text-xs"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Second button text">
            <input
              value={form.secondary_label ?? ""}
              onChange={(e) => set("secondary_label", e.target.value)}
              placeholder="Contact Us"
              className="input"
            />
          </Field>
          <Field label="Second button link">
            <input
              value={form.secondary_href ?? ""}
              onChange={(e) => set("secondary_href", e.target.value)}
              placeholder="/contact"
              className="input font-mono text-xs"
            />
          </Field>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save banner"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved.</span>}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900"
        >
          View homepage
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-800">
        {label}
        {required && <span className="text-accent-600"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
    </div>
  );
}
