import Link from "next/link";

import type { Brand, CategoryNode, Locale } from "@/lib/domain/types";
import { localize } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Category and brand filters.
 *
 * Rendered server-side as plain links — each filter combination is a URL, so
 * there is no client filtering state to desynchronise and the whole sidebar
 * costs zero JavaScript. On mobile it collapses into a native <details>.
 */

export function FilterSidebar({
  categories,
  brands,
  activeCategory,
  activeBrand,
  searchParams,
  locale = "en",
}: {
  categories: CategoryNode[];
  brands: Brand[];
  activeCategory?: string;
  activeBrand?: string;
  searchParams: Record<string, string | undefined>;
  locale?: Locale;
}) {
  /** Builds a URL with one facet toggled, resetting pagination. */
  const hrefWith = (key: string, value?: string) => {
    const params = new URLSearchParams();
    for (const [existingKey, existingValue] of Object.entries(searchParams)) {
      if (existingValue && existingKey !== "page") {
        params.set(existingKey, existingValue);
      }
    }
    if (value) params.set(key, value);
    else params.delete(key);

    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  const hasFilters = Boolean(activeCategory || activeBrand || searchParams.q);

  const body = (
    <div className="flex flex-col gap-8">
      {hasFilters ? (
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent-strong underline-offset-4 hover:underline"
        >
          Clear all filters
        </Link>
      ) : null}

      <FilterGroup title="Categories">
        <FilterLink
          href={hrefWith("category")}
          active={!activeCategory}
          label="All categories"
        />
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col">
            <FilterLink
              href={hrefWith("category", category.slug)}
              active={activeCategory === category.slug}
              label={localize(category.name, locale)}
              count={category.productCount}
            />

            {category.children.length > 0 ? (
              <div className="ms-3 mt-1 flex flex-col border-s border-line ps-3">
                {category.children.map((child) => (
                  <FilterLink
                    key={child.id}
                    href={hrefWith("category", child.slug)}
                    active={activeCategory === child.slug}
                    label={localize(child.name, locale)}
                    count={child.productCount}
                    subtle
                  />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </FilterGroup>

      <FilterGroup title="Brands">
        <FilterLink
          href={hrefWith("brand")}
          active={!activeBrand}
          label="All brands"
        />
        {brands.map((brand) => (
          <FilterLink
            key={brand.id}
            href={hrefWith("brand", brand.slug)}
            active={activeBrand === brand.slug}
            label={brand.name}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <>
      {/* Mobile: collapsed by default so filters never push the grid off-screen. */}
      <details className="group rounded-2xl border border-line bg-surface p-4 lg:hidden">
        <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-ink [&::-webkit-details-marker]:hidden">
          Filters
          <span
            aria-hidden="true"
            className="text-ink-subtle transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="mt-5">{body}</div>
      </details>

      <aside aria-label="Product filters" className="hidden lg:block">
        {body}
      </aside>
    </>
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
    <section>
      <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-subtle">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-0.5">{children}</div>
    </section>
  );
}

function FilterLink({
  href,
  active,
  label,
  count,
  subtle = false,
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
  subtle?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm",
        "transition-colors duration-[var(--duration-quick)]",
        active
          ? "bg-accent-soft font-semibold text-accent-strong"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink",
        subtle && !active && "text-ink-subtle",
      )}
    >
      <span className="truncate">{label}</span>
      {count !== undefined ? (
        <span className="shrink-0 text-xs tabular-nums text-ink-subtle">{count}</span>
      ) : null}
    </Link>
  );
}
