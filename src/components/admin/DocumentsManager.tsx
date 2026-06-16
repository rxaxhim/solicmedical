"use client";

import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadFile, BUCKETS } from "@/lib/admin/storage";
import { revalidateCatalogue } from "@/app/admin/actions";
import type { ProductDocument } from "@/lib/products";
import AdminSection from "./AdminSection";

const DOC_TYPES = ["manual", "datasheet", "brochure", "other"] as const;

export default function DocumentsManager({
  productId,
  productSlug,
  initial,
}: {
  productId: string;
  productSlug: string;
  initial: ProductDocument[];
}) {
  const [items, setItems] = useState<ProductDocument[]>(initial);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<string>("manual");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose a PDF to upload.");
      return;
    }
    if (!title.trim()) {
      setError("Enter a document title.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const url = await uploadFile(BUCKETS.productDocs, productId, file);
      const { data, error } = await supabase
        .from("product_documents")
        .insert({
          product_id: productId,
          title: title.trim(),
          pdf_url: url,
          document_type: docType,
          display_order: items.length,
        })
        .select("id, title, pdf_url, document_type, display_order")
        .single();
      if (error) throw error;
      setItems((it) => [...it, data as ProductDocument]);
      setTitle("");
      setDocType("manual");
      if (fileRef.current) fileRef.current.value = "";
      await revalidateCatalogue(productSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this document?")) return;
    const { error } = await supabase
      .from("product_documents")
      .delete()
      .eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((it) => it.filter((i) => i.id !== id));
    await revalidateCatalogue(productSlug);
  }

  return (
    <AdminSection title="Documents" description="PDFs shown under Education & Documentation.">
      {error && (
        <p className="mb-4 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {error}
        </p>
      )}

      {items.length > 0 && (
        <ul className="mb-5 divide-y divide-border rounded-md border border-border">
          {items.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-4 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-5 w-5 flex-none text-navy-400" />
                <div className="min-w-0">
                  <a
                    href={d.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate font-medium text-navy-900 hover:text-accent-600"
                  >
                    {d.title}
                  </a>
                  <span className="text-xs uppercase tracking-wide text-navy-400">
                    {d.document_type}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(d.id)}
                aria-label="Delete document"
                className="flex-none text-accent-600 hover:text-accent-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="space-y-3 rounded-md border border-dashed border-border p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            className="input"
          />
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="input"
          >
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <input ref={fileRef} type="file" accept="application/pdf" className="text-sm" />
        <button
          type="submit"
          disabled={busy}
          className="btn-ghost inline-flex px-4 py-2 text-sm disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : "Add document"}
        </button>
      </form>
    </AdminSection>
  );
}
