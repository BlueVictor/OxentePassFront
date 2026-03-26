'use client';

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterOption = {
  label: string;
  value: string;
};

type ListSearchBarProps = {
  placeholder: string;
  initialQuery?: string;
  initialField?: string;
  filterOptions: FilterOption[];
  submitLabel?: string;
};

export function ListSearchBar({
  placeholder,
  initialQuery = "",
  initialField,
  filterOptions,
  submitLabel = "Buscar",
}: ListSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => initialQuery);
  const [field, setField] = useState(() => initialField ?? filterOptions[0]?.value ?? "");

  const navigateWithParams = (nextQuery: string, nextField: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = nextQuery.trim();

    params.delete("q");
    params.delete("campo");
    params.set("page", "0");

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
      if (nextField) {
        params.set("campo", nextField);
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateWithParams(query, field);
  };

  const handleClear = () => {
    const nextDefaultField = filterOptions[0]?.value ?? "";
    setQuery("");
    setField(nextDefaultField);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("campo");
    params.set("page", "0");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 mt-3 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:border-transparent lg:bg-transparent lg:shadow-none"
    >
      <div className="w-full lg:max-w-xs">
        <label
          htmlFor="list-search-field"
          className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Buscar em
        </label>
        <select
          id="list-search-field"
          value={field}
          onChange={(event) => setField(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label
          htmlFor="list-search-query"
          className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
        >
          <Search className="h-4 w-4" />
          Termo de busca
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="list-search-query"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Search className="h-4 w-4" />
          {submitLabel}
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
          Limpar
        </button>
      </div>
    </form>
  );
}
