"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Settings2, BookOpen, Package } from "lucide-react";
import type {
  Accessory,
  ProductConfiguration,
  ProductDocument,
  ProductVideo,
} from "@/lib/products";
import RichText from "./RichText";
import DocumentCard from "./DocumentCard";
import VideoGrid from "./VideoGrid";
import AccessoryGrid from "./AccessoryGrid";

interface ProductTabsProps {
  overview: string | null;
  configurations: ProductConfiguration[];
  documents: ProductDocument[];
  videos: ProductVideo[];
  accessories: Accessory[];
}

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "configurations", label: "Configurations", icon: Settings2 },
  { id: "accessories", label: "Parts & Accessories", icon: Package },
  { id: "documentation", label: "Education & Documentation", icon: BookOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProductTabs(props: ProductTabsProps) {
  const { overview, configurations, documents, videos, accessories } = props;
  const [active, setActive] = useState<TabId>("overview");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sync from the URL hash on mount.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (TABS.some((t) => t.id === hash)) setActive(hash as TabId);
  }, []);

  function selectTab(id: TabId) {
    setActive(id);
    // Update the hash without jumping the scroll position.
    history.replaceState(null, "", `#${id}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const idx = TABS.findIndex((t) => t.id === active);
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = TABS.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      const t = TABS[nextIdx];
      selectTab(t.id);
      tabRefs.current[nextIdx]?.focus();
    }
  }

  return (
    <section className="border-t border-border bg-white">
      <div className="container-x">
        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Product information"
          onKeyDown={onKeyDown}
          className="flex gap-1 overflow-x-auto border-b border-border"
        >
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const selected = active === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                className={`flex flex-none items-center gap-2 whitespace-nowrap border-b-[3px] px-4 py-4 font-display text-[15px] font-bold transition-colors ${
                  selected
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-navy-700 hover:text-accent-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panels */}
        <div className="pb-12 pt-8">
          {/* Overview */}
          <div
            role="tabpanel"
            id="panel-overview"
            aria-labelledby="tab-overview"
            hidden={active !== "overview"}
          >
            {overview ? (
              <RichText>{overview}</RichText>
            ) : (
              <p className="text-navy-600">
                Overview information for this product is coming soon.
              </p>
            )}
          </div>

          {/* Configurations */}
          <div
            role="tabpanel"
            id="panel-configurations"
            aria-labelledby="tab-configurations"
            hidden={active !== "configurations"}
          >
            {configurations.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-border shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-navy-800 to-navy-700">
                        <th
                          scope="col"
                          className="w-px whitespace-nowrap border-r border-white/15 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
                        >
                          Model
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-100"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {configurations.map((c, i) => (
                        <tr
                          key={c.id}
                          className={`border-b border-border transition-colors last:border-0 hover:bg-navy-100 hover:shadow-[inset_3px_0_0_0_#EE8826] ${
                            i % 2 === 1 ? "bg-navy-50" : "bg-white"
                          }`}
                        >
                          <th
                            scope="row"
                            className="whitespace-nowrap border-r border-border px-5 py-4 align-top font-semibold text-navy-900"
                          >
                            {c.config_name}
                          </th>
                          <td className="px-5 py-4 align-top text-navy-700">
                            {c.config_details ? (
                              <div className="[&_p]:!mb-0">
                                <RichText>{c.config_details}</RichText>
                              </div>
                            ) : (
                              <span className="text-navy-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-navy-600">
                Configuration details for this product are coming soon.
              </p>
            )}
          </div>

          {/* Parts & Accessories */}
          <div
            role="tabpanel"
            id="panel-accessories"
            aria-labelledby="tab-accessories"
            hidden={active !== "accessories"}
          >
            <AccessoryGrid accessories={accessories} />
          </div>

          {/* Education & Documentation */}
          <div
            role="tabpanel"
            id="panel-documentation"
            aria-labelledby="tab-documentation"
            hidden={active !== "documentation"}
          >
            {documents.length > 0 || videos.length > 0 ? (
              <div className="space-y-12">
                {documents.length > 0 && (
                  <div>
                    <h3 className="mb-5 text-lg font-semibold text-navy-900">
                      Documents
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {documents.map((d) => (
                        <DocumentCard key={d.id} doc={d} />
                      ))}
                    </div>
                  </div>
                )}
                {videos.length > 0 && (
                  <div>
                    <h3 className="mb-5 text-lg font-semibold text-navy-900">
                      Videos
                    </h3>
                    <VideoGrid videos={videos} />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-navy-600">
                Documentation and educational content for this product are
                coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
