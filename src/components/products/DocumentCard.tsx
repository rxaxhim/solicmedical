import { Download, FileText } from "lucide-react";
import { documentTypeLabel, type ProductDocument } from "@/lib/products";

export default function DocumentCard({ doc }: { doc: ProductDocument }) {
  return (
    <a
      href={doc.pdf_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-lg border border-border bg-white p-5 transition-colors hover:border-navy-400"
    >
      <span className="relative flex h-11 w-11 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700 transition-colors group-hover:bg-navy-100">
        <FileText className="h-5 w-5" strokeWidth={1.75} />
        <span className="absolute -bottom-1 rounded-sm bg-navy-800 px-1 text-[8px] font-bold leading-[1.4] tracking-wide text-white">
          PDF
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-600">
          {documentTypeLabel(doc.document_type)}
        </span>
        <p className="mt-1.5 truncate font-semibold text-navy-900 group-hover:text-navy-700">
          {doc.title}
        </p>
      </div>

      <Download className="h-5 w-5 flex-none text-navy-400 group-hover:text-navy-700" />
    </a>
  );
}
