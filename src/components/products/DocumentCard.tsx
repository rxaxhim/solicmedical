import { Download } from "lucide-react";
import type { ProductDocument } from "@/lib/products";

export default function DocumentCard({ doc }: { doc: ProductDocument }) {
  return (
    <a
      href={doc.pdf_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-white p-5 transition-colors hover:border-navy-400"
    >
      <div className="min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-600">
          {doc.document_type}
        </span>
        <p className="mt-1.5 truncate font-semibold text-navy-900 group-hover:text-navy-700">
          {doc.title}
        </p>
      </div>
      <Download className="h-5 w-5 flex-none text-navy-400 group-hover:text-navy-700" />
    </a>
  );
}
