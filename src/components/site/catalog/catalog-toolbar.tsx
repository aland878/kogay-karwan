"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { SearchIcon } from "@/components/ui/icons";
import type { ProductSort } from "@/lib/domain/types";
import { cn, pluralize } from "@/lib/utils";

/**
 * CATALOG TOOLBAR — search + sort, driven entirely by the URL.
 *
 * Query state lives in the URL rather than component state so a filtered view
 * is shareable, bookmarkable and survives back/forward. That also keeps the
 * work on the server: the page is a server component that reads searchParams,
 * so filtering 5,000 rows never ships to the browser.
 *
 * Search is debounced and pushed with `replace` so typing does not bury the
 * previous page under a dozen history entries.
 */

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "relevance", label: "Most relevant" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "newest", label: "Newest first" },
];

function formatCount(total: number): string {
  return pluralize(total, "product");
}

export function CatalogToolbar({
  total,
  placeholder = "Search products, brands or SKU…",
}: {
  total: number;
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the field in step when navigation changes the query from outside
  // (a category link, a cleared filter, the back button).
  useEffect(() => {
    setTerm(searchParams.get("q") ?? "");
  }, [searchParams]);

  const push = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    // Any filter change invalidates the current page number.
    params.delete("page");

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const onSearchChange = (value: string) => {
    setTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      push((params) => {
        if (value.trim()) params.set("q", value.trim());
        else params.delete("q");
      });
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const sort = (searchParams.get("sort") as ProductSort) ?? "relevance";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-md">
        <label htmlFor="catalog-search" className="sr-only">
          Search the catalog
        </label>
        <span className="pointer-events-none absolute inset-y-0 start-0 grid w-11 place-items-center text-ink-subtle">
          <SearchIcon className="size-4" />
        </span>
        <input
          id="catalog-search"
          type="search"
          value={term}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-xl border border-line bg-surface ps-11 pe-4",
            "text-[0.9375rem] text-ink placeholder:text-ink-subtle/70",
            "transition-[border-color,box-shadow] duration-[var(--duration-quick)]",
            "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15",
          )}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Result count is announced politely so a screen reader hears the
            catalog change without the focus being yanked out of the field. */}
        <p aria-live="polite" className="text-sm text-ink-muted">
          {isPending ? "Searching…" : formatCount(total)}
        </p>

        <label htmlFor="catalog-sort" className="sr-only">
          Sort products
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) =>
            push((params) => {
              if (event.target.value === "relevance") params.delete("sort");
              else params.set("sort", event.target.value);
            })
          }
          className={cn(
            "h-12 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink",
            "transition-colors focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15",
          )}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
