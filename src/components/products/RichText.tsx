import Markdown from "./Markdown";

/**
 * Renders admin-authored content.
 *
 * Content saved by the rich-text editor is HTML; anything written before that
 * (or seeded) is Markdown. We detect which and render accordingly, so existing
 * product copy keeps working without a bulk data migration.
 */
function looksLikeHtml(content: string): boolean {
  return /^\s*<(p|h[1-6]|ul|ol|table|div|blockquote|span|strong|em|figure)\b/i.test(
    content.trim(),
  );
}

// Styling for editor-produced HTML — mirrors the Configurations table look.
const PROSE = `
  max-w-none text-navy-700
  [&_p]:mb-4 [&_p]:leading-relaxed
  [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-900
  [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy-900
  [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5
  [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5
  [&_a]:font-medium [&_a]:text-accent-600 [&_a]:underline hover:[&_a]:text-accent-700
  [&_strong]:font-semibold [&_strong]:text-navy-900
  [&_u]:underline
  [&_table]:my-5 [&_table]:w-full [&_table]:border-separate [&_table]:border-spacing-0
  [&_table]:rounded-xl [&_table]:text-left [&_table]:text-sm
  [&_table]:shadow-card [&_table]:ring-1 [&_table]:ring-border

  [&_tr:has(th)]:bg-gradient-to-r [&_tr:has(th)]:from-navy-800 [&_tr:has(th)]:to-navy-700
  [&_th]:px-5 [&_th]:py-4 [&_th]:font-display [&_th]:text-[11px]
  [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-white
  [&_th:not(:last-child)]:border-r [&_th:not(:last-child)]:border-white/15
  [&_tr:has(th)_th:first-child]:rounded-tl-xl [&_tr:has(th)_th:last-child]:rounded-tr-xl

  [&_td]:border-t [&_td]:border-border [&_td]:px-5 [&_td]:py-4 [&_td]:align-top
  [&_td:not(:last-child)]:border-r [&_td:not(:last-child)]:border-border
  [&_tr:nth-child(odd)_td]:bg-navy-50
  [&_tr:hover_td]:bg-navy-100 [&_td]:transition-colors
  [&_tr:last-child_td:first-child]:rounded-bl-xl
  [&_tr:last-child_td:last-child]:rounded-br-xl

  [&_th>p]:!mb-0 [&_td>p]:!mb-0
`;

export default function RichText({ children }: { children: string }) {
  if (!children?.trim()) return null;

  if (!looksLikeHtml(children)) {
    // Legacy markdown — keep the existing pipeline.
    return <Markdown>{children}</Markdown>;
  }

  return (
    <div className={PROSE} dangerouslySetInnerHTML={{ __html: children }} />
  );
}
