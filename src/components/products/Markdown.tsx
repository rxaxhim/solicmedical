import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

/**
 * Markdown renderer with a hand-rolled prose style (no @tailwindcss/typography
 * dependency). Tables are wrapped so they match the styled Configurations
 * table: navy gradient header, zebra rows, rounded/elevated container.
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
        [&_u]:underline
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          table: ({ children }) => (
            <div className="my-5 overflow-hidden rounded-xl border border-border shadow-card">
              <div className="overflow-x-auto">
                <table
                  className="
                    w-full border-collapse text-left text-sm
                    [&_thead_tr]:bg-gradient-to-r [&_thead_tr]:from-navy-800 [&_thead_tr]:to-navy-700
                    [&_th]:px-5 [&_th]:py-4 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-white
                    [&_td]:border-b [&_td]:border-border [&_td]:px-5 [&_td]:py-4 [&_td]:align-top [&_td]:text-navy-700
                    [&_tbody_tr:last-child_td]:border-b-0
                    [&_tbody_tr:nth-child(even)]:bg-muted/50
                    [&_tbody_tr]:transition-colors
                    [&_tbody_tr:hover]:bg-navy-50
                  "
                >
                  {children}
                </table>
              </div>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
