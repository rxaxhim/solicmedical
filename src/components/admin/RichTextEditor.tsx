"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { marked } from "marked";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link2,
  Table as TableIcon,
  Palette,
  Type,
  Undo2,
  Redo2,
  Rows3,
  Columns3,
  Trash2,
  RemoveFormatting,
} from "lucide-react";

const TEXT_COLORS = [
  { label: "Default navy", value: "#0A2540" },
  { label: "Deep navy", value: "#061A30" },
  { label: "Mid blue", value: "#324E7A" },
  { label: "Muted blue-grey", value: "#5C76A0" },
  { label: "Light grey", value: "#94A8C8" },
  { label: "Brand orange", value: "#EE8826" },
  { label: "Dark orange", value: "#D17314" },
  { label: "Success green", value: "#047857" },
  { label: "Teal", value: "#0F766E" },
  { label: "Alert red", value: "#B91C1C" },
  { label: "Purple", value: "#6D28D9" },
  { label: "Black", value: "#000000" },
];

const FONTS = [
  { label: "Body text (default)", value: "var(--font-sans)" },
  { label: "Heading font", value: "var(--font-display)" },
  { label: "Monospace", value: "ui-monospace, SFMono-Regular, monospace" },
  { label: "Georgia (serif)", value: "Georgia, 'Times New Roman', serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
];

/** Legacy rows are markdown; new ones are HTML. Detect and normalise. */
function toHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "";
  if (/^\s*<(p|h[1-6]|ul|ol|table|div|blockquote|span|strong|em)\b/i.test(trimmed)) {
    return trimmed;
  }
  return marked.parse(trimmed, { async: false }) as string;
}

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  minHeight = "220px",
}: Props) {
  const [menu, setMenu] = useState<null | "color" | "font">(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      TextStyle,
      Color,
      FontFamily,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: toHtml(value),
    editorProps: {
      attributes: {
        class: "prose-admin focus:outline-none",
        style: `min-height:${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Reflect external resets (e.g. switching product) without clobbering typing.
  useEffect(() => {
    if (!editor) return;
    const incoming = toHtml(value);
    if (incoming !== editor.getHTML()) editor.commands.setContent(incoming, { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) {
    return (
      <div
        className="rounded-md border border-border bg-white p-3 text-sm text-navy-400"
        style={{ minHeight }}
      >
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-white">
      <Toolbar editor={editor} menu={menu} setMenu={setMenu} />
      <EditorContent editor={editor} className="px-3 py-2.5 text-sm" />
    </div>
  );
}

function Toolbar({
  editor,
  menu,
  setMenu,
}: {
  editor: Editor;
  menu: null | "color" | "font";
  setMenu: (m: null | "color" | "font") => void;
}) {
  const btn = (active?: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded text-navy-600 hover:bg-white hover:text-navy-900 ${
      active ? "bg-white text-navy-900 ring-1 ring-border" : ""
    }`;

  function addLink() {
    const url = window.prompt("Link address (https://…)");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted px-1.5 py-1">
      <button type="button" title="Bold" className={btn(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon className="h-4 w-4" />
      </button>
      <button type="button" title="Italic" className={btn(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon className="h-4 w-4" />
      </button>
      <button type="button" title="Underline" className={btn(editor.isActive("underline"))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-4 w-4" />
      </button>
      <button type="button" title="Strikethrough" className={btn(editor.isActive("strike"))}
        onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </button>

      <span className="mx-1 h-5 w-px bg-border" />

      <button type="button" title="Heading" className={btn(editor.isActive("heading", { level: 2 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </button>
      <button type="button" title="Sub-heading" className={btn(editor.isActive("heading", { level: 3 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </button>
      <button type="button" title="Bullet list" className={btn(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </button>
      <button type="button" title="Numbered list" className={btn(editor.isActive("orderedList"))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </button>
      <button type="button" title="Link" className={btn(editor.isActive("link"))} onClick={addLink}>
        <Link2 className="h-4 w-4" />
      </button>

      <span className="mx-1 h-5 w-px bg-border" />

      {/* Colour */}
      <div className="relative">
        <button type="button" title="Text colour" className={btn(menu === "color")}
          onClick={() => setMenu(menu === "color" ? null : "color")}>
          <Palette className="h-4 w-4" />
        </button>
        {menu === "color" && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
            <div className="absolute left-0 top-9 z-20 w-56 rounded-md border border-border bg-white p-2 shadow-card-hover">
              <div className="grid grid-cols-6 gap-1.5">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    aria-label={c.label}
                    onClick={() => {
                      editor.chain().focus().setColor(c.value).run();
                      setMenu(null);
                    }}
                    className="h-7 w-7 rounded ring-1 ring-black/10 transition-transform hover:scale-110"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setMenu(null);
                }}
                className="mt-2 w-full rounded px-2 py-1.5 text-left text-xs text-navy-600 hover:bg-muted"
              >
                Remove colour
              </button>
            </div>
          </>
        )}
      </div>

      {/* Font */}
      <div className="relative">
        <button type="button" title="Font" className={btn(menu === "font")}
          onClick={() => setMenu(menu === "font" ? null : "font")}>
          <Type className="h-4 w-4" />
        </button>
        {menu === "font" && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
            <div className="absolute left-0 top-9 z-20 w-60 rounded-md border border-border bg-white p-2 shadow-card-hover">
              {FONTS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontFamily(f.value).run();
                    setMenu(null);
                  }}
                  style={{ fontFamily: f.value }}
                  className="block w-full rounded px-2 py-1.5 text-left text-sm text-navy-700 hover:bg-muted"
                >
                  {f.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetFontFamily().run();
                  setMenu(null);
                }}
                className="mt-1 w-full rounded border-t border-border px-2 pt-2 text-left text-xs text-navy-600 hover:bg-muted"
              >
                Reset to default font
              </button>
            </div>
          </>
        )}
      </div>

      <button type="button" title="Clear formatting" className={btn()}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <RemoveFormatting className="h-4 w-4" />
      </button>

      <span className="mx-1 h-5 w-px bg-border" />

      {/* Tables */}
      <button type="button" title="Insert table" className={btn(editor.isActive("table"))}
        onClick={() =>
          editor.chain().focus()
            .insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()
        }>
        <TableIcon className="h-4 w-4" />
      </button>
      {editor.isActive("table") && (
        <>
          <button type="button" title="Add row" className={btn()}
            onClick={() => editor.chain().focus().addRowAfter().run()}>
            <Rows3 className="h-4 w-4" />
          </button>
          <button type="button" title="Add column" className={btn()}
            onClick={() => editor.chain().focus().addColumnAfter().run()}>
            <Columns3 className="h-4 w-4" />
          </button>
          <button type="button" title="Delete table" className={btn()}
            onClick={() => editor.chain().focus().deleteTable().run()}>
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}

      <span className="mx-1 h-5 w-px bg-border" />

      <button type="button" title="Undo" className={btn()}
        onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </button>
      <button type="button" title="Redo" className={btn()}
        onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
}
