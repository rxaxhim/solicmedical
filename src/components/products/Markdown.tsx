import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

/**
 * Markdown renderer with a hand-rolled prose style (no @tailwindcss/typography
 * dependency). Covers the elements our product content uses.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div
      className="
        max-w-none text-navy-700
        [&_p]:mb-4 [&_p]:leading-relaxed
        [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-900
        [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy-900
        [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5
        [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5
        [&_a]:font-medium [&_a]:text-accent-600 [&_a]:underline hover:[&_a]:text-accent-700
        [&_strong]:font-semibold [&_strong]:text-navy-900
        [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
        [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
        [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2
        [&_u]:underline
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
