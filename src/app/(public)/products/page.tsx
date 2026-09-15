import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogToolbar } from "@/components/site/catalog/catalog-toolbar";
import { FilterSidebar } from "@/components/site/catalog/filter-sidebar";
import { Pagination } from "@/components/site/catalog/pagination";
import { PageHeader } from "@/components/site/page-header";
import { ProductCard } from "@/components/site/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { getCatalog } from "@/lib/data";
import { getLocale } from "@/lib/i18n/locale";
import type { ProductSort } from "@/lib/domain/types";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the Kogay Karwan wholesale catalog — food, beverages, dairy, household and personal care lines supplied across Erbil.",
};

const PAGE_SIZE = 24;

type SearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: string;
};

export default async function ProductsPage({
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

  // Slugs come from the URL; resolve them to ids before querying. An unknown
  // slug resolves to undefined, which reads as "no filter" rather than an error.
  const category = params.category
    ? await catalog.getCategoryBySlug(params.category)
    : null;
  const brand = params.brand ? await catalog.getBrandBySlug(params.brand) : null;

  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const results = await catalog.listPublicProducts({
    search: params.q,
    categoryId: category?.id,
    brandId: brand?.id,
    sort: (params.sort as ProductSort) ?? "relevance",
    page,
    pageSize: PAGE_SIZE,
  });

  const brandName = (id: string | null) =>
    id ? brands.find((entry) => entry.id === id)?.name : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Everything we"
        highlight="supply"
        lead={`${results.total.toLocaleString()} lines across ${categories.length} categories. Wholesale pricing is available to approved B2B accounts.`}
        crumbs={[{ href: "/", label: "Home" }, { label: "Products" }]}
      />

      <Container size="wide" className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
          <FilterSidebar
            categories={categories}
            brands={brands}
            activeCategory={params.category}
            activeBrand={params.brand}
            searchParams={params}
          />

          <div>
            {/* useSearchParams needs a Suspense boundary to avoid opting the
                whole route out of static rendering. */}
            <Suspense fallback={<div className="h-12" />}>
              <CatalogToolbar total={results.total} locale={locale} />
            </Suspense>

            {results.items.length === 0 ? (
              <EmptyState query={params.q} />
            ) : (
              <>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {results.items.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      brandName={brandName(product.brandId)}
                      priority={index < 4}
                    />
                  ))}
                </div>

                <Pagination
                  page={results.page}
                  pageCount={results.pageCount}
                  baseHref="/products"
                  searchParams={params}
                />
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
      <h2 className="text-lg font-bold text-ink">No products found</h2>
      <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-ink-muted">
        {query
          ? `Nothing matched “${query}”. Try a shorter search, a product code, or clear the filters.`
          : "No products match these filters. Try widening your selection."}
      </p>
      <ButtonLink href="/products" variant="secondary" className="mt-6">
        Clear filters
      </ButtonLink>
    </div>
  );
}
