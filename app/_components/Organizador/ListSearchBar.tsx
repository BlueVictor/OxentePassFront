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
      className="mb-6 mt-3 flex flex-col gap-3 rounded-[2rem] border border-slate-100 bg-white p-3 shadow-xl shadow-slate-200/40 lg:flex-row lg:items-end lg:bg-white/80 lg:backdrop-blur-sm"
    >
      <div className="w-full lg:max-w-[200px]">
        <label
          htmlFor="list-search-field"
          className="mb-2 ml-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
        >
          <SlidersHorizontal className="h-3 w-3" />
          Filtro
        </label>
        <select
          id="list-search-field"
          value={field}
          onChange={(event) => setField(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-600 outline-none transition focus:border-emerald-500 focus:bg-white hover:bg-slate-100"
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
          className="mb-2 ml-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
        >
          <Search className="h-3 w-3" />
          Termo de busca
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
          <input
            id="list-search-query"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-[1.5rem] border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
        <button
          type="button"
          onClick={handleClear}
          title="Limpar filtros"
          className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-500 transition hover:bg-slate-200 active:scale-95"
        >
          <X className="h-4 w-4 stroke-[3px]" />
          <span className="lg:hidden">Limpar</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-emerald-600 px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95"
        >
          <Search className="h-4 w-4 stroke-[3px]" />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}