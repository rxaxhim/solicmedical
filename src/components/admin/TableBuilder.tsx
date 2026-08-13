"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

interface TableBuilderProps {
  open: boolean;
  onClose: () => void;
  /** Receives a ready-to-insert GFM markdown table. */
  onInsert: (markdown: string) => void;
}

/** Escapes content so it can live inside a markdown table cell. */
function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

function toMarkdown(headers: string[], rows: string[][]): string {
  const head = `| ${headers.map((h) => escapeCell(h) || " ").join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map(
    (r) => `| ${r.map((c) => escapeCell(c) || " ").join(" | ")} |`,
  );
  return [head, divider, ...body].join("\n");
}

export default function TableBuilder({
  open,
  onClose,
  onInsert,
}: TableBuilderProps) {
  const [headers, setHeaders] = useState<string[]>(["Specification", "Value"]);
  const [rows, setRows] = useState<string[][]>([
    ["", ""],
    ["", ""],
  ]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset to a clean 2x2 each time the builder opens.
  useEffect(() => {
    if (!open) return;
    setHeaders(["Specification", "Value"]);
    setRows([
      ["", ""],
      ["", ""],
    ]);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const colCount = headers.length;

  function setHeader(i: number, value: string) {
    setHeaders((h) => h.map((v, idx) => (idx === i ? value : v)));
  }
  function setCell(r: number, c: number, value: string) {
    setRows((rs) =>
      rs.map((row, ri) =>
        ri === r ? row.map((v, ci) => (ci === c ? value : v)) : row,
      ),
    );
  }
  function addColumn() {
    setHeaders((h) => [...h, `Column ${h.length + 1}`]);
    setRows((rs) => rs.map((r) => [...r, ""]));
  }
  function removeColumn(i: number) {
    if (colCount <= 1) return;
    setHeaders((h) => h.filter((_, idx) => idx !== i));
    setRows((rs) => rs.map((r) => r.filter((_, idx) => idx !== i)));
  }
  function addRow() {
    setRows((rs) => [...rs, Array(colCount).fill("")]);
  }
  function removeRow(i: number) {
    if (rows.length <= 1) return;
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  }

  function insert() {
    onInsert(toMarkdown(headers, rows));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-900/50" onClick={onClose} aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Insert table"
        className="relative z-10 max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-card-hover"
      >
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-navy-900">Insert table</h3>
            <p className="mt-1 text-sm text-navy-500">
              Fill in the cells below — no markdown needed.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-navy-500 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Grid editor */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-1 align-bottom">
                    <div className="mb-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeColumn(i)}
                        disabled={colCount <= 1}
                        title="Delete column"
                        aria-label={`Delete column ${i + 1}`}
                        className="rounded p-1 text-navy-400 hover:bg-accent-50 hover:text-accent-600 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      value={h}
                      onChange={(e) => setHeader(i, e.target.value)}
                      placeholder={`Column ${i + 1}`}
                      className="input bg-navy-50 font-semibold"
                    />
                  </th>
                ))}
                <th className="w-10 p-1 align-bottom">
                  <button
                    type="button"
                    onClick={addColumn}
                    title="Add column"
                    aria-label="Add column"
                    className="flex h-10 w-9 items-center justify-center rounded-md border border-dashed border-navy-300 text-navy-600 hover:border-navy-500 hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="p-1">
                      <input
                        value={cell}
                        onChange={(e) => setCell(r, c, e.target.value)}
                        className="input"
                      />
                    </td>
                  ))}
                  <td className="p-1">
                    <button
                      type="button"
                      onClick={() => removeRow(r)}
                      disabled={rows.length <= 1}
                      title="Delete row"
                      aria-label={`Delete row ${r + 1}`}
                      className="rounded p-1.5 text-navy-400 hover:bg-accent-50 hover:text-accent-600 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-navy-300 px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-500 hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
          Add row
        </button>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <button type="button" onClick={insert} className="btn-primary">
            Insert table
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-navy-600 hover:text-navy-900"
          >
            Cancel
          </button>
          <span className="ml-auto text-xs text-navy-400">
            {colCount} columns · {rows.length} rows
          </span>
        </div>
      </div>
    </div>
  );
}
