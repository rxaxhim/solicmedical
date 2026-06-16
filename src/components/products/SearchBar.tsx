"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  defaultValue: string;
  onSearch: (value: string) => void;
  /** debounce in ms before onSearch fires from typing */
  debounceMs?: number;
}

export default function SearchBar({
  defaultValue,
  onSearch,
  debounceMs = 300,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Keep the input in sync when the URL (and thus defaultValue) changes
  // externally, e.g. via the back button or "Clear all filters".
  const lastExternal = useRef(defaultValue);
  useEffect(() => {
    if (defaultValue !== lastExternal.current) {
      lastExternal.current = defaultValue;
      setValue(defaultValue);
    }
  }, [defaultValue]);

  // Debounce typing.
  useEffect(() => {
    if (value === lastExternal.current) return;
    const id = setTimeout(() => {
      lastExternal.current = value;
      onSearchRef.current(value);
    }, debounceMs);
    return () => clearTimeout(id);
  }, [value, debounceMs]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    lastExternal.current = value;
    onSearchRef.current(value);
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-[500px] items-stretch">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by name or model code…"
          aria-label="Search products"
          className="w-full rounded-l-md border border-r-0 border-border bg-white py-3 pl-10 pr-3 text-sm text-navy-900 placeholder:text-navy-400 focus:border-navy-400 focus:outline-none focus:ring-1 focus:ring-navy-400"
        />
      </div>
      <button
        type="submit"
        className="rounded-r-md bg-navy-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
      >
        Search
      </button>
    </form>
  );
}
