"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Link2,
  Table as TableIcon,
} from "lucide-react";
import TableBuilder from "./TableBuilder";

interface MarkdownFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  id?: string;
}

/**
 * A textarea with a small formatting toolbar that inserts Markdown so the
 * editor never has to type syntax by hand. Underline uses an inline <u> tag
 * (rendered via rehype-raw on the public side).
 */
export default function MarkdownField({
  value,
  onChange,
  rows = 6,
  placeholder,
  id,
}: MarkdownFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tableOpen, setTableOpen] = useState(false);

  /**
   * Inserts a block (e.g. a table) at the cursor, guaranteeing the blank lines
   * markdown needs around it without piling up extra newlines.
   */
  function insertBlock(block: string) {
    const ta = ref.current;
    const at = ta ? ta.selectionStart : value.length;
    const before = value.slice(0, at);
    const after = value.slice(at);

    const lead = before.length === 0 ? "" : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const trail = after.length === 0 ? "\n" : after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";

    const next = before + lead + block + trail + after;
    onChange(next);

    requestAnimationFrame(() => {
      ta?.focus();
      const pos = (before + lead + block).length;
      ta?.setSelectionRange(pos, pos);
    });
  }

  function wrap(before: string, after: string, fallback: string) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || fallback;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const s = start + before.length;
      ta.setSelectionRange(s, s + selected.length);
    });
  }

  function linePrefix(kind: "bullet" | "ordered" | "h2") {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const nlAfter = value.indexOf("\n", end);
    const lineEnd = nlAfter === -1 ? value.length : nlAfter;
    const block = value.slice(lineStart, lineEnd);
    const lines = block.split("\n");
    const newBlock = lines
      .map((l, i) => {
        if (kind === "ordered") return `${i + 1}. ${l}`;
        if (kind === "h2") return `## ${l}`;
        return `- ${l}`;
      })
      .join("\n");
    const next = value.slice(0, lineStart) + newBlock + value.slice(lineEnd);
    onChange(next);
    requestAnimationFrame(() => ta.focus());
  }

  const btn =
    "flex h-8 w-8 items-center justify-center rounded text-navy-600 hover:bg-white hover:text-navy-900";

  return (
    <div className="rounded-md border border-border bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted px-1.5 py-1">
        <button type="button" title="Bold" aria-label="Bold" className={btn} onClick={() => wrap("**", "**", "bold text")}>
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" title="Italic" aria-label="Italic" className={btn} onClick={() => wrap("*", "*", "italic text")}>
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" title="Underline" aria-label="Underline" className={btn} onClick={() => wrap("<u>", "</u>", "underlined text")}>
          <Underline className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" title="Heading" aria-label="Heading" className={btn} onClick={() => linePrefix("h2")}>
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" title="Bullet list" aria-label="Bullet list" className={btn} onClick={() => linePrefix("bullet")}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" title="Numbered list" aria-label="Numbered list" className={btn} onClick={() => linePrefix("ordered")}>
          <ListOrdered className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" title="Link" aria-label="Link" className={btn} onClick={() => wrap("[", "](https://)", "link text")}>
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Insert table"
          aria-label="Insert table"
          className={btn}
          onClick={() => setTableOpen(true)}
        >
          <TableIcon className="h-4 w-4" />
        </button>
      </div>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-b-md px-3 py-2.5 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none"
      />

      <TableBuilder
        open={tableOpen}
        onClose={() => setTableOpen(false)}
        onInsert={insertBlock}
      />
    </div>
  );
}
