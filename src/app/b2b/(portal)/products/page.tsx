import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { B2BProductCard } from "@/components/portal/b2b-product-card";
import { CatalogToolbar } from "@/components/site/catalog/catalog-toolbar";
import { Pagination } from "@/components/site/catalog/pagination";
import { ButtonLink } from "@/components/ui/button";
import { getCatalog } from "@/lib/data";
import type { ProductSort } from "@/lib/domain/types";
import { localize } from "@/lib/domain/types";
import { t } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/locale";
import { cn, pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wholesale Catalog",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 24;

type SearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: string;
  stock?: string;
};

export default async function B2BProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [params, locale] = await Promise.all([searchParams, getLocale()]);
  const catalog = getCatalog();

  const [categories, brands] = await Promise.all([
    catalog.listCategoryTree(),
    catalog.listBrands(),
  ]);

  const category = params.category
    ? await catalog.getCategoryBySlug(params.category)
    : null;
  const brand = params.brand ? await catalog.getBrandBySlug(params.brand) : null;

  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  // listProducts (not listPublicProducts): inside the portal, wholesale pricing
  // is exactly what the buyer is here for.
  const results = await catalog.listProducts({
    search: params.q,
    categoryId: category?.id,
    brandId: brand?.id,
    inStockOnly: params.stock === "in",
    sort: (params.sort as ProductSort) ?? "relevance",
    page,
    pageSize: PAGE_SIZE,
  });

  const brandName = (id: string | null) =>
    id ? brands.find((entry) => entry.id === id)?.name : undefined;

  const TOP_CATEGORY_CHIPS = 14;
  const active = categories.find((entry) => entry.slug === params.category);
  const top = categories.slice(0, TOP_CATEGORY_CHIPS);
  const visibleCategories =
    active && !top.some((entry) => entry.id === active.id) ? [active, ...top] : top;
  const hiddenCount = categories.length - visibleCategories.length;

  const chipHref = (patch: Partial<SearchParams>) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...params, ...patch })) {
      if (value && key !== "page") next.set(key, value);
    }
    const query = next.toString();
    return query ? `/b2b/products?${query}` : "/b2b/products";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {t("b2b.portal", locale)}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          <bdi>{pluralize(results.total, t("catalog.products", locale))}</bdi>
        </p>
      </div>

      <Suspense fallback={<div className="h-12" />}>
        <CatalogToolbar total={results.total} locale={locale} />
      </Suspense>

      {/* Facets as chips rather than a sidebar: the portal is a working tool and
          vertical space matters more than an exhaustive filter tree. */}
      <div className="flex flex-wrap gap-2">
        <Chip href={chipHref({ stock: params.stock === "in" ? undefined : "in" })} active={params.stock === "in"}>
          {t("catalog.inStockOnly", locale)}
        </Chip>
        <Chip href={chipHref({ category: undefined })} active={!params.category}>
          {t("catalog.allCategories", locale)}
        </Chip>
        {/* The catalog has 150 categories. Rendering every chip buries the
            products under a wall of filters, so only the largest are inlined —
            plus whichever is active, which must always be visible and
            de-selectable even when it is not in the top slice. */}
        {visibleCategories.map((entry) => (
          <Chip
            key={entry.id}
            href={chipHref({ category: entry.slug })}
            active={params.category === entry.slug}
          >
            {localize(entry.name, locale)}
          </Chip>
        ))}

        {hiddenCount > 0 ? (
          <Link
            href="/categories"
            className="rounded-full border border-dashed border-line px-3.5 py-1.5 text-sm font-medium text-ink-subtle transition-colors hover:border-accent/40 hover:text-ink"
          >
            +{hiddenCount}
          </Link>
        ) : null}
      </div>

      {results.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <h2 className="text-lg font-bold text-ink">No products found</h2>
          <p className="mt-2 text-sm text-ink-muted">
            {params.q
              ? `Nothing matched “${params.q}”. Try a product code or a shorter term.`
              : "Try widening your filters."}
          </p>
          <ButtonLink href="/b2b/products" variant="secondary" className="mt-6">
            Clear filters
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {results.items.map((product) => (
              <B2BProductCard
                key={product.id}
                product={product}
                brandName={brandName(product.brandId)}
              />
            ))}
          </div>

          <Pagination
            page={results.page}
            pageCount={results.pageCount}
            baseHref="/b2b/products"
            searchParams={params}
          />
        </>
      )}
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent-strong"
          : "border-line bg-surface text-ink-muted hover:border-accent/40 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
