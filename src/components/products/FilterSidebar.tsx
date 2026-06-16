"use client";

import { X } from "lucide-react";
import type {
  BrandOption,
  CategoryOption,
  SubcategoryOption,
  FacetCounts,
} from "@/lib/products";

export interface FilterSidebarProps {
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  brands: BrandOption[];
  categoryCounts: FacetCounts;
  subcategoryCounts: FacetCounts;
  brandCounts: FacetCounts;
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedBrands: string[];
  featuredOnly: boolean;
  activeCount: number;
  onToggleCategory: (slug: string) => void;
  onToggleSubcategory: (slug: string) => void;
  onToggleBrand: (slug: string) => void;
  onToggleFeatured: (value: boolean) => void;
  onClearAll: () => void;
  /** mobile drawer state */
  isOpen: boolean;
  onClose: () => void;
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  const disabled = count === 0 && !checked;
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 py-1.5 text-sm ${
        disabled ? "cursor-default text-navy-300" : "text-navy-700"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded border-navy-300 text-navy-800 focus:ring-navy-400"
      />
      <span className="flex-1">{label}</span>
      {typeof count === "number" && (
        <span className="text-xs tabular-nums text-navy-400">{count}</span>
      )}
    </label>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="group border-b border-border py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-navy-900">
        {title}
        <span className="text-navy-400 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}

function SidebarContent(props: FilterSidebarProps) {
  const {
    categories,
    subcategories,
    brands,
    categoryCounts,
    subcategoryCounts,
    brandCounts,
    selectedCategories,
    selectedSubcategories,
    selectedBrands,
    featuredOnly,
    activeCount,
    onToggleCategory,
    onToggleSubcategory,
    onToggleBrand,
    onToggleFeatured,
    onClearAll,
  } = props;

  // When categories are selected, narrow the subcategory list to their children.
  const catIdToSlug = new Map(categories.map((c) => [c.id, c.slug]));
  const visibleSubcategories = selectedCategories.length
    ? subcategories.filter((s) =>
        selectedCategories.includes(catIdToSlug.get(s.category_id) ?? ""),
      )
    : subcategories;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-900">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-medium text-accent-600 hover:text-accent-700"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Category">
        {categories.map((c) => (
          <CheckRow
            key={c.slug}
            label={c.name}
            count={categoryCounts[c.slug] ?? 0}
            checked={selectedCategories.includes(c.slug)}
            onChange={() => onToggleCategory(c.slug)}
          />
        ))}
      </FilterGroup>

      {visibleSubcategories.length > 0 && (
        <FilterGroup title="Subcategory">
          {visibleSubcategories.map((s) => (
            <CheckRow
              key={s.slug}
              label={s.name}
              count={subcategoryCounts[s.slug] ?? 0}
              checked={selectedSubcategories.includes(s.slug)}
              onChange={() => onToggleSubcategory(s.slug)}
            />
          ))}
        </FilterGroup>
      )}

      {brands.length > 0 && (
        <FilterGroup title="Brand">
          {brands.map((b) => (
            <CheckRow
              key={b.slug}
              label={b.name}
              count={brandCounts[b.slug] ?? 0}
              checked={selectedBrands.includes(b.slug)}
              onChange={() => onToggleBrand(b.slug)}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Featured">
        <CheckRow
          label="Featured products only"
          checked={featuredOnly}
          onChange={() => onToggleFeatured(!featuredOnly)}
        />
      </FilterGroup>
    </div>
  );
}

export default function FilterSidebar(props: FilterSidebarProps) {
  const { isOpen, onClose } = props;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* backdrop */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-navy-900/40 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* panel */}
        <div
          className={`absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-card-hover transition-transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-900">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="rounded-md p-1.5 text-navy-500 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Reuse content but hide its duplicate heading via wrapper */}
          <div className="[&>div>div:first-child]:hidden">
            <SidebarContent {...props} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary mt-6 w-full"
          >
            Show results
          </button>
        </div>
      </div>
    </>
  );
}
